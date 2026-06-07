import { useEffect, useMemo, useState } from 'react';
import { SkeletonTable } from './Skeletons';
import { ComparativoAds } from './ComparativoAds';
import { FavoritoStar } from './FavoritoStar';
import {
  useEntityActions,
  ConfirmModal,
  ToastView,
  EntityActionButton,
} from './EntityActions';

interface AdRow {
  ad_id: string;
  name: string;
  status: string | null;
  effective_status: string | null;
  campaign_id: string;
  campaign_name: string;
  adset_id: string;
  adset_name: string;
  thumbnail_url: string | null;
  headline: string | null;
  body: string | null;
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

const fmtBRL = (cents: number | null) =>
  cents == null ? '—' : 'R$ ' + (cents / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
const fmtNum = (n: number | null) => n == null ? '—' : Math.round(n).toLocaleString('pt-BR');
const fmtRoas = (n: number | null) => (n == null ? '—' : n.toFixed(2) + '×');

export interface CampanhaDrillDownProps {
  slug: string;
  preset?: string;
  campaign_id: string;
  campaign_name: string;
  onClose: () => void;
  /** Identificador do usuário pra audit log (email ou nome). */
  actor?: string;
}

export function CampanhaDrillDown({ slug, preset, campaign_id, campaign_name, onClose, actor }: CampanhaDrillDownProps) {
  const [ads, setAds] = useState<AdRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Hook compartilhado: pause/resume de campaign/adset/ad com modal+toast
  // actor vem da prop (passado via WarRoomShell → useAuth no Painel); fallback 'Painel'.
  const actions = useEntityActions(slug, actor || 'Painel');

  useEffect(() => {
    setLoading(true);
    setErr(null);
    const params = new URLSearchParams({ slug, campaign_id });
    if (preset) params.set('preset', preset);
    fetch(`${API_BASE}/api/ads?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErr(d.error);
        else setAds(d.ads || []);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [slug, preset, campaign_id, reloadKey]);

  // ESC fecha
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Agrupa ads por adset
  const groups = useMemo(() => {
    const map = new Map<string, { adset_id: string; adset_name: string; ads: AdRow[] }>();
    for (const ad of ads) {
      const key = ad.adset_id || '_';
      if (!map.has(key)) {
        map.set(key, { adset_id: ad.adset_id, adset_name: ad.adset_name || '(sem adset)', ads: [] });
      }
      map.get(key)!.ads.push(ad);
    }
    // Ordena cada grupo por ROAS desc e adsets por gasto total desc
    const arr = [...map.values()];
    for (const g of arr) g.ads.sort((a, b) => (b.roas || 0) - (a.roas || 0));
    arr.sort((a, b) => {
      const ag = a.ads.reduce((s, x) => s + (x.spend_cents || 0), 0);
      const bg = b.ads.reduce((s, x) => s + (x.spend_cents || 0), 0);
      return bg - ag;
    });
    return arr;
  }, [ads]);

  // Totais
  const totals = useMemo(() => {
    return ads.reduce(
      (acc, a) => ({
        spend: acc.spend + (a.spend_cents || 0),
        revenue: acc.revenue + (a.revenue_cents || 0),
        purchases: acc.purchases + (a.purchases || 0),
        impressions: acc.impressions + (a.impressions || 0),
      }),
      { spend: 0, revenue: 0, purchases: 0, impressions: 0 }
    );
  }, [ads]);
  const totalRoas = totals.spend > 0 ? totals.revenue / totals.spend : 0;

  return (
    <div className="perf-drill-overlay" onClick={onClose}>
      <div className="perf-drill" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="perf-drill-head">
          <div>
            <div className="perf-section-kicker">Drill-down · campanha</div>
            <div className="perf-drill-title">{campaign_name}</div>
            <div className="perf-drill-sub">
              {ads.length} ads em {groups.length} adset{groups.length !== 1 ? 's' : ''}
              {' · '}
              <strong>{fmtBRL(totals.spend)}</strong> investido
              {' · '}
              <strong>{fmtBRL(totals.revenue)}</strong> faturamento
              {' · '}
              ROAS <strong>{fmtRoas(totalRoas)}</strong>
              {' · '}
              {totals.purchases} compras
            </div>
          </div>
          <button type="button" className="perf-drill-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        {/* Body */}
        <div className="perf-drill-body">
          {loading && <SkeletonTable rows={4} />}
          {err && <div className="perf-empty">Erro: {err}</div>}
          {!loading && !err && ads.length === 0 && (
            <div className="perf-empty">Sem ads nesta campanha no período.</div>
          )}
          {!loading && groups.map((g) => {
            const adsetSpend = g.ads.reduce((s, a) => s + (a.spend_cents || 0), 0);
            const adsetRev = g.ads.reduce((s, a) => s + (a.revenue_cents || 0), 0);
            const adsetRoas = adsetSpend > 0 ? adsetRev / adsetSpend : 0;
            const adsetPurchases = g.ads.reduce((s, a) => s + (a.purchases || 0), 0);
            // Status agregado do adset (majoritário dos ads pra decidir pause/resume)
            const active = g.ads.filter((a) => a.effective_status === 'ACTIVE').length;
            const paused = g.ads.filter((a) => a.effective_status === 'PAUSED').length;
            const adsetStatus = active > paused ? 'ACTIVE' : paused > 0 ? 'PAUSED' : null;
            return (
              <div key={g.adset_id || g.adset_name} className="perf-adset-group">
                <div className="perf-adset-head">
                  <div className="perf-adset-name">{g.adset_name}</div>
                  <div className="perf-adset-meta">
                    {g.ads.length} ad{g.ads.length !== 1 ? 's' : ''} · {fmtBRL(adsetSpend)} · ROAS {fmtRoas(adsetRoas)} · {adsetPurchases} compras
                  </div>
                  {g.adset_id && adsetStatus && (
                    <EntityActionButton
                      entity_type="adset"
                      entity_id={g.adset_id}
                      name={g.adset_name}
                      effective_status={adsetStatus}
                      onConfirmAsk={actions.setConfirming}
                      pending={actions.pending}
                    />
                  )}
                </div>
                <div className="perf-drill-ads">
                  {g.ads.map((a) => {
                    const tone = (a.roas || 0) >= 3 ? 'ok' : (a.roas || 0) < 1.5 ? 'bad' : 'neutral';
                    return (
                      <div key={a.ad_id} className={`perf-drill-ad perf-drill-ad--${tone}`}>
                        <div style={{ position: 'relative' }}>
                          {a.thumbnail_url ? (
                            <img className="perf-drill-ad-thumb" src={a.thumbnail_url} alt={a.name} loading="lazy" />
                          ) : (
                            <div className="perf-drill-ad-thumb perf-drill-ad-thumb--ph">no thumb</div>
                          )}
                          <FavoritoStar slug={slug} adId={a.ad_id} className="is-overlay" />
                        </div>
                        <div className="perf-drill-ad-info">
                          <div className="perf-drill-ad-name" title={a.name}>
                            {a.name}
                            <EntityActionButton
                              entity_type="ad"
                              entity_id={a.ad_id}
                              name={a.name}
                              effective_status={a.effective_status}
                              onConfirmAsk={actions.setConfirming}
                              pending={actions.pending}
                            />
                          </div>
                          {a.headline && <div className="perf-drill-ad-headline">{a.headline}</div>}
                          {a.body && <div className="perf-drill-ad-body">{a.body.slice(0, 100)}{a.body.length > 100 ? '…' : ''}</div>}
                          <div className="perf-drill-ad-stats">
                            <span className={`perf-drill-ad-roas perf-drill-ad-roas--${tone}`}>{fmtRoas(a.roas)}</span>
                            <span>{fmtBRL(a.spend_cents)}</span>
                            <span>·</span>
                            <span>{a.purchases ?? 0} compras</span>
                            {a.ctr != null && <><span>·</span><span>CTR {a.ctr.toFixed(2)}%</span></>}
                            <span>·</span>
                            <span>{fmtNum(a.impressions)} impressões</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <ComparativoAds ads={g.ads} adset_name={g.adset_name} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de confirmação de pause/resume (ad ou adset) */}
      {actions.confirming && (
        <ConfirmModal
          entity_type={actions.confirming.entity_type}
          entity_name={actions.confirming.name}
          action={actions.confirming.action}
          loading={actions.pending != null}
          onCancel={() => actions.setConfirming(null)}
          onConfirm={async () => {
            const { entity_type, entity_id, action, name } = actions.confirming!;
            const r = await actions.doAction(entity_type, entity_id, action, name);
            if (r.ok) setReloadKey((k) => k + 1);
          }}
        />
      )}

      {/* Toast de sucesso/erro */}
      <ToastView toast={actions.toast} />
    </div>
  );
}
