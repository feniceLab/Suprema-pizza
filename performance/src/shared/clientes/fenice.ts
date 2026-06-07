// ============================================================
// Clientes Fenice Lab — FONTE DA VERDADE (versionada no repo)
// Identidade canônica dos clientes da agência Fenice Lab.
// Métricas/status ao vivo vêm do serviço de relatórios; aqui ficam
// os dados estáveis (slug, contas, marca, URLs).
// Fonte original: dashboard-tr-fego-pago/data/clients-mapping.json
// ============================================================

export const AGENCIA = 'Fenice Lab' as const;

export type ClienteStatus = 'ativo' | 'setup';

export interface ClienteFenice {
  /** identificador estável usado em URLs (/portal, /<slug>-report.html). */
  slug: string;
  /** nome de exibição. */
  nome: string;
  /** inicial para avatar/letra. */
  letter: string;
  /** segmento curto (categoria · cidade). */
  seg: string;
  /** @username do Instagram (sem @). null enquanto não há conta. */
  ig: string | null;
  agencia: typeof AGENCIA;
  /** Meta Ads — IDs (null enquanto o cliente não foi provisionado). */
  adAccountId: string | null;
  pageId: string | null;
  pixelId: string | null;
  /** estado operacional. */
  status: ClienteStatus;
  /** rótulo amigável do status (mostrado quando em setup). */
  statusLabel: string;
  /** cor de destaque da marca (acento nos cards/badges) — dentro da paleta Fenice. */
  cor: string;
  /** caminho do logo do cliente (servido pelo painel). null = usa fallback inicial. */
  logo: string | null;
  /** existe relatório publicado (tela React) para este cliente? */
  relatorioPronto: boolean;
  /** portal white-label do cliente (subdomínio próprio). null = ainda não existe. */
  portalUrl: string | null;
  /** financiamento da conta de anúncios:
   *  'cartao' = cobra no cartão (não há "saldo baixo"); 'cap' = limite de gasto (disponível = cap − gasto);
   *  'prepago' = saldo pré-pago; null = sem conta / a definir. */
  funding: 'cartao' | 'cap' | 'prepago' | null;
}

/** Caminho do relatório vertical do cliente, relativo à base do serviço de tráfego. */
export const reportPath = (slug: string): string => `/${slug}-report.html`;
/** Caminho do hub do cliente, relativo à base do serviço de tráfego. */
export const hubPath = (slug: string): string => `/${slug}/`;

/** Os 5 clientes da Fenice Lab. Ordem: clientes com portal próprio primeiro. */
export const CLIENTES_FENICE: ClienteFenice[] = [
  {
    slug: 'suprema',
    nome: 'Suprema Pizza',
    letter: 'S',
    seg: 'Pizzaria · Blumenau',
    ig: 'asupremapizza',
    agencia: AGENCIA,
    adAccountId: '25139920355667016',
    pageId: '833137869890801',
    pixelId: '1478660663225256',
    status: 'ativo',
    statusLabel: 'Ativo',
    cor: '#B23A2E',
    logo: '/clientes/suprema.png',
    relatorioPronto: true,
    portalUrl: 'https://supremapizza.fenicelab.com.br',
    funding: 'cartao',
  },
  {
    slug: 'arena',
    nome: 'Arena Gourmet',
    letter: 'A',
    seg: 'Hamburgueria · Blumenau',
    ig: 'arenadogburger',
    agencia: AGENCIA,
    adAccountId: '319635973841218',
    pageId: '237093996150126',
    pixelId: null,
    status: 'ativo',
    statusLabel: 'Ativo',
    cor: '#CC7A4D',
    logo: '/clientes/arena.png',
    relatorioPronto: true,
    portalUrl: 'https://arenagourmet.fenicelab.com.br',
    funding: 'prepago',
  },
  {
    slug: 'oca',
    nome: 'Restaurante Oca',
    letter: 'O',
    seg: 'Comida de casa · grill',
    ig: 'restaurante_oca',
    agencia: AGENCIA,
    adAccountId: '1466956497860339',
    pageId: '1052552454597275',
    pixelId: null,
    status: 'ativo',
    statusLabel: 'Ativo',
    cor: '#CC7A4D',
    logo: null,
    relatorioPronto: false,
    portalUrl: null,
    funding: 'prepago',
  },
  {
    slug: 'cotafacil',
    nome: 'cotafácil',
    letter: 'C',
    seg: 'Seguros · Blumenau',
    ig: 'cotafacil.bnu',
    agencia: AGENCIA,
    adAccountId: null,
    pageId: '537121479479094',
    pixelId: null,
    status: 'ativo',
    statusLabel: 'Ativo',
    cor: '#6E5A48',
    logo: null,
    relatorioPronto: false,
    portalUrl: null,
    funding: null,
  },
  {
    slug: 'imperio',
    nome: 'Império do Sabor',
    letter: 'I',
    seg: 'Restaurante',
    ig: null,
    agencia: AGENCIA,
    adAccountId: null,
    pageId: null,
    pixelId: null,
    status: 'setup',
    statusLabel: 'Aguardando setup',
    cor: '#76241C',
    logo: null,
    relatorioPronto: false,
    portalUrl: null,
    funding: null,
  },
];

/** Busca um cliente Fenice pelo slug. */
export const clienteBySlug = (slug: string): ClienteFenice | undefined =>
  CLIENTES_FENICE.find((c) => c.slug === slug);

/** Conjunto de slugs Fenice (útil para filtrar respostas da API). */
export const SLUGS_FENICE = new Set(CLIENTES_FENICE.map((c) => c.slug));
