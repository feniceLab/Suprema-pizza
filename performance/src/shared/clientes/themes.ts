// ============================================================
// Temas por cliente — DESIGN SYSTEM de cada cliente Fenice Lab.
// Tokens reais extraídos do repo/Drive de cada cliente:
//   Suprema → Clientes/Suprema Pizza/Regras de Skill/01 - Identidade Visual.md
//   Arena   → Clientes/Arena Gourmet/design.md (+ repo feniceLab/arena_gourmet)
// Consumido pelo relatório React (e, no futuro, pelos portais white-label).
// ============================================================

export interface ClienteTheme {
  /** fundo da página. */
  bg: string;
  /** fundo de cards. */
  card: string;
  /** fundo de cards (camada 2 / hover). */
  card2: string;
  /** cor das linhas/bordas. */
  line: string;
  /** texto principal (sobre bg escuro). */
  ink: string;
  /** texto secundário. */
  muted: string;
  /** texto terciário/fraco. */
  faint: string;
  /** cor primária da marca (acento principal). */
  accent: string;
  /** cor secundária (gradiente/realce). */
  accent2: string;
  /** verde de sucesso. */
  ok: string;
  /** amarelo de aviso. */
  warn: string;
  /** vermelho de erro/ruim. */
  bad: string;
  /** fonte de display/títulos (CSS font-family). */
  fontDisplay: string;
  /** fonte de corpo/UI (CSS font-family). */
  fontBody: string;
  /** href do Google Fonts a carregar (ou null se já carregada). */
  googleFonts: string | null;
}

/** Tema neutro (fallback) baseado na cor da marca do cliente. */
export const themeFromCor = (cor: string): ClienteTheme => ({
  bg: '#121212',
  card: '#1A1A1A',
  card2: '#242424',
  line: 'rgba(255,255,255,.08)',
  ink: '#FFFFFF',
  muted: '#9A9A9A',
  faint: '#6E6E6E',
  accent: cor,
  accent2: cor,
  ok: '#3FB950',
  warn: '#E3A008',
  bad: '#6E6E6E',
  fontDisplay: "'Poppins', system-ui, sans-serif",
  fontBody: "'Poppins', system-ui, sans-serif",
  googleFonts:
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
});

export const CLIENTE_THEMES: Record<string, ClienteTheme> = {
  // 🍕 Suprema Pizza — vermelho oficial + Poppins (DS: bege massa/preto/branco/vermelho)
  suprema: {
    bg: '#0F0F0F',
    card: '#161616',
    card2: '#1F1F1F',
    line: 'rgba(255,255,255,.08)',
    ink: '#FFFFFF',
    muted: '#9A9A9A',
    faint: '#6E6E6E',
    accent: '#D62828',
    accent2: '#E84B4B',
    ok: '#3FB950',
    warn: '#E3A008',
    bad: '#6E6E6E',
    fontDisplay: "'Poppins', system-ui, sans-serif",
    fontBody: "'Poppins', system-ui, sans-serif",
    googleFonts:
      'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
  },

  // 🍔 Arena Gourmet — carvão + dourado + brasa + Bebas/Montserrat (DS: design.md)
  arena: {
    bg: '#0A0A0A',
    card: '#1A1A1A',
    card2: '#242424',
    line: 'rgba(212,175,55,.14)',
    ink: '#FAFAFA',
    muted: '#A0A0A0',
    faint: '#606060',
    accent: '#D4B483',
    accent2: '#C0392B',
    ok: '#4ADE80',
    warn: '#FBBF24',
    bad: '#F87171',
    fontDisplay: "'Bebas Neue', 'Montserrat', sans-serif",
    fontBody: "'Montserrat', system-ui, sans-serif",
    googleFonts:
      'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;600;700;800&family=Pacifico&display=swap',
  },
};

/** Resolve o tema de um cliente pelo slug (com fallback pela cor). */
export const themeBySlug = (slug: string, cor: string): ClienteTheme =>
  CLIENTE_THEMES[slug] ?? themeFromCor(cor);
