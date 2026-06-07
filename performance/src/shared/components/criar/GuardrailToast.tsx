// Alerta inline de guardrail Sobral (budget abaixo do mínimo, etc).
// Não é toast flutuante — é card inline na step.

export type GuardrailSeveridade = 'aviso' | 'erro' | 'info';

export interface GuardrailToastProps {
  severidade?: GuardrailSeveridade;
  titulo: string;
  detalhe?: string;
  onDismiss?: () => void;
}

export function GuardrailToast({
  severidade = 'aviso',
  titulo,
  detalhe,
  onDismiss,
}: GuardrailToastProps) {
  return (
    <div className={`criar-guard criar-guard--${severidade}`} role="alert">
      <div className="criar-guard-icon" aria-hidden>
        {severidade === 'erro' ? '⚠' : severidade === 'info' ? 'ℹ' : '!'}
      </div>
      <div className="criar-guard-body">
        <div className="criar-guard-title">{titulo}</div>
        {detalhe && <div className="criar-guard-detail">{detalhe}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="criar-guard-close"
          onClick={onDismiss}
          aria-label="Dispensar aviso"
        >
          ×
        </button>
      )}
    </div>
  );
}
