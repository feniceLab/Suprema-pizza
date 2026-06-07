// ============================================================
// Tipos compartilhados — Performance war room (consumidos
// pelo portal cliente e pelo painel admin via WarRoomShell).
// ============================================================

export type Preset = 'this_month' | 'last_month' | 'last_7d' | 'last_30d';

export interface PeriodOption {
  preset: Preset;
  label: string;
  /** Período anterior pra comparativo (since/until em YYYY-MM-DD). */
  prevSince: () => string;
  prevUntil: () => string;
}

export interface ApiClientRow {
  slug: string;
  name: string;
  agencia: string | null;
  ad_account_id: string | null;
  found: boolean;
  error: string | null;
  spend_cents: number;
  revenue_cents: number;
  purchases: number;
  roas: number;
  impressions: number;
  reach: number;
  frequency: number;
  clicks: number;
  ctr: number;
  cpm: number;
  cpc: number;
  link_clicks: number;
  add_to_cart: number;
  initiate_checkout: number;
}

export interface ApiInsightsResponse {
  updated_at: string;
  period: string;
  clients: ApiClientRow[];
}

export interface ApiSaldoRow {
  slug: string;
  name: string;
  agencia: string | null;
  ad_account_id: string | null;
  currency: string | null;
  account_status: number | null;
  balance_cents: number | null;
  amount_spent_cents: number | null;
  spend_cap_cents: number | null;
  funding_source: string | null;
  funding_source_details: { id: string; display_string: string; type: number } | null;
  funding_tipo: 'cartao' | 'prepago' | 'outro' | null;
  disponivel_cents: number | null;
}

export interface ApiSaldoResponse {
  updated_at: string;
  error: string | null;
  clients: ApiSaldoRow[];
}

export type TabKey = 'resumo' | 'campanhas' | 'criativos' | 'demografia' | 'favoritos';

export interface TabDef {
  key: TabKey;
  label: string;
}
