// Barra de progresso 1/8 ... 8/8 com checkmarks nos steps já validados.
import { STEP_LABELS, STEP_ORDER, type WizardStepKey } from './types';

export interface ProgressBarProps {
  currentStep: WizardStepKey;
  validSteps: Set<WizardStepKey>;
  onJumpTo?: (step: WizardStepKey) => void;
}

export function ProgressBar({ currentStep, validSteps, onJumpTo }: ProgressBarProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="criar-progress" role="navigation" aria-label="Progresso do wizard">
      <div className="criar-progress-track">
        <div
          className="criar-progress-fill"
          style={{ width: `${((currentIndex + 1) / STEP_ORDER.length) * 100}%` }}
        />
      </div>
      <ol className="criar-progress-steps">
        {STEP_ORDER.map((step, idx) => {
          const isDone = validSteps.has(step) && idx < currentIndex;
          const isCurrent = step === currentStep;
          const isPast = idx < currentIndex;
          const reachable = isPast || isCurrent || validSteps.has(step);

          return (
            <li
              key={step}
              className={`criar-progress-step${isCurrent ? ' is-current' : ''}${isDone ? ' is-done' : ''}${isPast ? ' is-past' : ''}`}
            >
              <button
                type="button"
                className="criar-progress-dot"
                disabled={!reachable || !onJumpTo}
                onClick={() => reachable && onJumpTo?.(step)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Passo ${idx + 1}: ${STEP_LABELS[step]}`}
              >
                {isDone ? '✓' : idx + 1}
              </button>
              <span className="criar-progress-label">{STEP_LABELS[step]}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
