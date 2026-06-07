import { useCallback, useEffect, useState } from 'react';
import { SkeletonTable } from './Skeletons';

interface AuditEntry {
  ts: string;
  slug: string;
  entity_type: 'campaign' | 'adset' | 'ad' | null;
  entity_id: string | null;
  entity_name: string | null;
  action: 'pause' | 'resume' | 'budget_up' | 'budget_down' | null;
  factor: number | null;
  actor: string | null;
  ok: boolean;
  error: string | null;
}

type PeriodKey = '24h' | '7d' | '30d' | 'all';
interface PeriodOpt { key: PeriodKey; label: string; sinceMs: number | null; }

const PERIODS: PeriodOpt[] = [
  { key: '24h', label: '24h',  sinceMs: 24 * 3600 * 1000 },
  { key: '7d',  label: '7 dias', sinceMs: 7  * 24 * 3600 * 1000 },
  { key: '30d', label: '30 dias', sinceMs: 30 * 24 * 3600 * 1000 },
  { key: 'all', label: 'Tudo', sinceMs: null },
];

const API_BASE = (import.meta as any).env?.VITE_TRAFEGO_URL || '';

const ENTITY_LABEL: Record<string, string> = {
  campaign: 'campanha',
  adset: 'adset',
  ad: 'criativo',
};
const ACTION_LABEL: Record<string, string> = {
  pause: 'pausou',
  resume: 'reativou',
  budget_up: 'aumentou budget',
  budget_down: 'reduziu budget',
};
const ACTION_ICON: Record<string, string> = {
  pause: '⏸',
  resume: '▶',
  budget_up: '📈',
  budget_down: '📉',
};

function fmtAge(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return `${s}s atrás`;
  if (s < 3600) return `${Math.floor(s / 60)} min atrás`;
  if (s < 86400) return `${Math.floor(s / 3600)}h atrás`;
  return `${Math.floor(s / 86400)}d atrás`;
}

function fmtFullTs(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export interface AuditLogProps {
  slug: string;
  limit?: number;
  /** Filtra só ações em determinado tipo (campaign/adset/ad). */
  entityType?: 'campaign' | 'adset' | 'ad';
}

export function AuditLog({ slug, limit = 20, entityType }: AuditLogProps) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodKey>('24h');

  const load = useCallback(() => {
    setLoading(true);
    setErr(null);
    const params = new URLSearchParams({ slug, limit: String(limit) });
    if (entityType) params.set('entity_type', entityType);
    const opt = PERIODS.find((p) => p.key === period);
    if (opt?.sinceMs != null) {
      const sinceIso = new Date(Date.now() - opt.sinceMs).toISOString();
      params.set('since', sinceIso);
    }
    fetch(`${API_BASE}/api/audit-log?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErr(d.error);
        else setEntries(d.entries || []);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [slug, limit, entityType, period]);

  useEffect(() => { load(); }, [load]);

  // Refresh manual a cada 30s (cada ação fresca aparece sem F5)
  useEffect(() => {
    const t = setInterval(load, 30 * 1000);
    return () => clearInterval(t);
  }, [load]);

  return (
    <div className="perf-block perf-audit">
      <div className="perf-block-head">
        <div>
          <div className="perf-section-kicker">Histórico operacional</div>
          <div className="perf-section-title">O que foi mexido</div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="perf-metric-tabs" role="tablist" aria-label="Período do histórico">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                role="tab"
                aria-selected={p.key === period}
                className={`perf-metric-tab${p.key === period ? ' is-on' : ''}`}
                onClick={() => setPeriod(p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="perf-icon-btn"
            onClick={load}
            disabled={loading}
            aria-label="Atualizar"
            title="Atualizar agora"
          >
            {loading ? '…' : '↻'}
          </button>
        </div>
      </div>
      {loading && entries.length === 0 && <SkeletonTable rows={4} />}
      {err && <div className="perf-empty">Erro: {err}</div>}
      {!loading && entries.length === 0 && !err && (
        <div className="perf-empty">Sem ações registradas ainda. Pause ou reative algo pra começar.</div>
      )}
      {entries.length > 0 && (
        <div className="perf-audit-list">
          {entries.map((e, i) => {
            const icon = e.action ? ACTION_ICON[e.action] : '·';
            const verb = e.action ? ACTION_LABEL[e.action] : '—';
            const label = e.entity_type ? ENTITY_LABEL[e.entity_type] : '—';
            return (
              <div key={i} className={`perf-audit-row perf-audit-row--${e.ok ? 'ok' : 'bad'}`}>
                <span className="perf-audit-icon">{e.ok ? icon : '⚠'}</span>
                <div className="perf-audit-body">
                  <div className="perf-audit-line">
                    <span className="perf-audit-actor">{e.actor || 'Sistema'}</span>{' '}
                    <strong>{verb}</strong> {label} <em>{e.entity_name || e.entity_id || '—'}</em>
                  </div>
                  {!e.ok && e.error && (
                    <div className="perf-audit-error">{e.error}</div>
                  )}
                </div>
                <span className="perf-audit-ts" title={fmtFullTs(e.ts)}>{fmtAge(e.ts)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
