import type { Alerta } from '../../../trafego';

interface Props {
  alertas: Alerta[];
  /** CTA contextual — alertas crítico/aviso ganham botão "criar variante". */
  onCriar?: (motivacao?: string) => void;
}

export function AlertasList({ alertas, onCriar }: Props) {
  if (alertas.length === 0) {
    return (
      <div className="perf-alerts-empty">
        <span className="perf-alerts-empty-icon">✓</span>
        <div>
          <div className="perf-alerts-empty-title">Sem alertas operacionais</div>
          <div className="perf-alerts-empty-sub">Operação dentro dos parâmetros Sobral.</div>
        </div>
      </div>
    );
  }
  return (
    <div className="perf-alerts">
      {alertas.map((al, i) => {
        const acionavel = onCriar && (al.severidade === 'critico' || al.severidade === 'aviso');
        return (
          <div key={i} className={`perf-alert perf-alert--${al.severidade}`}>
            <span className="perf-alert-icon" aria-hidden>
              {al.severidade === 'critico' ? '🚨' : al.severidade === 'aviso' ? '⚠' : 'ⓘ'}
            </span>
            <div className="perf-alert-body">
              <div className="perf-alert-title">{al.titulo}</div>
              <div className="perf-alert-detail">{al.detalhe}</div>
              {acionavel && (
                <button
                  type="button"
                  className="perf-alert-cta perf-no-print"
                  onClick={() => onCriar?.(`${al.titulo} — ${al.detalhe}`)}
                >
                  ＋ Criar campanha nova
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
