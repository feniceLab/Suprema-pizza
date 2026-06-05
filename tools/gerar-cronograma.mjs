#!/usr/bin/env node
// gerar-cronograma.mjs — Gerador estático Drive → assets/cronograma.json (Suprema Pizza)
//
// Lê as pastas "Semana N/{YYYY-MM-DD - Dia - Formato}/copy.md" do Drive,
// faz parse do frontmatter YAML (simples, sem dependências externas) e da copy,
// e emite um JSON único consumido pela aba Cronograma do site.
//
// FONTE DA VERDADE = os arquivos copy.md (não as tabelas de aprovação/relatório,
// que divergem). Cada copy.md tem frontmatter + legenda + versão curta + hashtags + CTA.
//
// USO:
//   node gerar-cronograma.mjs --src "<pasta do mês no Drive>" --out "<caminho do cronograma.json>"
//   node gerar-cronograma.mjs --src "/.../Cronogramas/2026-06 - Junho" --out "../assets/cronograma.json"
//
// Variáveis de ambiente equivalentes (alternativa aos flags):
//   CRONO_SRC=<pasta do mês>  CRONO_OUT=<saida.json>  node gerar-cronograma.mjs
//
// Sem --out o JSON é impresso no stdout (útil pra inspecionar / redirecionar).
//
// IMPORTANTE: o Drive vive na máquina local (Mac), não na VPS. Rode este script
// onde o Drive está montado; depois suba o cronograma.json gerado para o staging.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

// ---------- args / env ----------
function getArg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : null;
}
const SRC = getArg('src') || process.env.CRONO_SRC;
const OUT = getArg('out') || process.env.CRONO_OUT || null;

if (!SRC) {
  console.error('ERRO: informe a pasta do mês com --src "<caminho>" ou CRONO_SRC=<caminho>.');
  process.exit(1);
}
if (!existsSync(SRC)) {
  console.error(`ERRO: pasta de origem não encontrada: ${SRC}`);
  process.exit(1);
}

// ---------- parser de frontmatter YAML (subset chave: valor) ----------
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    meta[key] = val;
  }
  return { meta, body: m[2] };
}

// ---------- extrai seções da copy ----------
function section(body, ...titles) {
  // captura o conteúdo de um heading "## ..." até o próximo heading "##"
  for (const t of titles) {
    const re = new RegExp(`^#{1,3}[^\\n]*${t}[^\\n]*\\n([\\s\\S]*?)(?=\\n#{1,3}\\s|$)`, 'mi');
    const mm = body.match(re);
    if (mm) return mm[1].trim();
  }
  return '';
}

function stripMd(s) {
  return (s || '').replace(/\*\*/g, '').replace(/`/g, '').trim();
}

function firstParagraph(text) {
  if (!text) return '';
  // primeiro bloco não-vazio, ignorando blockquotes/listas de meta
  for (const block of text.split(/\n\s*\n/)) {
    const clean = block.trim();
    if (!clean) continue;
    if (clean.startsWith('>') || clean.startsWith('-') || clean.startsWith('|')) continue;
    return stripMd(clean.replace(/\n+/g, ' '));
  }
  return '';
}

function extractHashtags(body) {
  const sec = section(body, 'Hashtags', '#️⃣');
  const tags = (sec.match(/#[\wáàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ]+/g) || []).map((t) => t.trim());
  return [...new Set(tags)];
}

function extractCurta(body) {
  // "### Versão curta" (reel/stories)
  const re = /###\s*Vers[aã]o curta[^\n]*\n([\s\S]*?)(?=\n#{1,3}\s|$)/i;
  const mm = body.match(re);
  return mm ? firstParagraph(mm[1]) : '';
}

function extractGancho(body, meta, legendaCurta) {
  // gancho = a pergunta/CTA de interação. Tenta achar uma linha com "?" + emoji/negrito.
  const lines = body.split('\n');
  for (const ln of lines) {
    const l = ln.trim();
    if (/^👉|^🐔|^🍫|^🧀/.test(l) || (/\?/.test(l) && /\*\*|👉|responde|comenta|marca|chuta|adivinha|encara/i.test(l))) {
      return stripMd(l.replace(/^👉\s*/, ''));
    }
  }
  // fallback: versão curta (já extraída), senão 1ª frase da legenda
  return legendaCurta || '';
}

// ---------- normalização ----------
function normFormato(meta, folderName) {
  const raw = ((meta.formato || '') + ' ' + folderName).toLowerCase();
  if (raw.includes('carrossel')) return 'carrossel';
  if (raw.includes('foto') && !raw.includes('video')) return 'foto';
  if (raw.includes('video') || raw.includes('reel')) return 'video';
  return 'video';
}

// mapeia status textual (frontmatter) → estado canônico do site
const STATUS_MAP = [
  [/postado|publicad/i, 'postado'],
  [/aprovad/i, 'aprovado'],
  [/pronto|produzido|aguardando-post|aguardando post/i, 'pronto'],
  [/produ[cç][aã]o|refinado|em produ/i, 'producao'],
  [/aguardando fotos|a produzir|rascunho|pendente/i, 'a-aprovar'],
];
function normStatus(meta) {
  const s = (meta.status || '').toString();
  for (const [re, out] of STATUS_MAP) if (re.test(s)) return out;
  return 'a-aprovar';
}

// pilar de conteúdo (cor) inferido do tema/objetivo
function inferPilar(meta) {
  const t = `${meta.tema || ''} ${meta.objetivo || ''} ${meta.sabor || ''}`.toLowerCase();
  if (/bastidor|processo|branding|institucional|a suprema/.test(t)) {
    if (/bastidor|processo/.test(t)) return 'bastidor';
    return 'instit';
  }
  if (/lan[cç]amento|novidade|sazonal|namorados|junina|festa/.test(t)) return 'promo';
  if (/review|prova social|depoimento/.test(t)) return 'social';
  return 'produto';
}

function novidadeFlag(meta) {
  const t = `${meta.tema || ''} ${meta.objetivo || ''}`.toLowerCase();
  return /novidade|lan[cç]amento|nunca postado/.test(t) || /nutella|brie|geleia de pimenta|paçoca|paçoca|doce de leite|borda de pasta de alho/i.test(meta.sabor || meta.tema || '');
}
function sazonalFlag(meta) {
  const t = `${meta.tema || ''} ${meta.sazonal || ''}`;
  if (meta.sazonal && meta.sazonal.trim()) return meta.sazonal.trim();
  if (/namorados/i.test(t)) return 'Dia dos Namorados';
  if (/junina|s[aã]o jo[aã]o/i.test(t)) return 'Festa Junina / São João';
  return null;
}

const DIA_ABBR = { 'segunda': 'SEG', 'terça': 'TER', 'terca': 'TER', 'quarta': 'QUA', 'quinta': 'QUI', 'sexta': 'SEX', 'sábado': 'SÁB', 'sabado': 'SÁB', 'domingo': 'DOM' };
function diaAbbr(meta) {
  const d = (meta.dia_semana || '').toLowerCase().trim();
  return DIA_ABBR[d] || d.slice(0, 3).toUpperCase();
}

// ---------- varredura ----------
const semanaDirs = readdirSync(SRC)
  .filter((n) => /^Semana\s+\d+/i.test(n))
  .sort((a, b) => (parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10)));

const semanas = [];
let totVideo = 0, totCarrossel = 0, totFoto = 0, totFeeds = 0;

for (const semDir of semanaDirs) {
  const n = parseInt(semDir.match(/\d+/)[0], 10);
  const semPath = join(SRC, semDir);
  const postDirs = readdirSync(semPath)
    .filter((p) => {
      if (p.startsWith('_') || p.startsWith('.')) return false;
      try { return statSync(join(semPath, p)).isDirectory() && existsSync(join(semPath, p, 'copy.md')); }
      catch { return false; }
    })
    .sort();

  const posts = [];
  for (const pd of postDirs) {
    const copyPath = join(semPath, pd, 'copy.md');
    const raw = readFileSync(copyPath, 'utf8');
    const { meta, body } = parseFrontmatter(raw);

    const formato = normFormato(meta, pd);
    if (formato === 'carrossel') totCarrossel++; else if (formato === 'foto') totFoto++; else totVideo++;
    totFeeds++;

    const legendaSec = section(body, 'Legenda final', 'Legenda do POST', 'Legenda');
    const legenda_curta = extractCurta(body) || firstParagraph(legendaSec);

    posts.push({
      data: meta.data || '',
      dia: diaAbbr(meta),
      formato,
      sabor: (meta.sabor || meta.tema || '').trim(),
      tema: (meta.tema || '').trim(),
      pilar: inferPilar(meta),
      gancho: extractGancho(body, meta, legenda_curta),
      legenda_curta,
      hashtags: extractHashtags(body),
      cta: firstParagraph(section(body, 'CTA', '📌')),
      status: normStatus(meta),
      novidade: !!novidadeFlag(meta),
      sazonal: sazonalFlag(meta),
    });
  }

  semanas.push({ n, label: `Semana ${n}`, posts });
}

// stories recorrentes: vêm do RELATORIO (10 stop motions o mês todo, ~29 stories).
// Não há copy.md por story; registramos o agregado declarado no índice do cliente.
const STORIES_TOTAL = 29;

const out = {
  cliente: 'Suprema Pizza',
  handle: '@asupremapizza',
  mes: '2026-06',
  titulo: 'Junho 2026',
  ritmo: 'Seg = Vídeo · Qua = Carrossel · Sex = Vídeo · stories recorrentes',
  stats: {
    feeds: totFeeds,
    reels: totVideo,
    carrosseis: totCarrossel,
    fotos: totFoto,
    stories: STORIES_TOTAL,
    total: totFeeds + STORIES_TOTAL,
  },
  pilares: [
    { id: 'produto', label: 'Produto · sabor', cor: '#D62020' },
    { id: 'promo', label: 'Novidade · lançamento', cor: '#C0392B' },
    { id: 'bastidor', label: 'Bastidores · processo', cor: '#E63946' },
    { id: 'social', label: 'Prova social · review', cor: '#8B9D5B' },
    { id: 'instit', label: 'Institucional · marca', cor: '#6A8CAF' },
  ],
  semanas,
};

const json = JSON.stringify(out, null, 2);
if (OUT) {
  writeFileSync(resolve(OUT), json + '\n', 'utf8');
  const np = semanas.reduce((a, s) => a + s.posts.length, 0);
  console.error(`OK: ${np} posts em ${semanas.length} semanas → ${resolve(OUT)}`);
} else {
  process.stdout.write(json + '\n');
}
