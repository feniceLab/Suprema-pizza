import type { ApiClientRow } from '../types';
import type { MetricasSobral } from '../../../trafego';
import { fmtBRL, fmtRoas } from '../format';

interface Props {
  metricas: MetricasSobral;
  curr: ApiClientRow;
  periodoLabel: string;
  /** CTA contextual — quando KILL, oferece criar variante. */
  onCriar?: (motivacao?: string) => void;
}

export function HeroLucro({ metricas, curr, periodoLabel, onCriar }: Props) {
  const isKill = metricas.decisao === 'KILL';
  return (
    <div className={`perf-hero perf-hero--${metricas.semaforo} perf-hero--dec-${metricas.decisao.toLowerCase()}`}>
      <div className="perf-hero-left">
        <div className="perf-hero-label">Lucro pós-ads · {periodoLabel.toLowerCase()}</div>
        <div className="perf-hero-value">
          {metricas.lucroPosAds >= 0 ? '+' : ''}{fmtBRL(metricas.lucroPosAds * 100)}
        </div>
        <div className="perf-hero-sub">
          {fmtRoas(metricas.roas)} ROAS · CPA {fmtBRL(metricas.cpa * 100)}{' '}
          ({metricas.cpaPctTicket.toFixed(0)}% do ticket)
          {curr.purchases > 0 && ` · ${curr.purchases} pedidos`}
        </div>
        {isKill && onCriar && (
          <button
            type="button"
            className="perf-hero-cta perf-no-print"
            onClick={() => onCriar('Substituir campanha em fadiga (decisão Sobral: KILL)')}
          >
            ＋ Criar campanha nova pra substituir
          </button>
        )}
      </div>
      <div className="perf-hero-right">
        <div className={`perf-hero-badge perf-hero-badge--${metricas.decisao.toLowerCase()}`}>
          {metricas.decisao === 'SCALE' ? '🟢 ESCALAR' :
           metricas.decisao === 'HOLD' ? '🟡 MANTER' : '🔴 CORRIGIR'}
        </div>
        <div className="perf-hero-meta">
          margem seg {(metricas.margemSegCpa * 100).toFixed(0)}%<br />
          ticket {fmtBRL(metricas.ticket * 100)}<br />
          margem op {(metricas.margem * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
