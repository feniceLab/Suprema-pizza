import { useEffect, useState } from 'react';
import { SkeletonTable } from './Skeletons';

interface ApiClientRow {
  slug: string;
  spend_cents: number;
  revenue_cents: number;
  purchases: number;
  roas: number;
}

const API_BASE = (import.meta as any).env?.VITE_TRAFEGO_URL || '';
const MESES_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

interface MesAgg {
  label: string;
  since: string;
  until: string;
  spend: number;
  revenue: number;
  purchases: number;
  roas: number;
  lucro: number;
}

const fmtBRL = (v: number) => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
const fmtRoas = (n: number) => n.toFixed(2) + '×';

interface Props {
  slug: string;
  margemCliente: number;
  monthsBack?: number;
}

export function ComparativoMensal({ slug, margemCliente, monthsBack = 6 }: Props) {
  const [meses, setMeses] = useState<MesAgg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ranges: { label: string; since: string; until: string }[] = [];
    const today = new Date();
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      const since = d.toISOString().slice(0, 10);
      const until = end.toISOString().slice(0, 10);
      ranges.push({
        label: `${MESES_PT[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`,
        since, until,
      });
    }
    Promise.all(ranges.map((r) =>
      fetch(`${API_BASE}/api/insights?since=${r.since}&until=${r.until}`, { cache: 'no-store' })
        .then((res) => res.json())
        .then((j) => {
          const c = (j.clients || []).find((x: ApiClientRow) => x.slug === slug);
          const spend = (c?.spend_cents || 0) / 100;
          const revenue = (c?.revenue_cents || 0) / 100;
          return {
            label: r.label, since: r.since, until: r.until,
            spend, revenue,
            purchases: c?.purchases || 0,
            roas: c?.roas || 0,
            lucro: revenue * margemCliente - spend,
          };
        })
        .catch(() => ({ label: r.label, since: r.since, until: r.until, spend: 0, revenue: 0, purchases: 0, roas: 0, lucro: 0 }))
    )).then((arr) => {
      setMeses(arr);
      setLoading(false);
    });
  }, [slug, margemCliente, monthsBack]);

  if (loading) return <SkeletonTable rows={monthsBack} />;
  if (meses.every((m) => m.revenue === 0)) return null;

  return (
    <div className="perf-block perf-comp-mensal">
      <div className="perf-block-head">
        <div>
          <div className="perf-section-kicker">Histórico mensal</div>
          <div className="perf-section-title">{monthsBack} meses lado a lado</div>
        </div>
      </div>
      <div className="perf-comp-table">
        <div className="perf-comp-row perf-comp-row--head">
          <div>Mês</div>
          <div className="ta-r">Faturamento</div>
          <div className="ta-r">Investido</div>
          <div className="ta-r">Compras</div>
          <div className="ta-r">ROAS</div>
          <div className="ta-r">Lucro pós-ads</div>
          <div className="ta-r">Δ vs anterior</div>
        </div>
        {meses.map((m, i) => {
          const prev = i > 0 ? meses[i - 1] : null;
          const deltaPct = prev && prev.lucro !== 0 ? ((m.lucro - prev.lucro) / Math.abs(prev.lucro)) * 100 : null;
          const arrow = deltaPct == null ? '' : deltaPct > 0 ? '↑' : deltaPct < 0 ? '↓' : '·';
          const tone = deltaPct == null ? 'neutral' : deltaPct > 0 ? 'ok' : 'bad';
          return (
            <div key={m.label} className="perf-comp-row">
              <div className="perf-comp-mes">{m.label}</div>
              <div className="ta-r mono">{fmtBRL(m.revenue)}</div>
              <div className="ta-r mono">{fmtBRL(m.spend)}</div>
              <div className="ta-r mono">{m.purchases}</div>
              <div className="ta-r mono">{fmtRoas(m.roas)}</div>
              <div className="ta-r mono"><strong>{m.lucro >= 0 ? '+' : ''}{fmtBRL(m.lucro)}</strong></div>
              <div className={`ta-r mono perf-comp-delta--${tone}`}>{deltaPct == null ? '—' : `${arrow} ${Math.abs(deltaPct).toFixed(0)}%`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
