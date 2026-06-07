// Passo 5 — Orçamento diário + guardrail Sobral (mínimo R$30).
import type { DraftCampanha } from '../types';
import { TEMPLATES_SOBRAL } from '../templates';
import { Tooltip } from '../Tooltip';
import { tip } from '../tooltips';
import { EstimativaCard } from '../EstimativaCard';
import { GuardrailToast } from '../GuardrailToast';

export interface Step5Props {
  draft: DraftCampanha;
  onChange: (patch: Partial<DraftCampanha>) => void;
  apiBase: string;
  slug: string;
}

const fmtBRL = (cents: number): string =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

const SLIDER_MIN = 1000; // R$10 (deixa abaixo pra mostrar guardrail)
const SLIDER_MAX = 50000; // R$500

export function Step5Orcamento({ draft, onChange, apiBase, slug }: Step5Props) {
  const tpl = draft.vertical ? TEMPLATES_SOBRAL[draft.vertical] : null;
  const minSobral = tpl?.budget_min_diario_cents || 3000;
  const recomendado = tpl?.budget_recomendado_diario_cents || 5000;
  const maxAviso = tpl?.budget_max_aviso_diario_cents || 30000;

  const budget = draft.budget || { diario_cents: recomendado, tipo: 'diario' as const };

  const set = (cents: number) => {
    onChange({ budget: { diario_cents: cents, tipo: 'diario' } });
  };

  const abaixoDoMin = budget.diario_cents < minSobral;
  const acimaDoTopo = budget.diario_cents > maxAviso;

  return (
    <section className="wiz-step wiz-step--orcamento">
      <header className="wiz-step-head">
        <h2 className="wiz-step-title">
          Quanto você quer gastar por dia?
          <Tooltip text={tip('orcamento')} />
        </h2>
        <p className="wiz-step-sub">
          {tpl?.tooltips.budget || 'Defina o orçamento diário. Mínimo Sobral: R$30/dia.'}
        </p>
      </header>

      <div className="wiz-grid-2col">
        <div className="wiz-grid-main">
          <div className="wiz-budget-display">
            <div className="wiz-budget-value">{fmtBRL(budget.diario_cents)}</div>
            <div className="wiz-budget-unit">por dia</div>
          </div>

          <div className="wiz-field">
            <input
              type="range"
              className="wiz-slider wiz-slider--budget"
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              step={500}
              value={budget.diario_cents}
              onChange={(e) => set(Number(e.target.value))}
              aria-label="Orçamento diário"
            />
            <div className="wiz-budget-scale">
              <span>R$10</span>
              <span className="wiz-budget-scale-mark" style={{ left: `${((minSobral - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100}%` }}>
                ↑ R$30 (Sobral mín)
              </span>
              <span>R$500</span>
            </div>
          </div>

          <div className="wiz-field">
            <label htmlFor="wiz-budget-input" className="wiz-label">Ou digite um valor exato</label>
            <div className="wiz-input-prefix">
              <span className="wiz-input-prefix-symbol">R$</span>
              <input
                id="wiz-budget-input"
                type="number"
                className="wiz-input"
                min={1}
                value={Math.round(budget.diario_cents / 100)}
                onChange={(e) => {
                  const v = Math.max(0, Number(e.target.value));
                  set(v * 100);
                }}
              />
            </div>
            <div className="wiz-hint">Valor diário em reais.</div>
          </div>

          {abaixoDoMin && (
            <GuardrailToast
              severidade="aviso"
              titulo={`Sobral recomenda mínimo ${fmtBRL(minSobral)}/dia`}
              detalhe={tip('guardrail_budget')}
            />
          )}
          {acimaDoTopo && (
            <GuardrailToast
              severidade="info"
              titulo={`Orçamento acima de ${fmtBRL(maxAviso)}/dia`}
              detalhe="Vale validar com a Fenice antes de publicar — budget alto exige criativo testado."
            />
          )}

          <div className="wiz-budget-summary">
            <div className="wiz-budget-summary-row">
              <span>Por dia</span>
              <strong>{fmtBRL(budget.diario_cents)}</strong>
            </div>
            <div className="wiz-budget-summary-row">
              <span>Por semana (estimativa)</span>
              <strong>{fmtBRL(budget.diario_cents * 7)}</strong>
            </div>
            <div className="wiz-budget-summary-row">
              <span>Por mês (estimativa)</span>
              <strong>{fmtBRL(budget.diario_cents * 30)}</strong>
            </div>
          </div>
        </div>

        <aside className="wiz-grid-aside">
          <EstimativaCard apiBase={apiBase} slug={slug} draft={draft} />
        </aside>
      </div>
    </section>
  );
}
