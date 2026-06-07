import { useEffect, useState } from 'react';
import { SkeletonTable } from './Skeletons';

interface BreakdownRow {
  [key: string]: any;
  spend_cents: number | null;
  revenue_cents: number | null;
  purchases: number | null;
  roas: number | null;
  impressions: number | null;
  reach: number | null;
  clicks: number | null;
  ctr: number | null;
  link_clicks: number | null;
}

const API_BASE = (import.meta as any).env?.VITE_TRAFEGO_URL || '';

const TABS: { key: string; label: string; breakdowns: string; dimKeys: string[]; dimLabel: string }[] = [
  { key: 'age', label: 'Idade & Gênero', breakdowns: 'age,gender', dimKeys: ['age', 'gender'], dimLabel: 'Grupo' },
  { key: 'placement', label: 'Onde apareceu', breakdowns: 'publisher_platform', dimKeys: ['publisher_platform'], dimLabel: 'Plataforma' },
  { key: 'dma', label: 'Região', breakdowns: 'dma', dimKeys: ['dma'], dimLabel: 'Região (DMA)' },
  { key: 'country', label: 'País', breakdowns: 'country', dimKeys: ['country'], dimLabel: 'País' },
];

const fmtBRL = (cents: number | null) =>
  cents == null ? '—' : 'R$ ' + (cents / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
const fmtNum = (n: number | null) => n == null ? '—' : Math.round(n).toLocaleString('pt-BR');
const fmtRoas = (n: number | null) => n == null || n === 0 ? '—' : n.toFixed(2) + '×';

interface Props {
  slug: string;
  preset?: string;
  since?: string;
  until?: string;
}

export function Breakdowns({ slug, preset, since, until }: Props) {
  const [activeTab, setActiveTab] = useState<string>('age');
  const [data, setData] = useState<Record<string, BreakdownRow[]>>({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const currentTab = TABS.find((t) => t.key === activeTab)!;

  useEffect(() => {
    if (data[activeTab]) return; // já carregado
    setLoading(true);
    setErr(null);
    const params = new URLSearchParams({ slug, breakdowns: currentTab.breakdowns });
    if (since && until) { params.set('since', since); params.set('until', until); }
    else if (preset) params.set('preset', preset);
    fetch(`${API_BASE}/api/breakdown?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErr(d.error);
        else setData((prev) => ({ ...prev, [activeTab]: d.rows || [] }));
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [activeTab, slug, preset, since, until, currentTab.breakdowns, data]);

  const rows = (data[activeTab] || []).slice().sort((a, b) => (b.spend_cents || 0) - (a.spend_cents || 0));
  const maxSpend = Math.max(...rows.map((r) => r.spend_cents || 0), 1);

  return (
    <div className="perf-block perf-breakdowns">
      <div className="perf-block-head">
        <div>
          <div className="perf-section-kicker">Breakdowns</div>
          <div className="perf-section-title">De onde vem cada real</div>
        </div>
        <div className="perf-metric-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`perf-metric-tab${t.key === activeTab ? ' is-on' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <SkeletonTable rows={6} />}
      {err && <div className="perf-empty">Indisponível: {err}</div>}
      {!loading && !err && rows.length === 0 && (
        <div className="perf-empty">Sem dados de {currentTab.label.toLowerCase()} no período.</div>
      )}

      {rows.length > 0 && (
        <div className="perf-breakdown-table">
          <div className="perf-bd-row perf-bd-row--head">
            <div>{currentTab.dimLabel}</div>
            <div className="ta-r">Gasto</div>
            <div></div>
            <div className="ta-r">Compras</div>
            <div className="ta-r">ROAS</div>
          </div>
          {rows.map((row, i) => {
            const dim = currentTab.dimKeys.map((k) => row[k]).filter(Boolean).join(' · ') || '—';
            const pct = ((row.spend_cents || 0) / maxSpend) * 100;
            return (
              <div key={i} className="perf-bd-row">
                <div className="perf-bd-dim">{dim}</div>
                <div className="ta-r mono">{fmtBRL(row.spend_cents)}</div>
                <div className="perf-bd-bar">
                  <div className="perf-bd-bar-fill" style={{ width: `${Math.max(2, pct)}%` }} />
                </div>
                <div className="ta-r mono">{fmtNum(row.purchases)}</div>
                <div className="ta-r mono">{fmtRoas(row.roas)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
