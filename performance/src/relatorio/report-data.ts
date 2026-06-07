// ============================================================
// Dados dos relatórios de performance (Maio/2026).
// Fonte: services/relatorios/<slug>/relatorio-maio.html (relatórios entregues).
// Tipados para alimentar o componente React <Relatorio/>.
// ============================================================
import supremaLogo from './logos/suprema.png';
import arenaLogo from './logos/arena.png';

export interface RepStat { label: string; value: string }
export interface RepAd {
  pos: number;
  name: string;
  status: 'active' | 'paused';
  cells: { value: string; label: string }[];
  roas: string;
  roasTone?: 'ok' | 'warn' | 'bad';
}
export interface RepAdset {
  name: string;
  budget: string;
  metrics: RepStat[];
  adsHeader: string;
  ads: RepAd[];
  note?: string;
}
export interface RepCampaign {
  pos: number;
  name: string;
  tag: string;
  roas: string;
  tone: 'champion' | 'warn' | 'bad' | 'normal';
  stats: RepStat[];
  adset?: RepAdset;
}
export interface RepSection {
  title: string;
  desc?: string;
  seasonal?: boolean;
  campaigns: RepCampaign[];
  subtotal?: string;
}
export interface RepFunnelStage { label: string; value: string; drop?: string; dropOk?: boolean; final?: boolean }
// ── Operação da loja por canal (cardápio digital / PDV) — incremento opcional ──
export interface RepOpModal { label: string; pedidos?: string; valor: string; pct: number /* 0-100 p/ barra */ }
export interface RepOpCanal {
  nome: string;
  tom?: 'site' | 'manual' | 'ifood';
  pedidos: string; faturamento: string; ticket: string; novos?: string;
  modalidades: RepOpModal[];
}
export interface RepOperacao {
  title: string;
  desc?: string;
  /** KPIs do topo (Pedidos, Faturamento, etc.) — flexível por cliente. */
  total: { label: string; value: string; accent?: boolean }[];
  /** proporção do faturamento por canal (barra empilhada). */
  proporcao?: { label: string; pct: number; tom?: 'site' | 'manual' | 'ifood' }[];
  canais: RepOpCanal[];
  note?: string;
}
// ── Funil do cardápio digital (Site): visitas → pedido ──
export interface RepSiteStage { label: string; value: string; pct: string; pctNum: number; final?: boolean }
export interface RepSiteFunnel {
  title: string;
  desc?: string;
  stages: RepSiteStage[];
  foot: { text: string; value: string; accent?: boolean }[];
}
export interface RelatorioData {
  slug: string;
  cliente: string;
  /** logo do cliente (URL do asset); ausente = usa o nome em texto. */
  logo?: string;
  period: { month: string; year: string; range: string; status: string };
  tagline?: { l1: string; l2: string };
  hero: { kicker: string; amount: string; investido: string; roas: string; compras: string; netLabel: string; netAmount: string };
  kpis: { label: string; value: string; tone?: 'accent' | 'ok' }[];
  stats: { label: string; value: string; sub: string }[];
  funnel: {
    stages: RepFunnelStage[];
    foot: { text: string; value: string; accent?: boolean }[];
  };
  sections: RepSection[];
  /** Operação da loja por canal (Site/Manual/iFood) — incremento opcional. */
  operacao?: RepOperacao;
  /** Funil de conversão do cardápio digital (Site) — opcional. */
  siteFunnel?: RepSiteFunnel;
  /** Comparativo da mídia paga vs mês anterior (linha de ▲▼) — opcional. */
  midiaVsAnterior?: { text: string; value: string; tone?: 'up' | 'down' }[];
  footer: { tagline: string; period: string };
}

const FENICE_FOOTER = {
  tagline: 'Operação mantida por <strong>Fenice Lab</strong> · Marketing Digital & Performance · Blumenau/SC',
  period: '01/05/2026 a 31/05/2026',
};

// ─────────────────────────── SUPREMA PIZZA ───────────────────────────
const suprema: RelatorioData = {
  slug: 'suprema',
  cliente: 'Suprema Pizza',
  logo: supremaLogo,
  period: { month: 'Maio', year: '2026', range: '01.05.2026 — 31.05.2026 · 31 dias', status: '✓ Mês Fechado' },
  tagline: { l1: 'Quando o queijo escorre…', l2: 'a pizza tá no ponto.' },
  hero: {
    kicker: '💰 Valor de Conversão em Compra',
    amount: 'R$ 39.789,72',
    investido: 'R$ 2.350,84',
    roas: '16,93×',
    compras: '324 compras',
    netLabel: 'Retorno líquido',
    netAmount: 'R$ 37.438,88',
  },
  kpis: [
    { label: 'Investimento', value: 'R$ 2.350,84' },
    { label: 'Compras', value: '324', tone: 'accent' },
    { label: 'Ticket Médio', value: 'R$ 122,81' },
    { label: 'CPA', value: 'R$ 7,26' },
  ],
  stats: [
    { label: 'Impressões', value: '442.014', sub: 'CPM R$ 5,32' },
    { label: 'Alcance', value: '103.877', sub: 'pessoas únicas · freq 4,26' },
    { label: 'Adições ao Carrinho', value: '555', sub: '337 iniciaram compra' },
  ],
  funnel: {
    stages: [
      { label: 'Impressões', value: '442.014' },
      { label: 'Alcance único', value: '103.877', drop: '↓ 23,5%', dropOk: true },
      { label: 'Cliques no Anúncio', value: '3.583', drop: '↓ 96,6%' },
      { label: 'Cliques no Link', value: '3.029', drop: '↓ 15,5%', dropOk: true },
      { label: 'Adições ao Carrinho', value: '555', drop: '↓ 81,7%' },
      { label: 'Iniciaram Compra', value: '337', drop: '↓ 39,3%', dropOk: true },
      { label: 'Compras', value: '324', drop: '↓ 3,9%', dropOk: true, final: true },
    ],
    foot: [
      { text: 'Taxa global de conversão', value: '9,04%' },
      { text: 'CR clique→compra', value: '10,7%', accent: true },
      { text: 'Taxa de checkout', value: '60,7%' },
    ],
  },
  sections: [
    {
      title: 'Ranking de Campanhas',
      desc: 'Cada campanha com seu conjunto e os top anúncios por gasto. Dados consolidados de 01 a 31 de maio.',
      campaigns: [
        {
          pos: 1, name: '[STARKEN][VENDAS][MAIO][01]', tag: 'Melhor ROAS · Campanha jovem', roas: '29,15×', tone: 'champion',
          stats: [
            { label: 'Gasto', value: 'R$ 594,01' }, { label: 'Vendas', value: '140' },
            { label: 'Ticket', value: 'R$ 123,65' }, { label: 'CPA', value: 'R$ 4,24' },
          ],
          adset: {
            name: 'CA - CARDAPIO - 8KM', budget: 'Lifetime R$ 1.500',
            metrics: [
              { label: 'Imp', value: '99.777' }, { label: 'Alcance', value: '17.052' }, { label: 'Freq', value: '5,85' },
              { label: 'CTR', value: '0,69%' }, { label: 'CPM', value: 'R$ 5,95' }, { label: 'CPC', value: 'R$ 0,86' },
            ],
            adsHeader: 'Top 3 anúncios · por gasto',
            ads: [
              { pos: 1, name: 'AD 03 # — Cardápio', status: 'active', cells: [{ value: 'R$ 310,49', label: 'gasto' }, { value: '73', label: 'vendas' }, { value: '0,63%', label: 'CTR' }], roas: '28,71×' },
              { pos: 2, name: 'AD 02 # — Cardápio', status: 'active', cells: [{ value: 'R$ 230,67', label: 'gasto' }, { value: '58', label: 'vendas' }, { value: '0,68%', label: 'CTR' }], roas: '30,76×' },
              { pos: 3, name: 'AD 04 # — Cardápio', status: 'active', cells: [{ value: 'R$ 44,77', label: 'gasto' }, { value: '8', label: 'vendas' }, { value: '1,34%', label: 'CTR' }], roas: '25,68×' },
            ],
          },
        },
        {
          pos: 2, name: '[STARKEN][VENDAS][FEV]', tag: 'Cavalo de batalha · 4 meses no ar', roas: '16,34×', tone: 'normal',
          stats: [
            { label: 'Gasto', value: 'R$ 1.357,86' }, { label: 'Vendas', value: '181' },
            { label: 'Ticket', value: 'R$ 122,60' }, { label: 'CPA', value: 'R$ 7,50' },
          ],
          adset: {
            name: 'CA - CARDAPIO - 8KM', budget: 'Lifetime R$ 4.400',
            metrics: [
              { label: 'Imp', value: '259.803' }, { label: 'Alcance', value: '54.266' }, { label: 'Freq', value: '4,79' },
              { label: 'CTR', value: '0,49%' }, { label: 'CPM', value: 'R$ 5,23' }, { label: 'CPC', value: 'R$ 1,07' },
            ],
            adsHeader: 'Top 3 anúncios · por gasto',
            ads: [
              { pos: 1, name: 'AD 01 # Cópia — Cardápio', status: 'active', cells: [{ value: 'R$ 989,25', label: 'gasto' }, { value: '115', label: 'vendas' }, { value: '0,39%', label: 'CTR' }], roas: '13,85×' },
              { pos: 2, name: 'AD 02 # — Cardápio', status: 'active', cells: [{ value: 'R$ 272,57', label: 'gasto' }, { value: '52', label: 'vendas' }, { value: '0,83%', label: 'CTR' }], roas: '25,51×' },
              { pos: 3, name: 'AD 03 # — Cardápio', status: 'active', cells: [{ value: 'R$ 96,04', label: 'gasto' }, { value: '13', label: 'vendas' }, { value: '0,46%', label: 'CTR' }], roas: '14,57×' },
            ],
          },
        },
        {
          pos: 3, name: '[STARKEN][PERFIL][SEGUIDORES]', tag: 'Tráfego perfil · objetivo é audiência, não vendas', roas: '0,63×', tone: 'warn',
          stats: [
            { label: 'Gasto', value: 'R$ 313,41' }, { label: 'Cliques link', value: '1.422' },
            { label: 'CPC', value: 'R$ 0,22' }, { label: 'Vendas residuais', value: '2' },
          ],
          adset: {
            name: 'CA - PERFIL', budget: 'Daily R$ 10',
            metrics: [
              { label: 'Imp', value: '75.575' }, { label: 'Alcance', value: '48.723' }, { label: 'Freq', value: '1,55' },
              { label: 'CTR', value: '1,90%' }, { label: 'CPM', value: 'R$ 4,15' }, { label: 'CPC', value: 'R$ 0,22' },
            ],
            adsHeader: 'Anúncios ativos',
            ads: [
              { pos: 1, name: 'AD 01 # — Perfil', status: 'active', cells: [{ value: 'R$ 311,53', label: 'gasto' }, { value: '1.420', label: 'cliques' }, { value: '1,89%', label: 'CTR' }], roas: '0,64×', roasTone: 'warn' },
              { pos: 2, name: 'AD 02 # — Perfil (teste)', status: 'active', cells: [{ value: 'R$ 1,88', label: 'gasto' }, { value: '11', label: 'cliques' }, { value: '5,05%', label: 'CTR' }], roas: '—', roasTone: 'bad' },
            ],
            note: 'Observação: esta campanha tem objetivo LINK_CLICKS (não vendas). As 2 vendas registradas são atribuição residual — o ROAS aqui não é métrica de sucesso.',
          },
        },
        {
          pos: 4, name: '[SUPREMA PIZZA][VENDAS][FOOD PORN][SEX-DOM 29-31/05]', tag: 'Campanha-teste gourmet · ABO · 3 dias', roas: '1,21×', tone: 'bad',
          stats: [
            { label: 'Gasto', value: 'R$ 85,65' }, { label: 'Vendas', value: '1' },
            { label: 'Ticket', value: 'R$ 103,66' }, { label: 'CPA', value: 'R$ 85,65' },
          ],
          adset: {
            name: 'CA - CARDAPIO DIGITAL - 8KM - FOOD PORN', budget: 'Lifetime R$ 90',
            metrics: [
              { label: 'Imp', value: '6.863' }, { label: 'Alcance', value: '4.723' }, { label: 'Freq', value: '1,45' },
              { label: 'CTR', value: '2,58%' }, { label: 'CPM', value: 'R$ 12,48' }, { label: 'CPC', value: 'R$ 0,48' },
            ],
            adsHeader: 'Top anúncios',
            ads: [
              { pos: 1, name: 'Geleia de Pimenta + Brie', status: 'active', cells: [{ value: 'R$ 75,64', label: 'gasto' }, { value: '1', label: 'venda' }, { value: '2,34%', label: 'CTR' }], roas: '1,37×', roasTone: 'warn' },
              { pos: 2, name: 'Nutella + Morango (Bossa Nova)', status: 'active', cells: [{ value: 'R$ 10,01', label: 'gasto' }, { value: '0', label: 'vendas' }, { value: '6,42%', label: 'CTR' }], roas: '—', roasTone: 'bad' },
            ],
            note: 'Leitura: teste-piloto com budget baixo (R$ 90 em 3 dias). CTR alto (2,58%) sinaliza interesse no produto gourmet, mas conversão exige aprofundamento — recomendamos novo ciclo com budget escalado e ad set CBO.',
          },
        },
      ],
    },
  ],
  operacao: {
    title: 'Operação da Loja · por modalidade',
    desc: 'Vendas de Maio por modalidade e forma de pagamento. Pix automático = checkout do cardápio digital próprio · iFood (online) = canal marketplace.',
    total: [
      { label: 'Pedidos', value: '1.688' },
      { label: 'Faturamento', value: 'R$ 205.830', accent: true },
      { label: 'Ticket Médio', value: 'R$ 121,94' },
      { label: 'Cardápio Digital', value: 'R$ 30.677' },
    ],
    proporcao: [
      { label: 'Entrega', pct: 71.3, tom: 'site' },
      { label: 'Retirada', pct: 28.7, tom: 'manual' },
    ],
    canais: [
      {
        nome: 'Entrega', tom: 'site',
        pedidos: '1.167', faturamento: 'R$ 146.739', ticket: 'R$ 125,74',
        modalidades: [
          { label: 'Cartão', valor: 'R$ 66.837', pct: 45.5 },
          { label: 'iFood', valor: 'R$ 44.220', pct: 30.1 },
          { label: 'Pix (cardápio)', valor: 'R$ 23.958', pct: 16.3 },
          { label: 'Dinheiro', valor: 'R$ 11.725', pct: 8.0 },
        ],
      },
      {
        nome: 'Retirada', tom: 'manual',
        pedidos: '521', faturamento: 'R$ 59.091', ticket: 'R$ 113,42',
        modalidades: [
          { label: 'Cartão', valor: 'R$ 44.013', pct: 74.5 },
          { label: 'Pix (cardápio)', valor: 'R$ 6.719', pct: 11.4 },
          { label: 'Dinheiro', valor: 'R$ 6.283', pct: 10.6 },
          { label: 'iFood', valor: 'R$ 2.076', pct: 3.5 },
        ],
      },
    ],
    note: 'Mesa: 0 pedidos no período. *Cartão e Dinheiro são pagos no ato (entrega/balcão) e não identificam o canal de origem — por isso a operação aqui é por modalidade + forma de pagamento (e não Site/Manual/iFood como em outros clientes).',
  },
  footer: FENICE_FOOTER,
};

// ─────────────────────────── ARENA GOURMET ───────────────────────────
const arena: RelatorioData = {
  slug: 'arena',
  cliente: 'Arena Gourmet',
  logo: arenaLogo,
  period: { month: 'Maio', year: '2026', range: '01.05.2026 — 31.05.2026 · 31 dias', status: '✓ Mês Fechado' },
  tagline: { l1: 'Hambúrguer feito na brasa.', l2: 'O fogo faz a diferença.' },
  hero: {
    kicker: '💰 Valor de Conversão em Compra',
    amount: 'R$ 7.851,59',
    investido: 'R$ 1.137,10',
    roas: '6,90×',
    compras: '84 compras',
    netLabel: 'Retorno líquido',
    netAmount: 'R$ 6.714,49',
  },
  kpis: [
    { label: 'Investimento', value: 'R$ 1.137' },
    { label: 'Compras', value: '84', tone: 'accent' },
    { label: 'Ticket Médio', value: 'R$ 93,47' },
    { label: 'CPA', value: 'R$ 13,54' },
  ],
  stats: [
    { label: 'Impressões', value: '188.388', sub: 'CPM R$ 6,04 · CTR 0,84%' },
    { label: 'Alcance', value: '79.595', sub: 'pessoas únicas · freq 2,37' },
    { label: 'Adições ao Carrinho', value: '386', sub: '165 iniciaram compra' },
  ],
  funnel: {
    stages: [
      { label: 'Impressões', value: '188.388' },
      { label: 'Alcance único', value: '79.595', drop: '↓ 57,7%', dropOk: true },
      { label: 'Cliques no Anúncio', value: '1.582', drop: '↓ 98,0%' },
      { label: 'Cliques no Link', value: '888', drop: '↓ 43,9%', dropOk: true },
      { label: 'Adições ao Carrinho', value: '386', drop: '↓ 56,5%' },
      { label: 'Iniciaram Compra', value: '165', drop: '↓ 57,3%', dropOk: true },
      { label: 'Compras', value: '84', drop: '↓ 49,1%', dropOk: true, final: true },
    ],
    foot: [
      { text: 'Taxa global', value: '9,46%' },
      { text: 'CR clique→ATC', value: '43,5%', accent: true },
      { text: 'Checkout→Compra', value: '50,9%' },
    ],
  },
  sections: [
    {
      title: 'Campanhas Permanentes',
      campaigns: [
        {
          pos: 1, name: '[STARKEN][VENDAS][03]', tag: 'Campeã do mês · escalável', roas: '9,39×', tone: 'champion',
          stats: [
            { label: 'Gasto', value: 'R$ 343,18' }, { label: 'Vendas', value: '35' },
            { label: 'Ticket', value: 'R$ 92,10' }, { label: 'CPA', value: 'R$ 9,81' },
          ],
          adset: {
            name: '[WAR]', budget: 'OFFSITE_CONVERSIONS',
            metrics: [
              { label: 'Imp', value: '42.639' }, { label: 'Alcance', value: '11.337' }, { label: 'Freq', value: '3,76' },
              { label: 'CTR', value: '0,84%' }, { label: 'CPM', value: 'R$ 8,05' }, { label: 'CPC', value: 'R$ 0,95' },
            ],
            adsHeader: 'Top 3 anúncios · por gasto',
            ads: [
              { pos: 1, name: 'AD 04 #', status: 'active', cells: [{ value: 'R$ 130,20', label: 'gasto' }, { value: '11', label: 'vendas' }, { value: '0,76%', label: 'CTR' }], roas: '8,04×' },
              { pos: 2, name: 'AD 03 # ⭐', status: 'active', cells: [{ value: 'R$ 97,65', label: 'gasto' }, { value: '13', label: 'vendas' }, { value: '0,78%', label: 'CTR' }], roas: '13,49×' },
              { pos: 3, name: 'AD 01 #', status: 'active', cells: [{ value: 'R$ 77,25', label: 'gasto' }, { value: '6', label: 'vendas' }, { value: '0,95%', label: 'CTR' }], roas: '6,43×' },
            ],
            note: 'Destaque: AD 03 # com ROAS 13,49× é o melhor criativo da operação Arena em Maio. Candidato a virar template pra próximas campanhas.',
          },
        },
        {
          pos: 2, name: '[STARKEN][VENDAS][02]', tag: 'Performance sólida', roas: '7,05×', tone: 'normal',
          stats: [
            { label: 'Gasto', value: 'R$ 347,66' }, { label: 'Vendas', value: '27' },
            { label: 'Ticket', value: 'R$ 90,75' }, { label: 'CPA', value: 'R$ 12,88' },
          ],
          adset: {
            name: 'MIX DE MORNO · 4km · IG & FB · 18-45', budget: 'OFFSITE_CONVERSIONS',
            metrics: [
              { label: 'Imp', value: '44.322' }, { label: 'Alcance', value: '9.771' }, { label: 'Freq', value: '4,54' },
              { label: 'CTR', value: '0,57%' }, { label: 'CPM', value: 'R$ 7,84' }, { label: 'CPC', value: 'R$ 1,37' },
            ],
            adsHeader: 'Top anúncios',
            ads: [
              { pos: 1, name: 'AD — Impressão', status: 'active', cells: [{ value: 'R$ 338,65', label: 'gasto' }, { value: '27', label: 'vendas' }, { value: '0,57%', label: 'CTR' }], roas: '7,24×' },
              { pos: 2, name: 'Review Isabel Narrado', status: 'paused', cells: [{ value: 'R$ 9,01', label: 'gasto' }, { value: '0', label: 'vendas' }, { value: '0,73%', label: 'CTR' }], roas: '—', roasTone: 'bad' },
            ],
            note: 'Observação: Freq 4,54 mostra saturação do público (público pequeno e quente). Considerar ampliar o targeting ou rotacionar criativos.',
          },
        },
        {
          pos: 3, name: '[STARKEN][VENDAS][01]', tag: 'Maior ticket médio', roas: '6,33×', tone: 'normal',
          stats: [
            { label: 'Gasto', value: 'R$ 290,02' }, { label: 'Vendas', value: '18' },
            { label: 'Ticket', value: 'R$ 101,93' }, { label: 'CPA', value: 'R$ 16,11' },
          ],
          adset: {
            name: 'Aberto · 5km · AMPLO · AUTO', budget: 'OFFSITE_CONVERSIONS',
            metrics: [
              { label: 'Imp', value: '37.713' }, { label: 'Alcance', value: '15.178' }, { label: 'Freq', value: '2,48' },
              { label: 'CTR', value: '1,82%' }, { label: 'CPM', value: 'R$ 7,69' }, { label: 'CPC', value: 'R$ 0,42' },
            ],
            adsHeader: 'Top anúncios',
            ads: [
              { pos: 1, name: 'Carrossel · Fotos + CTA', status: 'active', cells: [{ value: 'R$ 285,65', label: 'gasto' }, { value: '18', label: 'vendas' }, { value: '1,84%', label: 'CTR' }], roas: '6,42×' },
              { pos: 2, name: 'Foto Hambúrguer Detalhada', status: 'paused', cells: [{ value: 'R$ 4,34', label: 'gasto' }, { value: '0', label: 'vendas' }, { value: '0,53%', label: 'CTR' }], roas: '—', roasTone: 'bad' },
            ],
          },
        },
      ],
      subtotal: 'Subtotal Permanentes · R$ 980,86 invest · 80 vendas · faturamento R$ 7.508,44 · ROAS médio <b>7,65×</b>',
    },
    {
      title: 'Sazonais · Dia do Hambúrguer',
      seasonal: true,
      desc: 'Campanhas pontuais ativadas exclusivamente no Dia Mundial do Hambúrguer (28/05). Performance separada das permanentes pra análise justa do evento.',
      campaigns: [
        {
          pos: 1, name: '[STARKEN][VENDAS][03] — Cópia', tag: 'Conversão · 3 dias do evento', roas: '2,91×', tone: 'warn',
          stats: [
            { label: 'Gasto', value: 'R$ 65,86' }, { label: 'Vendas', value: '2' },
            { label: 'Ticket', value: 'R$ 95,83' }, { label: 'CPA', value: 'R$ 32,93' },
          ],
        },
        {
          pos: 2, name: '[STARKEN][RECO][28/05]', tag: 'Awareness · objetivo é alcance, não vendas', roas: '1,68×', tone: 'bad',
          stats: [
            { label: 'Gasto', value: 'R$ 90,38' }, { label: 'Vendas', value: '2' },
            { label: 'Alcance', value: '55.574' }, { label: 'CPA', value: 'R$ 45,19' },
          ],
          adset: {
            name: '[CA][LINK][RECO][28/05]', budget: 'REACH',
            metrics: [
              { label: 'Imp', value: '58.183' }, { label: 'Alcance', value: '55.574' }, { label: 'Freq', value: '1,05' },
              { label: 'CTR', value: '0,19%' }, { label: 'CPM', value: 'R$ 1,55' }, { label: 'CPC', value: 'R$ 0,80' },
            ],
            adsHeader: 'Conjunto único',
            ads: [],
          },
        },
      ],
      subtotal: 'Subtotal Sazonais · R$ 156,24 invest · 4 vendas · faturamento R$ 343,15 · ROAS médio <b>2,20×</b>',
    },
  ],
  operacao: {
    title: 'Operação da Loja · por canal',
    desc: 'Panorama completo da loja em Maio (todos os canais — não só o que a mídia paga atribuiu). Mostra o peso do canal próprio digital (Site) vs iFood vs balcão/PDV.',
    total: [
      { label: 'Pedidos', value: '1.403' },
      { label: 'Faturamento', value: 'R$ 139.906', accent: true },
      { label: 'Ticket Médio', value: 'R$ 99,72' },
      { label: 'Novos Clientes', value: '211' },
    ],
    proporcao: [
      { label: 'Balcão/PDV', pct: 52.3, tom: 'manual' },
      { label: 'Site', pct: 25.7, tom: 'site' },
      { label: 'iFood', pct: 22.0, tom: 'ifood' },
    ],
    canais: [
      {
        nome: 'Site · cardápio próprio', tom: 'site',
        pedidos: '384', faturamento: 'R$ 35.931', ticket: 'R$ 93,57', novos: '85',
        modalidades: [
          { label: 'Entrega', pedidos: '294', valor: 'R$ 29.178', pct: 81.2 },
          { label: 'Retirada', pedidos: '78', valor: 'R$ 5.563', pct: 15.5 },
          { label: 'Presencial', pedidos: '12', valor: 'R$ 1.190', pct: 3.3 },
        ],
      },
      {
        nome: 'Manual · balcão/PDV', tom: 'manual',
        pedidos: '642', faturamento: 'R$ 73.212', ticket: 'R$ 114,04', novos: '13',
        modalidades: [
          { label: 'Presencial', pedidos: '472', valor: 'R$ 60.019', pct: 82.0 },
          { label: 'Retirada', pedidos: '101', valor: 'R$ 7.098', pct: 9.7 },
          { label: 'Entrega', pedidos: '69', valor: 'R$ 6.095', pct: 8.3 },
        ],
      },
      {
        nome: 'iFood · marketplace', tom: 'ifood',
        pedidos: '377', faturamento: 'R$ 30.762', ticket: 'R$ 81,60', novos: '113',
        modalidades: [
          { label: 'Entrega', pedidos: '388*', valor: 'R$ 30.035', pct: 97.6 },
          { label: 'Retirada', pedidos: '9*', valor: 'R$ 728', pct: 2.4 },
        ],
      },
    ],
    note: 'Canal próprio (Site) rende mais que o iFood, com ticket maior e sem comissão de marketplace — é o canal mais rentável e o destino natural da mídia paga. *iFood: divisão por pedido em reconfirmação (faturamento confere; contagem de pedidos diverge da soma das modalidades).',
  },
  siteFunnel: {
    title: 'Funil do Cardápio Digital · Site',
    desc: 'Conversão do cardápio digital próprio em Maio — da visita até o pedido concluído.',
    stages: [
      { label: 'Visitas', value: '2.026', pct: '100%', pctNum: 100 },
      { label: 'Visualizações', value: '877', pct: '43,29%', pctNum: 43.29 },
      { label: 'Sacola', value: '568', pct: '28,04%', pctNum: 28.04 },
      { label: 'Revisão', value: '489', pct: '24,14%', pctNum: 24.14 },
      { label: 'Concluídos', value: '394', pct: '19,45%', pctNum: 19.45, final: true },
    ],
    foot: [
      { text: 'Conversão (visita → pedido)', value: '19,45%', accent: true },
      { text: 'Sacola → Pedido', value: '69,4%' },
      { text: 'Melhor semana (01–03/05)', value: '26,8%' },
    ],
  },
  footer: FENICE_FOOTER,
};

export const REPORTS: Record<string, RelatorioData> = { suprema, arena };
