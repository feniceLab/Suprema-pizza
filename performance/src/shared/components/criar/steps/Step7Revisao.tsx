// Passo 7 — Revisão: resumo + EstimativaCard final.
import type { DraftCampanha, WizardStepKey } from '../types';
import { OBJETIVOS } from '../types';
import { TEMPLATES_SOBRAL } from '../templates';
import { EstimativaCard } from '../EstimativaCard';

export interface Step7Props {
  draft: DraftCampanha;
  apiBase: string;
  slug: string;
  onGoToStep?: (step: WizardStepKey) => void;
}

const fmtBRL = (cents: number): string =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

const formatDate = (iso: string): string => {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR');
  } catch { return iso; }
};

export function Step7Revisao({ draft, apiBase, slug, onGoToStep }: Step7Props) {
  const tpl = draft.vertical ? TEMPLATES_SOBRAL[draft.vertical] : null;
  const objetivoLabel = OBJETIVOS.find((o) => o.key === draft.objetivo)?.label || '—';

  return (
    <section className="wiz-step wiz-step--revisao">
      <header className="wiz-step-head">
        <h2 className="wiz-step-title">Revisão</h2>
        <p className="wiz-step-sub">
          Confira tudo antes de submeter. Clique em qualquer bloco pra editar.
        </p>
      </header>

      <div className="wiz-grid-2col">
        <div className="wiz-grid-main">
          <button
            type="button"
            className="wiz-review-block"
            onClick={() => onGoToStep?.('objetivo')}
          >
            <div className="wiz-review-kicker">Objetivo</div>
            <div className="wiz-review-val">{objetivoLabel}</div>
          </button>

          <button
            type="button"
            className="wiz-review-block"
            onClick={() => onGoToStep?.('template')}
          >
            <div className="wiz-review-kicker">Vertical</div>
            <div className="wiz-review-val">{tpl?.nome_exibicao || '—'}</div>
            <div className="wiz-review-meta">{draft.nome_campanha || '(sem nome)'}</div>
          </button>

          <button
            type="button"
            className="wiz-review-block"
            onClick={() => onGoToStep?.('publico')}
          >
            <div className="wiz-review-kicker">Público</div>
            <div className="wiz-review-val">
              {draft.publico
                ? `${draft.publico.idade_min}-${draft.publico.idade_max} anos · ${draft.publico.generos.join(' + ')}`
                : '—'}
            </div>
            <div className="wiz-review-meta">
              {draft.publico
                ? `${draft.publico.cidade || 'cidade não definida'} · raio ${draft.publico.raio_km} km`
                : ''}
              {draft.publico?.interesses.length ? ` · interesses: ${draft.publico.interesses.join(', ')}` : ''}
            </div>
          </button>

          <button
            type="button"
            className="wiz-review-block"
            onClick={() => onGoToStep?.('mensagem')}
          >
            <div className="wiz-review-kicker">Mensagem</div>
            <div className="wiz-review-val">{draft.mensagem?.titulo || '(sem título)'}</div>
            <div className="wiz-review-meta">
              {draft.mensagem?.descricao || ''}
            </div>
            <div className="wiz-review-meta">
              CTA: <strong>{draft.mensagem?.cta || '—'}</strong>
              {draft.criativo ? ` · ${draft.criativo.tipo === 'video' ? 'vídeo' : 'imagem'} uploaded` : ' · ⚠ sem criativo'}
            </div>
          </button>

          <button
            type="button"
            className="wiz-review-block"
            onClick={() => onGoToStep?.('orcamento')}
          >
            <div className="wiz-review-kicker">Orçamento</div>
            <div className="wiz-review-val">{draft.budget ? fmtBRL(draft.budget.diario_cents) : '—'} <span className="wiz-review-unit">/ dia</span></div>
            <div className="wiz-review-meta">
              Mensal estimado: {draft.budget ? fmtBRL(draft.budget.diario_cents * 30) : '—'}
            </div>
          </button>

          <button
            type="button"
            className="wiz-review-block"
            onClick={() => onGoToStep?.('periodo')}
          >
            <div className="wiz-review-kicker">Período</div>
            <div className="wiz-review-val">
              {draft.periodo?.data_inicio ? `A partir de ${formatDate(draft.periodo.data_inicio)}` : '—'}
            </div>
            <div className="wiz-review-meta">
              {draft.periodo?.data_fim
                ? `até ${formatDate(draft.periodo.data_fim)}`
                : 'sem data fim (roda até pausar)'}
            </div>
          </button>

          {tpl && tpl.warnings_setup.length > 0 && (
            <div className="wiz-checklist">
              <div className="wiz-checklist-title">Checklist Sobral antes de publicar</div>
              <ul className="wiz-checklist-items">
                {tpl.warnings_setup.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              <div className="wiz-checklist-foot">
                A Fenice valida cada item antes de aprovar.
              </div>
            </div>
          )}
        </div>

        <aside className="wiz-grid-aside">
          <EstimativaCard apiBase={apiBase} slug={slug} draft={draft} />
        </aside>
      </div>
    </section>
  );
}
