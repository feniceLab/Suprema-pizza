// Passo 4 — Criativo + título + descrição + CTA.
import type { DraftCampanha } from '../types';
import { TEMPLATES_SOBRAL } from '../templates';
import { Tooltip } from '../Tooltip';
import { tip } from '../tooltips';
import { CreativeUpload } from '../CreativeUpload';

export interface Step4Props {
  draft: DraftCampanha;
  onChange: (patch: Partial<DraftCampanha>) => void;
  apiBase: string;
  slug: string;
}

const CTA_LABELS: Record<string, string> = {
  ORDER_NOW: 'Pedir Agora',
  SHOP_NOW: 'Comprar Agora',
  LEARN_MORE: 'Saiba Mais',
  SIGN_UP: 'Cadastre-se',
  WHATSAPP_MESSAGE: 'Enviar Mensagem',
  CONTACT_US: 'Fale Conosco',
  BOOK_TRAVEL: 'Reservar',
};

export function Step4Mensagem({ draft, onChange, apiBase, slug }: Step4Props) {
  const tpl = draft.vertical ? TEMPLATES_SOBRAL[draft.vertical] : null;
  const specs = tpl?.creative_specs;
  const maxTitulo = specs?.headline_max_chars || 40;
  const maxDesc = specs?.body_max_chars || 125;

  const msg = draft.mensagem || {
    titulo: '',
    descricao: '',
    cta: specs?.cta_default || 'LEARN_MORE',
  };

  const updateMsg = (patch: Partial<typeof msg>) => {
    onChange({ mensagem: { ...msg, ...patch } });
  };

  // CTAs disponíveis (prioriza o default Sobral)
  const ctaOpts = Array.from(new Set([
    specs?.cta_default || 'LEARN_MORE',
    ...Object.keys(CTA_LABELS),
  ]));

  return (
    <section className="wiz-step wiz-step--mensagem">
      <header className="wiz-step-head">
        <h2 className="wiz-step-title">A mensagem do anúncio</h2>
        <p className="wiz-step-sub">
          {tpl?.tooltips.criativo || 'Foto/vídeo + texto curto + botão de ação.'}
        </p>
      </header>

      <div className="wiz-grid-2col">
        <div className="wiz-grid-main">
          <div className="wiz-field">
            <label className="wiz-label">
              Imagem ou vídeo
              <Tooltip text={tip('criativo')} />
            </label>
            <CreativeUpload
              apiBase={apiBase}
              slug={slug}
              value={draft.criativo}
              onChange={(v) => onChange({ criativo: v })}
            />
            {specs && (
              <div className="wiz-hint">
                {specs.description_hint_ptbr}
              </div>
            )}
          </div>

          <div className="wiz-field">
            <label htmlFor="wiz-titulo" className="wiz-label">
              Título
              <Tooltip text={tip('titulo')} />
            </label>
            <input
              id="wiz-titulo"
              type="text"
              className="wiz-input"
              maxLength={maxTitulo}
              placeholder="Frase principal, direto ao ponto"
              value={msg.titulo}
              onChange={(e) => updateMsg({ titulo: e.target.value })}
            />
            <div className="wiz-hint wiz-hint--counter">
              {msg.titulo.length}/{maxTitulo} caracteres
            </div>
          </div>

          <div className="wiz-field">
            <label htmlFor="wiz-desc" className="wiz-label">
              Descrição
              <Tooltip text={tip('descricao')} />
            </label>
            <textarea
              id="wiz-desc"
              className="wiz-textarea"
              maxLength={maxDesc}
              placeholder="Justifique o clique. Use linguagem natural."
              value={msg.descricao}
              rows={3}
              onChange={(e) => updateMsg({ descricao: e.target.value })}
            />
            <div className="wiz-hint wiz-hint--counter">
              {msg.descricao.length}/{maxDesc} caracteres
            </div>
          </div>

          <div className="wiz-field">
            <label htmlFor="wiz-cta" className="wiz-label">
              Botão de ação (CTA)
              <Tooltip text={tip('cta')} />
            </label>
            <select
              id="wiz-cta"
              className="wiz-select"
              value={msg.cta}
              onChange={(e) => updateMsg({ cta: e.target.value })}
            >
              {ctaOpts.map((cta) => (
                <option key={cta} value={cta}>
                  {CTA_LABELS[cta] || cta}{cta === specs?.cta_default ? ' (recomendado)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="wiz-field">
            <label htmlFor="wiz-url" className="wiz-label">URL de destino (opcional)</label>
            <input
              id="wiz-url"
              type="url"
              className="wiz-input"
              placeholder="https://… (deixe vazio se for WhatsApp)"
              value={msg.url_destino || ''}
              onChange={(e) => updateMsg({ url_destino: e.target.value })}
            />
          </div>
        </div>

        <aside className="wiz-grid-aside">
          <div className="wiz-preview">
            <div className="wiz-preview-kicker">Pré-visualização</div>
            <div className="wiz-preview-card">
              <div className="wiz-preview-media">
                {draft.criativo?.preview_url ? (
                  draft.criativo.tipo === 'video' ? (
                    <video src={draft.criativo.preview_url} className="wiz-preview-mediaEl" muted />
                  ) : (
                    <img src={draft.criativo.preview_url} alt="" className="wiz-preview-mediaEl" />
                  )
                ) : (
                  <div className="wiz-preview-mediaPh">Foto/vídeo</div>
                )}
              </div>
              <div className="wiz-preview-text">
                <div className="wiz-preview-title">{msg.titulo || 'Título do anúncio'}</div>
                <div className="wiz-preview-desc">{msg.descricao || 'Descrição complementar…'}</div>
                <div className="wiz-preview-cta">{CTA_LABELS[msg.cta] || msg.cta}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
