// ============================================================
// Layout do Wizard: header + progress + step content + footer.
// Recebe slot {children} pra renderizar a step ativa.
// ============================================================

import type { ReactNode } from 'react';
import { ProgressBar } from './ProgressBar';
import { STEP_LABELS, STEP_ORDER, type DraftSaveStatus, type ValidacaoResultado, type WizardStepKey } from './types';

export interface WizardShellProps {
  step: WizardStepKey;
  validSteps: Set<WizardStepKey>;
  saveStatus: DraftSaveStatus;
  validation: ValidacaoResultado;
  isFirst: boolean;
  isLast: boolean;
  onJumpTo: (s: WizardStepKey) => void;
  onNext: () => void;
  onPrev: () => void;
  onClose?: () => void;
  slug: string;
  children: ReactNode;
}

const saveLabel = (s: DraftSaveStatus): string => {
  if (s.error) return `não foi possível salvar — ${s.error}`;
  if (s.saving) return 'salvando…';
  if (s.saved_at) {
    return `salvo às ${s.saved_at.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return 'rascunho local';
};

export function WizardShell({
  step,
  validSteps,
  saveStatus,
  validation,
  isFirst,
  isLast,
  onJumpTo,
  onNext,
  onPrev,
  onClose,
  slug,
  children,
}: WizardShellProps) {
  const stepIdx = STEP_ORDER.indexOf(step);
  const stepNum = stepIdx + 1;
  const total = STEP_ORDER.length;

  return (
    <div className="criar-wiz">
      <header className="criar-wiz-header">
        <div className="criar-wiz-header-left">
          <div className="criar-wiz-kicker">Fenice Lab · Criar campanha</div>
          <div className="criar-wiz-title">{STEP_LABELS[step]}</div>
          <div className="criar-wiz-subtitle">Cliente: <strong>{slug}</strong></div>
        </div>
        <div className="criar-wiz-header-right">
          <div className="criar-wiz-save">
            <span className={`criar-wiz-save-dot${saveStatus.saving ? ' is-saving' : ''}${saveStatus.error ? ' is-error' : ''}`} aria-hidden />
            <span className="criar-wiz-save-text">{saveLabel(saveStatus)}</span>
          </div>
          {onClose && (
            <button
              type="button"
              className="criar-wiz-close"
              onClick={onClose}
              aria-label="Fechar wizard"
              title="Fechar"
            >
              ×
            </button>
          )}
        </div>
      </header>

      <ProgressBar currentStep={step} validSteps={validSteps} onJumpTo={onJumpTo} />

      <main className="criar-wiz-body">
        {children}

        {!validation.valido && validation.erros.length > 0 && (
          <div className="criar-wiz-errors" role="alert">
            <strong>Corrija antes de avançar:</strong>
            <ul>
              {validation.erros.map((e) => <li key={e}>{e}</li>)}
            </ul>
          </div>
        )}

        {validation.avisos.length > 0 && (
          <div className="criar-wiz-warnings">
            {validation.avisos.map((a) => <div key={a} className="criar-wiz-warning">⚠ {a}</div>)}
          </div>
        )}
      </main>

      <footer className="criar-wiz-footer">
        <div className="criar-wiz-footer-step">
          Passo {stepNum} de {total}
        </div>
        <div className="criar-wiz-footer-actions">
          <button
            type="button"
            className="wiz-btn-secondary"
            onClick={onPrev}
            disabled={isFirst}
          >
            ← Voltar
          </button>
          {!isLast && (
            <button
              type="button"
              className="wiz-btn-primary"
              onClick={onNext}
            >
              Próximo →
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
