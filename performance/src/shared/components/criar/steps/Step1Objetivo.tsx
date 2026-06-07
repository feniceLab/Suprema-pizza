// Passo 1 — Escolher objetivo da campanha.
import type { DraftCampanha, ObjetivoKey } from '../types';
import { OBJETIVOS } from '../types';
import { Tooltip } from '../Tooltip';
import { tip } from '../tooltips';

export interface Step1Props {
  draft: DraftCampanha;
  onChange: (patch: Partial<DraftCampanha>) => void;
}

export function Step1Objetivo({ draft, onChange }: Step1Props) {
  const escolhido = draft.objetivo;

  const pick = (key: ObjetivoKey) => {
    onChange({ objetivo: key });
  };

  return (
    <section className="wiz-step wiz-step--objetivo">
      <header className="wiz-step-head">
        <h2 className="wiz-step-title">
          O que você quer com essa campanha?
          <Tooltip text={tip('objetivo')} />
        </h2>
        <p className="wiz-step-sub">
          Escolha um. Você ajusta detalhes nos próximos passos.
        </p>
      </header>

      <div className="wiz-cards">
        {OBJETIVOS.map((opt) => {
          const on = opt.key === escolhido;
          return (
            <button
              key={opt.key}
              type="button"
              className={`wiz-card${on ? ' is-on' : ''}`}
              onClick={() => pick(opt.key)}
              aria-pressed={on}
            >
              <div className="wiz-card-title">{opt.label}</div>
              <div className="wiz-card-desc">{opt.descricao}</div>
              {on && <span className="wiz-card-check" aria-hidden>✓</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
