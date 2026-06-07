import type { ApiClientRow } from '../types';
import { fmtBRL, fmtBRL0, fmtNum, fmtPct, fmtRoas, pctDelta } from '../format';

interface Props {
  curr: ApiClientRow;
  prev: ApiClientRow | null;
}

function KpiCard({
  label, value, delta, invert = false, emphasis = false, hero = false,
}: {
  label: string; value: string; delta: number | null; invert?: boolean; emphasis?: boolean; hero?: boolean;
}) {
  let tone: 'ok' | 'bad' | 'neutral' = 'neutral';
  if (delta !== null && Math.abs(delta) >= 0.5) {
    const better = invert ? delta < 0 : delta > 0;
    tone = better ? 'ok' : 'bad';
  }
  const arrow = delta === null ? '' : delta > 0 ? '↑' : delta < 0 ? '↓' : '·';
  const deltaStr = delta === null ? '—' : `${arrow} ${Math.abs(delta).toFixed(1)}%`;
  const classes = ['perf-kpi', hero ? 'is-hero' : '', emphasis ? 'is-emphasis' : '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={classes}>
      <div className="perf-kpi-label">{label}</div>
      <div className="perf-kpi-value">{value}</div>
      <div className={`perf-kpi-delta perf-kpi-delta--${tone}`}>{deltaStr}</div>
    </div>
  );
}

export function KpiGrid({ curr, prev }: Props) {
  const d = (a: number | null | undefined, b: number | null | undefined) =>
    a != null && b != null ? pctDelta(a, b) : null;

  return (
    <div className="perf-kpi-grid">
      <KpiCard label="Faturamento" value={fmtBRL(curr.revenue_cents)} delta={d(curr.revenue_cents, prev?.revenue_cents)} hero />
      <KpiCard label="Investido" value={fmtBRL(curr.spend_cents)} delta={d(curr.spend_cents, prev?.spend_cents)} invert hero />
      <KpiCard label="ROAS" value={fmtRoas(curr.roas)} delta={d(curr.roas, prev?.roas)} emphasis hero />
      <KpiCard label="Compras" value={fmtNum(curr.purchases)} delta={d(curr.purchases, prev?.purchases)} />
      <KpiCard label="Alcance" value={fmtNum(curr.reach)} delta={d(curr.reach, prev?.reach)} />
      <KpiCard label="Impressões" value={fmtNum(curr.impressions)} delta={d(curr.impressions, prev?.impressions)} />
      <KpiCard label="Frequência" value={curr.frequency.toFixed(2)} delta={d(curr.frequency, prev?.frequency)} invert />
      <KpiCard label="CTR" value={fmtPct(curr.ctr)} delta={d(curr.ctr, prev?.ctr)} />
      <KpiCard label="CPM" value={fmtBRL0(curr.cpm * 100)} delta={d(curr.cpm, prev?.cpm)} invert />
      <KpiCard label="CPC" value={`R$ ${curr.cpc.toFixed(2)}`} delta={d(curr.cpc, prev?.cpc)} invert />
    </div>
  );
}
