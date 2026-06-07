// ============================================================
// WizardModal — overlay full-screen que embute o Wizard.
// Abre POR CIMA do war room (não navega). ESC fecha.
// Aceita prefill (vertical, motivacao) pra acelerar o fluxo.
// ============================================================

import { useEffect, useMemo, useRef } from 'react';
import { Wizard } from './Wizard';
import type { DraftCampanha } from './types';
import type { VerticalKey } from './templates';
import './criar.css';

export interface WizardModalProps {
  open: boolean;
  slug: string;
  apiBase: string;
  onClose: () => void;
  /** Vertical pré-selecionada (pula direto pro contexto do cliente). */
  prefillVertical?: VerticalKey;
  /** Motivação contextual (ex: "Substituir campanha em fadiga"). Vai pro nome. */
  prefillMotivacao?: string;
  /** Draft existente pra retomar (resume). */
  initialDraftId?: string;
  userRole?: 'admin_fenice' | 'cliente';
  userEmail?: string;
  userAuthId?: string;
  /** Callback após submeter com sucesso. */
  onSubmitted?: () => void;
}

export function WizardModal({
  open,
  slug,
  apiBase,
  onClose,
  prefillVertical,
  prefillMotivacao,
  initialDraftId,
  userRole,
  userEmail,
  userAuthId,
  onSubmitted,
}: WizardModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // ESC fecha + trava scroll do body + focus-trap enquanto aberto.
  useEffect(() => {
    if (!open) return;

    const FOCUSABLE =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusables = (): HTMLElement[] => {
      const panel = panelRef.current;
      if (!panel) return [];
      return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusables = getFocusables();
      if (focusables.length === 0) {
        // Nada focável além do painel: prende o foco no próprio painel.
        e.preventDefault();
        panelRef.current?.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !panelRef.current?.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !panelRef.current?.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Autofocus: primeiro focável do painel, ou o botão fechar como fallback.
    const focusables = getFocusables();
    const target = focusables[0] || closeBtnRef.current;
    target?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const initialDraft = useMemo<DraftCampanha>(() => {
    const base: DraftCampanha = { slug, status: 'rascunho' };
    if (prefillVertical) base.vertical = prefillVertical;
    if (prefillMotivacao) base.nome_campanha = prefillMotivacao;
    if (userEmail) base.criado_por = userEmail;
    return base;
  }, [slug, prefillVertical, prefillMotivacao, userEmail]);

  if (!open) return null;

  return (
    <div
      className="criar-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Criar nova campanha"
      onMouseDown={(e) => {
        // Clique no backdrop (fora do conteúdo) fecha.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="criar-modal-panel" ref={panelRef} tabIndex={-1}>
        <button
          ref={closeBtnRef}
          type="button"
          className="criar-modal-x"
          onClick={onClose}
          aria-label="Fechar"
        >
          ✕
        </button>
        <Wizard
          key={`${slug}:${initialDraftId || 'novo'}:${prefillVertical || ''}`}
          slug={slug}
          apiBase={apiBase}
          initial={initialDraft}
          initialDraftId={initialDraftId}
          userRole={userRole}
          userEmail={userEmail}
          userAuthId={userAuthId}
          onClose={() => {
            onSubmitted?.();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
