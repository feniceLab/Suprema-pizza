// Passo 8 — Submeter pra aprovação OU (admin) publicar direto.
import { useState } from 'react';
import type { DraftCampanha } from '../types';

export interface Step8Props {
  draft: DraftCampanha;
  apiBase: string;
  /** Role do usuário logado. */
  userRole?: 'admin_fenice' | 'cliente';
  /** Submeter pra aprovação (cliente) — hook do useDraft.submit. */
  onSubmit: () => Promise<{ ok: boolean; error?: string }>;
  /** Publicar direto (admin) — aprovar+publicar imediatamente. */
  onApproveAndPublish?: () => Promise<{ ok: boolean; error?: string }>;
  /** Fechar/voltar pra lista. */
  onDone?: () => void;
}

export function Step8Aprovacao({
  draft,
  userRole,
  onSubmit,
  onApproveAndPublish,
  onDone,
}: Step8Props) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);
  const isAdmin = userRole === 'admin_fenice';
  const jaEnviado = draft.status === 'aguardando_aprovacao' || draft.status === 'aprovada' || draft.status === 'publicada';

  const handle = async (acao: 'submit' | 'publish') => {
    setSubmitting(true);
    setResult(null);
    try {
      const fn = acao === 'publish' && onApproveAndPublish ? onApproveAndPublish : onSubmit;
      const r = await fn();
      setResult(r);
    } finally {
      setSubmitting(false);
    }
  };

  if (jaEnviado || result?.ok) {
    return (
      <section className="wiz-step wiz-step--aprovacao">
        <div className="wiz-success">
          <div className="wiz-success-icon" aria-hidden>✓</div>
          <h2 className="wiz-success-title">
            {draft.status === 'publicada' || result?.ok && isAdmin
              ? 'Campanha publicada!'
              : 'Campanha enviada pra Fenice'}
          </h2>
          <p className="wiz-success-sub">
            {isAdmin && result?.ok
              ? 'A campanha foi aprovada e publicada no Meta Ads. Acompanhe a performance na aba relatórios.'
              : 'A equipe Fenice vai revisar e te avisar pelo WhatsApp em até 24h úteis.'}
          </p>
          {onDone && (
            <button type="button" className="wiz-btn-primary" onClick={onDone}>
              Voltar à lista
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="wiz-step wiz-step--aprovacao">
      <header className="wiz-step-head">
        <h2 className="wiz-step-title">Pronto pra enviar?</h2>
        <p className="wiz-step-sub">
          {isAdmin
            ? 'Você pode aprovar e publicar agora, ou só enviar pra fila de aprovação.'
            : 'A campanha vai pra equipe Fenice revisar. Em até 24h úteis a gente publica (ou pede ajustes).'}
        </p>
      </header>

      <div className="wiz-final">
        <div className="wiz-final-summary">
          <div className="wiz-final-summary-title">
            {draft.nome_campanha || '(campanha sem nome)'}
          </div>
          <div className="wiz-final-summary-meta">
            {draft.vertical} · {draft.objetivo} · orçamento R${' '}
            {((draft.budget?.diario_cents || 0) / 100).toFixed(0)}/dia
          </div>
        </div>

        {result?.error && (
          <div className="wiz-final-error" role="alert">
            Falha ao enviar: {result.error}
          </div>
        )}

        <div className="wiz-final-actions">
          {!isAdmin && (
            <button
              type="button"
              className="wiz-btn-primary wiz-btn-primary--lg"
              onClick={() => handle('submit')}
              disabled={submitting}
            >
              {submitting ? 'Enviando…' : 'Submeter pra Fenice aprovar'}
            </button>
          )}

          {isAdmin && (
            <>
              <button
                type="button"
                className="wiz-btn-secondary"
                onClick={() => handle('submit')}
                disabled={submitting}
              >
                {submitting ? '…' : 'Salvar como rascunho aprovável'}
              </button>
              {onApproveAndPublish && (
                <button
                  type="button"
                  className="wiz-btn-primary wiz-btn-primary--lg"
                  onClick={() => handle('publish')}
                  disabled={submitting}
                >
                  {submitting ? 'Publicando…' : 'Aprovar e publicar agora'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
