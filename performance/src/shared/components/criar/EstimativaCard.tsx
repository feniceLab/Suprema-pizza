// Consome useEstimativa e mostra alcance + custo estimado.
import { useEstimativa } from './useEstimativa';
import type { DraftCampanha } from './types';

export interface EstimativaCardProps {
  apiBase: string;
  slug: string;
  draft: DraftCampanha;
  enabled?: boolean;
}

const fmtMil = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
};

const fmtBRL = (cents: number): string =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });

export function EstimativaCard({ apiBase, slug, draft, enabled = true }: EstimativaCardProps) {
  const est = useEstimativa({ apiBase, slug, draft, enabled });

  return (
    <aside className="criar-estimativa" aria-live="polite">
      <div className="criar-estimativa-head">
        <span className="criar-estimativa-kicker">Estimativa Meta</span>
        {est.loading && <span className="criar-estimativa-loading">calculando…</span>}
      </div>
      {est.error ? (
        <div className="criar-estimativa-err">Não foi possível estimar: {est.error}</div>
      ) : est.audience_lower === 0 && est.audience_upper === 0 ? (
        <div className="criar-estimativa-empty">
          Preencha público e orçamento pra ver estimativa de alcance.
        </div>
      ) : (
        <div className="criar-estimativa-body">
          <div className="criar-estimativa-row">
            <span className="criar-estimativa-label">Alcance potencial</span>
            <strong className="criar-estimativa-val">
              {fmtMil(est.audience_lower)}–{fmtMil(est.audience_upper)} pessoas
            </strong>
          </div>
          {est.alcance_diario_estimado > 0 && (
            <div className="criar-estimativa-row">
              <span className="criar-estimativa-label">Alcance diário</span>
              <strong className="criar-estimativa-val">{fmtMil(est.alcance_diario_estimado)}/dia</strong>
            </div>
          )}
          {est.cpm_estimado_cents > 0 && (
            <div className="criar-estimativa-row">
              <span className="criar-estimativa-label">CPM estimado</span>
              <strong className="criar-estimativa-val">{fmtBRL(est.cpm_estimado_cents)}</strong>
            </div>
          )}
          {est.conversoes_diarias_estimadas !== undefined && (
            <div className="criar-estimativa-row">
              <span className="criar-estimativa-label">Conversões/dia</span>
              <strong className="criar-estimativa-val">~{est.conversoes_diarias_estimadas}</strong>
            </div>
          )}
        </div>
      )}
      <div className="criar-estimativa-note">
        É um chute matemático do Meta. Resultado real depende de leilão e criativo.
      </div>
    </aside>
  );
}
