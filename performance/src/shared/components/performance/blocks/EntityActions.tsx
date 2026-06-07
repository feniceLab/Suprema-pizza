// Helper compartilhado pra ações de pause/resume em campaign/adset/ad.
// Backend: POST /api/campaign/action com { slug, entity_type, entity_id, action }.
// Reusa estilos .perf-modal-overlay/.perf-modal/.perf-toast/.perf-act-btn já em performance.css.
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

const API_BASE = (import.meta as any).env?.VITE_TRAFEGO_URL || '';

export type EntityType = 'campaign' | 'adset' | 'ad';
export type EntityAction = 'pause' | 'resume' | 'budget_up' | 'budget_down';

export interface PendingConfirm {
  entity_type: EntityType;
  entity_id: string;
  name: string;
  action: EntityAction;
}

export interface ToastState {
  kind: 'ok' | 'bad';
  msg: string;
}

const ENTITY_LABEL: Record<EntityType, string> = {
  campaign: 'campanha',
  adset: 'adset',
  ad: 'criativo',
};

const ACTION_VERB: Record<EntityAction, string> = {
  pause: 'Pausar',
  resume: 'Reativar',
  budget_up: 'Aumentar budget',
  budget_down: 'Reduzir budget',
};

const ACTION_VERB_PAST: Record<EntityAction, string> = {
  pause: 'pausado',
  resume: 'reativado',
  budget_up: 'budget aumentado',
  budget_down: 'budget reduzido',
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook — estado centralizado de pending/toast/confirming + doAction
// ─────────────────────────────────────────────────────────────────────────────
export function useEntityActions(slug: string, actor?: string) {
  const [pending, setPending] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirming, setConfirming] = useState<PendingConfirm | null>(null);

  const showToast = (kind: 'ok' | 'bad', msg: string) => {
    setToast({ kind, msg });
    window.setTimeout(() => setToast(null), 4500);
  };

  const doAction = async (
    entity_type: EntityType,
    entity_id: string,
    action: EntityAction,
    entity_name?: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    setPending(entity_id);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const r = await fetch(`${API_BASE}/api/campaign/action`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ slug, entity_type, entity_id, action, entity_name, actor }),
      });
      const j = await r.json();
      if (j.ok) {
        const label = ENTITY_LABEL[entity_type];
        const verb = ACTION_VERB_PAST[action];
        showToast('ok', `${label.charAt(0).toUpperCase() + label.slice(1)} ${verb}`);
        return { ok: true };
      } else {
        showToast('bad', j.error || 'Falha');
        return { ok: false, error: j.error };
      }
    } catch (e: any) {
      const msg = e?.message || 'Erro de rede';
      showToast('bad', msg);
      return { ok: false, error: msg };
    } finally {
      setPending(null);
      setConfirming(null);
    }
  };

  return { pending, toast, confirming, setConfirming, doAction };
}

// ─────────────────────────────────────────────────────────────────────────────
// ConfirmModal — overlay de confirmação reusando .perf-modal-*
// ─────────────────────────────────────────────────────────────────────────────
interface ConfirmModalProps {
  entity_type: EntityType;
  entity_name: string;
  action: EntityAction;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  entity_type,
  entity_name,
  action,
  loading,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const label = ENTITY_LABEL[entity_type];
  const verb = ACTION_VERB[action];
  const title = `${verb} ${label} ${entity_name}?`;
  const isDanger = action === 'pause' || action === 'budget_down';
  const primaryClass = isDanger ? 'perf-modal-btn--danger' : 'perf-modal-btn--primary';
  const confirmLabel = action === 'pause' ? 'Pausar' :
                       action === 'resume' ? 'Reativar' :
                       action === 'budget_up' ? 'Aplicar +20%' : 'Aplicar -20%';

  return (
    <div className="perf-modal-overlay" onClick={onCancel}>
      <div className="perf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="perf-modal-title">{title}</div>
        <div className="perf-modal-body">
          <strong>{entity_name}</strong>
          <br />
          Essa ação afeta a campanha <em>REAL</em> no Meta Ads Manager.
        </div>
        <div className="perf-modal-actions">
          <button
            type="button"
            className="perf-modal-btn perf-modal-btn--cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`perf-modal-btn ${primaryClass}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Aplicando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ToastView — notificação flutuante (.perf-toast)
// ─────────────────────────────────────────────────────────────────────────────
interface ToastViewProps {
  toast: ToastState | null;
}

export function ToastView({ toast }: ToastViewProps) {
  if (!toast) return null;
  return (
    <div className={`perf-toast perf-toast--${toast.kind}`} role="status">
      <span>{toast.kind === 'ok' ? '✓' : '⚠'}</span>
      <span>{toast.msg}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EntityActionButton — botão Pausar/Reativar inline (ad ou adset)
// Renderiza ⏸ se ACTIVE, ▶ se PAUSED, nada caso contrário.
// ─────────────────────────────────────────────────────────────────────────────
interface EntityActionButtonProps {
  entity_type: EntityType;
  entity_id: string;
  name: string;
  effective_status: string | null | undefined;
  onConfirmAsk: (payload: PendingConfirm) => void;
  pending: string | null;
  /** RBAC — se false, esconde botões de pause/resume. Default: true. */
  canPause?: boolean;
  /** RBAC — se false, esconde botões de budget_up/budget_down. Default: true. */
  canEscalate?: boolean;
}

export function EntityActionButton({
  entity_type,
  entity_id,
  name,
  effective_status,
  onConfirmAsk,
  pending,
  canPause = true,
  canEscalate = true,
}: EntityActionButtonProps) {
  const isActive = effective_status === 'ACTIVE';
  const isPaused = effective_status === 'PAUSED';
  if (!isActive && !isPaused) return null;

  const action: EntityAction = isActive ? 'pause' : 'resume';
  // EntityActionButton só renderiza pause/resume (deriva do effective_status).
  // canEscalate seria pra budget_up/budget_down — fica aqui pra futuro uso (ex: botão +budget no adset).
  if (!canPause) return null;
  void canEscalate;
  const modifier = isActive ? 'perf-act-btn--pause' : 'perf-act-btn--resume';
  const icon = isActive ? '⏸' : '▶';
  const title = isActive ? `Pausar ${ENTITY_LABEL[entity_type]}` : `Reativar ${ENTITY_LABEL[entity_type]}`;
  const isLoading = pending === entity_id;

  return (
    <button
      type="button"
      className={`perf-act-btn ${modifier}`}
      title={title}
      disabled={isLoading}
      onClick={(e) => {
        e.stopPropagation();
        onConfirmAsk({ entity_type, entity_id, name, action });
      }}
    >
      {isLoading ? '…' : icon}
    </button>
  );
}
