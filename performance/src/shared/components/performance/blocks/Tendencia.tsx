import { useEffect, useMemo, useState } from 'react';
import { SkeletonChart } from './Skeletons';

interface DayRow {
  date: string;
  spend_cents: number | null;
  revenue_cents: number | null;
  purchases: number | null;
  roas: number | null;
  impressions: number | null;
  reach: number | null;
  clicks: number | null;
  ctr: number | null;
  link_clicks: number | null;
  add_to_cart: number | null;
}

type Metric = 'revenue' | 'spend' | 'roas' | 'lucro';

const METRICS: { key: Metric; label: string; color: string }[] = [
  { key: 'revenue', label: 'Faturamento', color: 'var(--r-ok)' },
  { key: 'spend', label: 'Investido', color: 'var(--r-warn)' },
  { key: 'roas', label: 'ROAS', color: 'var(--r-accent)' },
  { key: 'lucro', label: 'Lucro pós-ads', color: 'var(--r-accent2)' },
];

const API_BASE = (import.meta as any).env?.VITE_TRAFEGO_URL || '';

interface Props {
  slug: string;
  preset?: string;
  since?: string;
  until?: string;
  margemCliente: number;
}

export function Tendencia({ slug, preset, since, until, margemCliente }: Props) {
  const [days, setDays] = useState<DayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [metric, setMetric] = useState<Metric>('revenue');

  useEffect(() => {
    setLoading(true);
    setErr(null);
    const params = new URLSearchParams({ slug });
    if (since && until) { params.set('since', since); params.set('until', until); }
    else if (preset) params.set('preset', preset);
    fetch(`${API_BASE}/api/timeseries?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErr(d.error);
        else setDays(d.days || []);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [slug, preset, since, until]);

  const series = useMemo(() => {
    return days.map((d) => {
      const spend = (d.spend_cents || 0) / 100;
      const rev = (d.revenue_cents || 0) / 100;
      const lucro = rev * margemCliente - spend;
      return {
        date: d.date,
        revenue: rev,
        spend,
        roas: d.roas || 0,
        lucro,
      };
    });
  }, [days, margemCliente]);

  if (loading) return <SkeletonChart height={240} />;
  if (err) return <div className="perf-empty">Tendência indisponível: {err}</div>;
  if (series.length === 0) return null;

  const values = series.map((s) => s[metric]);
  const maxV = Math.max(...values, 0);
  const minV = Math.min(...values, 0);
  const range = maxV - minV || 1;
  const W = 800;
  const H = 240;
  const padX = 50;
  const padY = 24;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const xOf = (i: number) => padX + (i / Math.max(1, series.length - 1)) * innerW;
  const yOf = (v: number) => padY + innerH - ((v - minV) / range) * innerH;

  const linePath = series
    .map((s, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i)} ${yOf(s[metric])}`)
    .join(' ');
  const areaPath = `${linePath} L ${xOf(series.length - 1)} ${padY + innerH} L ${xOf(0)} ${padY + innerH} Z`;

  const fmt = (v: number) =>
    metric === 'roas' ? `${v.toFixed(2)}×` :
    `R$ ${v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;

  const accent = METRICS.find((m) => m.key === metric)!.color;

  return (
    <div className="perf-block perf-tendencia">
      <div className="perf-block-head">
        <div>
          <div className="perf-section-kicker">Tendência</div>
          <div className="perf-section-title">Histórico dia a dia</div>
        </div>
        <div className="perf-metric-tabs">
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              className={`perf-metric-tab${m.key === metric ? ' is-on' : ''}`}
              onClick={() => setMetric(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="perf-tendencia-svg" preserveAspectRatio="none">
        {/* grid Y */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const v = minV + range * (1 - p);
          const y = padY + innerH * p;
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="var(--r-line)" strokeWidth="0.5" />
              <text x={padX - 8} y={y + 3} textAnchor="end" fontSize="10" fill="var(--r-faint)" fontFamily="var(--r-font-body)">
                {fmt(v)}
              </text>
            </g>
          );
        })}
        {/* área */}
        <path d={areaPath} fill={accent} opacity="0.12" />
        {/* linha */}
        <path d={linePath} fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {/* pontos */}
        {series.map((s, i) => (
          <g key={s.date}>
            <circle cx={xOf(i)} cy={yOf(s[metric])} r="2.5" fill={accent} />
          </g>
        ))}
        {/* eixo X (primeiro, médio, último) */}
        {[0, Math.floor(series.length / 2), series.length - 1].map((i) => (
          <text key={i} x={xOf(i)} y={H - 4} textAnchor="middle" fontSize="10" fill="var(--r-faint)" fontFamily="var(--r-font-body)">
            {series[i]?.date?.slice(5)}
          </text>
        ))}
      </svg>
      <div className="perf-tendencia-foot">
        <span>Min: {fmt(Math.min(...values))}</span>
        <span>Max: {fmt(Math.max(...values))}</span>
        <span>Média: {fmt(values.reduce((s, v) => s + v, 0) / values.length)}</span>
        <span>{series.length} dias</span>
      </div>
    </div>
  );
}
