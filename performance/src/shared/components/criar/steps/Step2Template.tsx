// Passo 2 — Escolher template Sobral (vertical do negócio).
// Selecionar template preenche defaults dos próximos passos.
import type { DraftCampanha } from '../types';
import type { VerticalKey } from '../templates';
import { TEMPLATES_SOBRAL, VERTICAL_KEYS } from '../templates';
import { Tooltip } from '../Tooltip';
import { tip } from '../tooltips';

export interface Step2Props {
  draft: DraftCampanha;
  onChange: (patch: Partial<DraftCampanha>) => void;
}

export function Step2Template({ draft, onChange }: Step2Props) {
  const sel = draft.vertical;

  const pick = (key: VerticalKey) => {
    const tpl = TEMPLATES_SOBRAL[key];
    const cold = tpl.audiences.cold;
    // Pré-popula defaults baseados no template Sobral.
    onChange({
      vertical: key,
      publico: draft.publico || {
        idade_min: cold.age_min,
        idade_max: cold.age_max,
        generos: ['masculino', 'feminino'],
        raio_km: tpl.geo_default.raio_km_default,
        interesses: cold.interests || [],
      },
      budget: draft.budget || {
        diario_cents: tpl.budget_recomendado_diario_cents,
        tipo: 'diario',
      },
      mensagem: draft.mensagem || {
        titulo: '',
        descricao: '',
        cta: tpl.creative_specs.cta_default,
      },
    });
  };

  return (
    <section className="wiz-step wiz-step--template">
      <header className="wiz-step-head">
        <h2 className="wiz-step-title">
          Qual o tipo do seu negócio?
          <Tooltip text={tip('vertical')} />
        </h2>
        <p className="wiz-step-sub">
          Cada tipo tem regras Sobral diferentes. A gente vai sugerir os defaults
          certos pra você.
        </p>
      </header>

      <div className="wiz-cards wiz-cards--4">
        {VERTICAL_KEYS.map((key) => {
          const tpl = TEMPLATES_SOBRAL[key];
          const on = key === sel;
          return (
            <button
              key={key}
              type="button"
              className={`wiz-card${on ? ' is-on' : ''}`}
              onClick={() => pick(key)}
              aria-pressed={on}
            >
              <div className="wiz-card-emoji" aria-hidden>{tpl.icon}</div>
              <div className="wiz-card-title">{tpl.nome_exibicao}</div>
              <div className="wiz-card-desc">{tpl.descricao_curta}</div>
              {on && <span className="wiz-card-check" aria-hidden>✓</span>}
            </button>
          );
        })}
      </div>

      <div className="wiz-field">
        <label htmlFor="wiz-nome" className="wiz-label">
          Nome da campanha
          <Tooltip text={tip('nome_campanha')} />
        </label>
        <input
          id="wiz-nome"
          type="text"
          className="wiz-input"
          placeholder='Ex: "Promo Quinta - Pizza Calabresa"'
          value={draft.nome_campanha || ''}
          maxLength={80}
          onChange={(e) => onChange({ nome_campanha: e.target.value })}
        />
        <div className="wiz-hint">Esse nome só aparece no relatório. Cliente não vê.</div>
      </div>
    </section>
  );
}
