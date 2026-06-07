import { useEffect, useState } from 'react';
import { FavoritoStar } from './FavoritoStar';
import { SkeletonTable } from './Skeletons';
import { CriativoDrillDown } from './CriativoDrillDown';

interface AdRow {
  ad_id: string;
  name: string;
  status: string | null;
  effective_status: string | null;
  campaign_name: string;
  adset_name: string;
  thumbnail_url: string | null;
  image_url_hd: string | null;
  headline: string | null;
  body: string | null;
  spend_cents: number | null;
  revenue_cents: number | null;
  purchases: number | null;
  roas: number | null;
  impressions: number | null;
  ctr: number | null;
  link_clicks: number | null;
}

const API_BASE = (import.meta as any).env?.VITE_TRAFEGO_URL || '';

const fmtBRL = (cents: number | null) =>
  cents == null ? '—' : 'R$ ' + (cents / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
const fmtRoas = (n: number | null) => (n == null ? '—' : n.toFixed(2) + '×');

interface Props {
  slug: string;
  preset?: string;
  since?: string;
  until?: string;
  /** Identificador do usuário pra audit log no drilldown. */
  actor?: string;
  /** auth.users.id — favoritos persistem no Supabase quando presente. */
  authId?: string;
}

interface OpenAdState {
  ad_id: string;
  ad_name: string;
}

export function Criativos({ slug, preset, since, until, actor, authId }: Props) {
  const [ads, setAds] = useState<AdRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [openAd, setOpenAd] = useState<OpenAdState | null>(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    const params = new URLSearchParams({ slug });
    if (since && until) { params.set('since', since); params.set('until', until); }
    else if (preset) params.set('preset', preset);
    fetch(`${API_BASE}/api/ads?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErr(d.error);
        else setAds(d.ads || []);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [slug, preset, since, until]);

  if (loading) return <SkeletonTable rows={4} />;
  if (err) return <div className="perf-empty">Criativos indisponíveis: {err}</div>;
  if (ads.length === 0) return null;

  const top = ads.filter((a) => (a.purchases || 0) > 0).slice(0, 4);
  // worst: ads ativos com gasto >R$ 50 e ROAS baixo
  const worst = ads
    .filter((a) => (a.spend_cents || 0) > 5000 && (a.roas || 0) < 2)
    .slice(-3)
    .reverse();

  const openCriativo = (ad: AdRow) => setOpenAd({ ad_id: ad.ad_id, ad_name: ad.name });

  return (
    <div className="perf-block perf-criativos">
      <div className="perf-block-head">
        <div>
          <div className="perf-section-kicker">Criativos · Pareto</div>
          <div className="perf-section-title">Top 4 · o que está puxando</div>
        </div>
      </div>
      <div className="perf-criativos-grid">
        {top.map((a) => (
          <AdCard key={a.ad_id} ad={a} tone="ok" slug={slug} onOpen={openCriativo} authId={authId} />
        ))}
      </div>

      {worst.length > 0 && (
        <>
          <div className="perf-block-head" style={{ marginTop: 24 }}>
            <div>
              <div className="perf-section-kicker">Atenção</div>
              <div className="perf-section-title">Queimando dinheiro · candidatos a pausar</div>
            </div>
          </div>
          <div className="perf-criativos-grid">
            {worst.map((a) => (
              <AdCard key={a.ad_id} ad={a} tone="bad" slug={slug} onOpen={openCriativo} authId={authId} />
            ))}
          </div>
        </>
      )}

      {openAd && (
        <CriativoDrillDown
          slug={slug}
          preset={preset}
          ad_id={openAd.ad_id}
          ad_name={openAd.ad_name}
          onClose={() => setOpenAd(null)}
          actor={actor}
        />
      )}
    </div>
  );
}

function AdCard({
  ad,
  tone,
  slug,
  onOpen,
  authId,
}: {
  ad: AdRow;
  tone: 'ok' | 'bad';
  slug: string;
  onOpen: (ad: AdRow) => void;
  authId?: string;
}) {
  // Imagem HD tem prioridade (backend novo) com fallback pra thumbnail (atual).
  const imgSrc = ad.image_url_hd || ad.thumbnail_url;

  const handleClick = () => onOpen(ad);
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(ad);
    }
  };

  return (
    <div
      className={`perf-ad-card perf-ad-card--${tone} perf-ad-card--clickable`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKey}
      aria-label={`Abrir detalhes do criativo ${ad.name}`}
    >
      <div className="perf-ad-thumb" style={{ position: 'relative' }}>
        {imgSrc ? (
          <img src={imgSrc} alt={ad.name} loading="lazy" />
        ) : (
          <div className="perf-ad-thumb-placeholder">sem thumb</div>
        )}
        {/* FavoritoStar intercepta clique pra não abrir o modal */}
        <span
          className="perf-ad-fav-wrap"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <FavoritoStar slug={slug} adId={ad.ad_id} className="is-overlay" authId={authId} />
        </span>
        <div className={`perf-ad-roas perf-ad-roas--${tone}`}>{fmtRoas(ad.roas)}</div>
      </div>
      <div className="perf-ad-info">
        <div className="perf-ad-name" title={ad.name}>{ad.name}</div>
        {ad.headline && <div className="perf-ad-headline">{ad.headline}</div>}
        {ad.body && <div className="perf-ad-body">{ad.body.slice(0, 120)}{ad.body.length > 120 ? '…' : ''}</div>}
        <div className="perf-ad-metrics">
          <span>{fmtBRL(ad.spend_cents)} gasto</span>
          <span>·</span>
          <span>{ad.purchases ?? 0} compras</span>
          {ad.ctr != null && <><span>·</span><span>CTR {ad.ctr.toFixed(2)}%</span></>}
        </div>
      </div>
    </div>
  );
}
