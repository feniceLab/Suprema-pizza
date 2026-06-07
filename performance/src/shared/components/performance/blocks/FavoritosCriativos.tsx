// ============================================================
// FavoritosCriativos — painel que mostra ads marcados como favoritos.
// Lê do hook useFavoritos(slug) e busca os dados frescos via /api/ads.
// Filtra por ad_ids favoritados, ordena por ROAS desc.
// ============================================================

import { useEffect, useState } from 'react';
import { useFavoritos } from '../useFavoritos';
import { SkeletonTable } from './Skeletons';

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

interface Props {
  slug: string;
  preset?: string;
  /**
   * Id do usuário autenticado (auth.users.id). Se presente, os favoritos
   * são persistidos no Supabase por usuário; senão, caem no localStorage.
   *
   * TODO(wiring): o WarRoomShell tem `userAuthId` mas ainda não repassa para
   * Criativos → FavoritosCriativos. Outro agente deve encadear essa prop
   * (WarRoomShell → Criativos → FavoritosCriativos) pra ativar o modo Supabase.
   */
  authId?: string;
}

const API_BASE = (import.meta as any).env?.VITE_TRAFEGO_URL || '';

const fmtBRL = (cents: number | null) =>
  cents == null
    ? '—'
    : 'R$ ' + (cents / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
const fmtRoas = (n: number | null) => (n == null ? '—' : n.toFixed(2) + '×');

const STYLES_ID = 'fenice-perf-favs-styles';
const STYLES_CSS = `
.perf-favs {
  padding: 22px 24px;
  border: 1px solid var(--p-line);
  border-radius: 14px;
  background: var(--p-card);
}
.perf-favs-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.perf-favs-kicker {
  font-family: var(--p-font-body);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--p-muted);
}
.perf-favs-title {
  font-family: var(--p-font-display);
  font-size: 20px;
  color: var(--p-ink);
  margin-top: 4px;
}
.perf-favs-empty {
  padding: 36px 24px;
  text-align: center;
  color: var(--p-muted);
  font-family: var(--p-font-body);
  font-size: 14px;
  line-height: 1.55;
}
.perf-favs-empty strong { color: var(--p-ink); display: block; margin-bottom: 6px; font-size: 15px; }
.perf-favs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
  margin-top: 14px;
}
.perf-fav-card {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--p-line);
  border-radius: 10px;
  background: var(--p-card2);
  align-items: start;
}
.perf-fav-card img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  background: var(--p-card);
}
.perf-fav-thumb-ph {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: var(--p-card);
  border: 1px dashed var(--p-line);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--p-faint);
}
.perf-fav-info { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.perf-fav-name {
  font-family: var(--p-font-body);
  font-size: 13px;
  color: var(--p-ink);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.perf-fav-headline {
  font-size: 12px;
  color: var(--p-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.perf-fav-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 11px;
  color: var(--p-muted);
  margin-top: 4px;
}
.perf-fav-metrics .perf-fav-roas { color: var(--p-ok); font-weight: 600; }
.perf-fav-metrics .perf-fav-roas--bad { color: var(--p-bad); }
.perf-fav-remove {
  background: transparent;
  border: 0;
  color: var(--p-muted);
  cursor: pointer;
  font-size: 18px;
  align-self: flex-start;
  padding: 2px 6px;
  line-height: 1;
}
.perf-fav-remove:hover { color: var(--p-bad); }
.perf-favs-error {
  padding: 16px;
  color: var(--p-muted);
  font-size: 13px;
  font-style: italic;
}
`;

function ensureStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLES_ID)) return;
  const style = document.createElement('style');
  style.id = STYLES_ID;
  style.textContent = STYLES_CSS;
  document.head.appendChild(style);
}

export function FavoritosCriativos({ slug, preset = 'last_month', authId }: Props) {
  if (typeof document !== 'undefined') ensureStyles();

  const { favoritos, toggleFav } = useFavoritos(slug, authId);
  const [ads, setAds] = useState<AdRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (favoritos.length === 0) {
      setAds([]);
      setLoading(false);
      setErr(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErr(null);

    const params = new URLSearchParams({ slug });
    if (preset) params.set('preset', preset);

    fetch(`${API_BASE}/api/ads?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.error) {
          setErr(d.error);
          setAds([]);
        } else {
          setAds((d.ads || []) as AdRow[]);
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setErr(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Recarrega quando muda o cliente, o preset ou o tamanho da lista
    // (novo fav adicionado) — favoritos.join garante estabilidade da dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, preset, favoritos.join('|')]);

  const renderHead = (count: number) => (
    <div className="perf-favs-head">
      <div>
        <div className="perf-favs-kicker">Acompanhamento</div>
        <div className="perf-favs-title">Criativos favoritos · {count}</div>
      </div>
    </div>
  );

  if (favoritos.length === 0) {
    return (
      <div className="perf-favs">
        {renderHead(0)}
        <div className="perf-favs-empty">
          <strong>Sua lista de favoritos está vazia</strong>
          Marque ads como favoritos clicando na ★ pra acompanhar aqui.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="perf-favs">
        {renderHead(favoritos.length)}
        <SkeletonTable rows={Math.min(favoritos.length, 4)} />
      </div>
    );
  }

  if (err) {
    return (
      <div className="perf-favs">
        {renderHead(favoritos.length)}
        <div className="perf-favs-error">Não foi possível carregar os favoritos: {err}</div>
      </div>
    );
  }

  const favSet = new Set(favoritos);
  const lista = ads
    .filter((a) => favSet.has(a.ad_id))
    .sort((a, b) => (b.roas || 0) - (a.roas || 0));

  if (lista.length === 0) {
    return (
      <div className="perf-favs">
        {renderHead(favoritos.length)}
        <div className="perf-favs-empty">
          <strong>Nenhum ad encontrado no período</strong>
          Os {favoritos.length} ad(s) favoritado(s) não tiveram dados em <code>{preset}</code>.
        </div>
      </div>
    );
  }

  return (
    <div className="perf-favs">
      {renderHead(lista.length)}
      <div className="perf-favs-grid">
        {lista.map((ad) => (
          <FavCard key={ad.ad_id} ad={ad} onRemove={() => toggleFav(ad.ad_id)} />
        ))}
      </div>
    </div>
  );
}

function FavCard({ ad, onRemove }: { ad: AdRow; onRemove: () => void }) {
  const roasClass = (ad.roas || 0) >= 2 ? 'perf-fav-roas' : 'perf-fav-roas perf-fav-roas--bad';
  return (
    <div className="perf-fav-card">
      {ad.thumbnail_url ? (
        <img src={ad.thumbnail_url} alt={ad.name} loading="lazy" />
      ) : (
        <div className="perf-fav-thumb-ph">sem thumb</div>
      )}
      <div className="perf-fav-info">
        <div className="perf-fav-name" title={ad.name}>
          {ad.name}
        </div>
        {ad.headline && (
          <div className="perf-fav-headline" title={ad.headline}>
            {ad.headline}
          </div>
        )}
        <div className="perf-fav-metrics">
          <span className={roasClass}>ROAS {fmtRoas(ad.roas)}</span>
          <span>·</span>
          <span>{fmtBRL(ad.spend_cents)} gasto</span>
          <span>·</span>
          <span>{ad.purchases ?? 0} compras</span>
        </div>
      </div>
      <button
        type="button"
        className="perf-fav-remove"
        onClick={onRemove}
        aria-label="Remover dos favoritos"
        title="Remover dos favoritos"
      >
        ✕
      </button>
    </div>
  );
}
