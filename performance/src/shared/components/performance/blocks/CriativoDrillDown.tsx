// CriativoDrillDown — modal full-screen com detalhe de um Ad (criativo).
// Consome GET /api/ad-detail?slug&ad_id&preset (backend em paralelo; fallback gracioso).
// Reusa padrão de overlay/animação/UX do CampanhaDrillDown.
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { FavoritoStar } from './FavoritoStar';
import { SkeletonTable } from './Skeletons';
import {
  useEntityActions,
  ConfirmModal,
  ToastView,
} from './EntityActions';

const API_BASE = (import.meta as any).env?.VITE_TRAFEGO_URL || '';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos do payload /api/ad-detail (assumido — backend em paralelo)
// ─────────────────────────────────────────────────────────────────────────────
type CreativeType = 'image' | 'video' | 'carousel';

interface CreativeInfo {
  type: CreativeType;
  image_url_hd?: string | null;
  video_id?: string | null;
  video_url?: string | null;
  instagram_permalink_url?: string | null;
  headline?: string | null;
  body?: string | null;
  cta?: string | null;
  destination_url?: string | null;
}

interface AdDetail {
  ad_id: string;
  ad_name: string;
  campaign_id: string;
  campaign_name: string;
  adset_id: string;
  adset_name: string;
  status: string | null;
  effective_status: string | null;
  creative: CreativeInfo;
}

interface DetailMetricas {
  spend_cents: number | null;
  revenue_cents: number | null;
  roas: number | null;
  purchases: number | null;
  ctr: number | null;
  cpm_cents: number | null;
  cpc_cents: number | null;
  alcance_unico: number | null;
  frequencia: number | null;
  view_content: number | null;
  add_to_cart: number | null;
  initiate_checkout: number | null;
}

interface TendenciaPonto {
  date: string;
  spend_cents: number | null;
  revenue_cents: number | null;
  roas: number | null;
}

interface DemoIdadeGenero {
  age: string;
  gender: string;
  spend_cents: number | null;
  purchases: number | null;
}

interface DemoRegiao {
  region: string;
  spend_cents: number | null;
  purchases: number | null;
}

interface Demografia {
  por_idade_genero: DemoIdadeGenero[];
  por_regiao: DemoRegiao[];
}

interface PlacementRow {
  placement: string;
  spend_cents: number | null;
  impressions: number | null;
}

interface AdDetailResponse {
  ok: boolean;
  ad?: AdDetail;
  metricas?: DetailMetricas;
  tendencia?: TendenciaPonto[];
  demografia?: Demografia;
  placements?: PlacementRow[];
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const fmtBRL = (cents: number | null | undefined) =>
  cents == null ? '—' : 'R$ ' + (cents / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 });

const fmtBRL2 = (cents: number | null | undefined) =>
  cents == null
    ? '—'
    : 'R$ ' + (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtNum = (n: number | null | undefined) =>
  n == null ? '—' : Math.round(n).toLocaleString('pt-BR');

const fmtRoas = (n: number | null | undefined) => (n == null ? '—' : n.toFixed(2) + '×');

const fmtPct = (n: number | null | undefined) =>
  n == null ? '—' : n.toFixed(2) + '%';

const fmtFreq = (n: number | null | undefined) =>
  n == null ? '—' : n.toFixed(2);

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
export interface CriativoDrillDownProps {
  slug: string;
  preset?: string;
  ad_id: string;
  ad_name: string;
  onClose: () => void;
  /** Identificador do usuário pra audit log (email ou nome). */
  actor?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────
export function CriativoDrillDown({
  slug,
  preset,
  ad_id,
  ad_name,
  onClose,
  actor,
}: CriativoDrillDownProps) {
  const [data, setData] = useState<AdDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const actions = useEntityActions(slug, actor || 'Painel');

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Fetch
  useEffect(() => {
    setLoading(true);
    setErr(null);
    setData(null);
    const params = new URLSearchParams({ slug, ad_id });
    if (preset) params.set('preset', preset);
    let cancelled = false;
    fetch(`${API_BASE}/api/ad-detail?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: AdDetailResponse) => {
        if (cancelled) return;
        if (d && d.ok === false) {
          setErr(d.error || 'Dados indisponíveis');
          setData(null);
        } else if (d && d.ad) {
          setData(d);
        } else {
          setErr('Dados indisponíveis');
        }
      })
      .catch((e) => {
        if (!cancelled) setErr(e?.message || 'Erro de rede');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, preset, ad_id, reloadKey]);

  // ESC fecha
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Focus inicial pro botão de fechar (acessibilidade)
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Trava scroll do body enquanto modal está aberto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const ad = data?.ad;
  const metricas = data?.metricas;
  const tendencia = data?.tendencia ?? [];
  const demografia = data?.demografia;
  const placements = data?.placements ?? [];

  const status = ad?.effective_status || ad?.status || null;
  const statusTone = status === 'ACTIVE' ? 'ok' : status === 'PAUSED' ? 'warn' : 'neutral';
  const statusLabel = status || '—';
  const statusDot = status === 'ACTIVE' ? '🟢' : status === 'PAUSED' ? '⏸' : '⚪';

  const roasTone = useMemo(() => {
    const r = metricas?.roas ?? null;
    if (r == null) return 'neutral';
    if (r >= 3) return 'ok';
    if (r < 1.5) return 'bad';
    return 'neutral';
  }, [metricas?.roas]);

  return (
    <div
      className="perf-drill-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="perf-drill criativo-dd"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes do criativo ${ad_name}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="perf-drill-head criativo-dd-head">
          <div>
            <div className="perf-section-kicker">Drill-down · criativo</div>
            <div className="perf-drill-title">{ad?.ad_name || ad_name}</div>
            <div className="perf-drill-sub">
              {ad?.campaign_name && (
                <>
                  <strong>Campanha</strong> · {ad.campaign_name}
                  {' · '}
                </>
              )}
              {ad?.adset_name && (
                <>
                  <strong>AdSet</strong> · {ad.adset_name}
                  {' · '}
                </>
              )}
              <span className={`criativo-dd-status criativo-dd-status--${statusTone}`}>
                {statusDot} {statusLabel}
              </span>
            </div>
          </div>
          <div className="criativo-dd-head-actions">
            <FavoritoStar slug={slug} adId={ad_id} />
            <button
              ref={closeBtnRef}
              type="button"
              className="perf-drill-close"
              onClick={onClose}
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="perf-drill-body criativo-dd-body">
          {loading && (
            <div className="criativo-dd-loading">
              <SkeletonTable rows={4} />
              <div className="perf-block-loading">Carregando detalhes…</div>
            </div>
          )}

          {!loading && err && !ad && (
            <div className="perf-empty">
              Dados indisponíveis · {err}
            </div>
          )}

          {!loading && ad && (
            <>
              {/* Split media + copy */}
              <div className="criativo-dd-split">
                <div className="criativo-dd-media-wrap">
                  <MediaPlayer creative={ad.creative} />
                  {ad.creative.instagram_permalink_url && (
                    <a
                      href={ad.creative.instagram_permalink_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="criativo-dd-ig-link"
                    >
                      Ver no Instagram ↗
                    </a>
                  )}
                </div>
                <CopyBlock creative={ad.creative} />
              </div>

              {/* Métricas principais */}
              {metricas && (
                <div className="criativo-dd-section">
                  <div className="perf-section-kicker">Métricas do período</div>
                  <MetricsRow metricas={metricas} roasTone={roasTone} />
                </div>
              )}

              {/* Tendência */}
              <div className="criativo-dd-section">
                <div className="perf-section-kicker">Tendência</div>
                <div className="perf-section-title">
                  Gasto × faturamento no período
                </div>
                <TendenciaChart data={tendencia} />
              </div>

              {/* Demografia */}
              {demografia && (
                <div className="criativo-dd-section">
                  <div className="perf-section-kicker">Demografia</div>
                  <div className="perf-section-title">Quem está respondendo</div>
                  <DemografiaTables demografia={demografia} />
                </div>
              )}

              {/* Placements */}
              {placements.length > 0 && (
                <div className="criativo-dd-section">
                  <div className="perf-section-kicker">Onde aparece</div>
                  <div className="perf-section-title">Placements</div>
                  <PlacementsList placements={placements} />
                </div>
              )}

              {/* Footer actions */}
              <div className="criativo-dd-actions">
                <button
                  type="button"
                  className="criativo-dd-action criativo-dd-action--warn"
                  disabled={
                    actions.pending === ad.ad_id || status !== 'ACTIVE'
                  }
                  onClick={() => {
                    actions.setConfirming({
                      entity_type: 'ad',
                      entity_id: ad.ad_id,
                      name: ad.ad_name,
                      action: 'pause',
                    });
                  }}
                >
                  {status === 'PAUSED' ? '⏸ Já pausado' : '⏸ Pausar este criativo'}
                </button>
                {status === 'PAUSED' && (
                  <button
                    type="button"
                    className="criativo-dd-action criativo-dd-action--ok"
                    disabled={actions.pending === ad.ad_id}
                    onClick={() => {
                      actions.setConfirming({
                        entity_type: 'ad',
                        entity_id: ad.ad_id,
                        name: ad.ad_name,
                        action: 'resume',
                      });
                    }}
                  >
                    ▶ Reativar
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de confirmação de pause/resume */}
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

      {/* Toast do hook (pause/resume) */}
      <ToastView toast={actions.toast} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MediaPlayer — vídeo nativo, imagem HD ou fallback
// ─────────────────────────────────────────────────────────────────────────────
function MediaPlayer({ creative }: { creative: CreativeInfo }) {
  const [videoErr, setVideoErr] = useState(false);

  const isVideo = creative.type === 'video';
  const canPlay = isVideo && !!creative.video_url && !videoErr;

  // Vídeo com source disponível → player nativo.
  if (canPlay) {
    return (
      <video
        className="criativo-dd-media"
        src={creative.video_url!}
        poster={creative.image_url_hd || undefined}
        controls
        playsInline
        preload="metadata"
        onError={() => setVideoErr(true)}
      />
    );
  }

  // Vídeo SEM source (Meta não liberou) → thumbnail HD com overlay de "play".
  // Se houver permalink, o thumbnail vira link pro Instagram (nova aba).
  // Nunca renderiza <video> quebrado.
  if (isVideo && creative.image_url_hd) {
    const link = creative.instagram_permalink_url || undefined;
    const wrapStyle: CSSProperties = {
      position: 'relative',
      display: 'block',
      cursor: link ? 'pointer' : 'default',
    };
    const playStyle: CSSProperties = {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      color: '#fff',
      background: 'rgba(0,0,0,.28)',
      borderRadius: 12,
      pointerEvents: 'none',
    };
    const inner = (
      <>
        <img
          className="criativo-dd-media"
          src={creative.image_url_hd}
          alt="Criativo (vídeo)"
          loading="lazy"
        />
        <span style={playStyle} aria-hidden={!link}>
          <span style={{ fontSize: 44, lineHeight: 1 }}>▶</span>
          {link && (
            <span style={{ fontSize: 12, fontWeight: 600 }}>Ver no Instagram</span>
          )}
        </span>
      </>
    );
    return link ? (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={wrapStyle}
        title="Ver vídeo no Instagram"
        aria-label="Ver vídeo no Instagram"
      >
        {inner}
      </a>
    ) : (
      <div style={wrapStyle}>{inner}</div>
    );
  }

  if (creative.image_url_hd) {
    return (
      <img
        className="criativo-dd-media"
        src={creative.image_url_hd}
        alt="Criativo"
        loading="lazy"
      />
    );
  }

  return (
    <div className="criativo-dd-media criativo-dd-media--ph">
      <span>sem mídia</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CopyBlock — headline / body / CTA / destination
// ─────────────────────────────────────────────────────────────────────────────
function CopyBlock({ creative }: { creative: CreativeInfo }) {
  return (
    <div className="criativo-dd-copy">
      {creative.headline && (
        <div className="criativo-dd-copy-row">
          <div className="criativo-dd-copy-label">Headline</div>
          <div className="criativo-dd-copy-text">{creative.headline}</div>
        </div>
      )}
      {creative.body && (
        <div className="criativo-dd-copy-row">
          <div className="criativo-dd-copy-label">Body</div>
          <div className="criativo-dd-copy-text criativo-dd-copy-text--body">
            {creative.body}
          </div>
        </div>
      )}
      {creative.cta && (
        <div className="criativo-dd-copy-row">
          <div className="criativo-dd-copy-label">CTA</div>
          <div className="criativo-dd-copy-cta">{creative.cta}</div>
        </div>
      )}
      {creative.destination_url && (
        <div className="criativo-dd-copy-row">
          <div className="criativo-dd-copy-label">Destino</div>
          <a
            href={creative.destination_url}
            target="_blank"
            rel="noopener noreferrer"
            className="criativo-dd-copy-link"
          >
            {creative.destination_url}
          </a>
        </div>
      )}
      {!creative.headline && !creative.body && !creative.cta && !creative.destination_url && (
        <div className="criativo-dd-copy-empty">Sem copy registrada para este criativo.</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MetricsRow — KPIs horizontais
// ─────────────────────────────────────────────────────────────────────────────
function MetricsRow({
  metricas,
  roasTone,
}: {
  metricas: DetailMetricas;
  roasTone: 'ok' | 'bad' | 'neutral';
}) {
  return (
    <div className="criativo-dd-kpis">
      <KpiCell label="Gasto" value={fmtBRL(metricas.spend_cents)} />
      <KpiCell label="Faturamento" value={fmtBRL(metricas.revenue_cents)} />
      <KpiCell
        label="ROAS"
        value={fmtRoas(metricas.roas)}
        tone={roasTone}
      />
      <KpiCell label="Compras" value={fmtNum(metricas.purchases)} />
      <KpiCell label="CPM" value={fmtBRL2(metricas.cpm_cents)} />
      <KpiCell label="CPC" value={fmtBRL2(metricas.cpc_cents)} />
      <KpiCell label="CTR" value={fmtPct(metricas.ctr)} />
      <KpiCell label="Alcance único" value={fmtNum(metricas.alcance_unico)} />
      <KpiCell label="Frequência" value={fmtFreq(metricas.frequencia)} />
      <KpiCell label="View content" value={fmtNum(metricas.view_content)} />
      <KpiCell label="Add to cart" value={fmtNum(metricas.add_to_cart)} />
      <KpiCell label="Initiate ckout" value={fmtNum(metricas.initiate_checkout)} />
    </div>
  );
}

function KpiCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'ok' | 'bad' | 'neutral';
}) {
  return (
    <div className={`criativo-dd-kpi${tone ? ` criativo-dd-kpi--${tone}` : ''}`}>
      <div className="criativo-dd-kpi-label">{label}</div>
      <div className="criativo-dd-kpi-value">{value}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TendenciaChart — SVG inline, barras stacked spend(cinza) + revenue(verde)
// ─────────────────────────────────────────────────────────────────────────────
function TendenciaChart({ data }: { data: TendenciaPonto[] }) {
  if (!data || data.length === 0) {
    return <div className="perf-empty">Sem dados de tendência no período.</div>;
  }

  const W = 720;
  const H = 200;
  const PAD_L = 44;
  const PAD_R = 12;
  const PAD_T = 12;
  const PAD_B = 28;

  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  // Maior valor entre spend e revenue (mostradas lado a lado)
  const maxVal = data.reduce((m, p) => {
    const s = (p.spend_cents || 0) / 100;
    const r = (p.revenue_cents || 0) / 100;
    return Math.max(m, s, r);
  }, 0) || 1;

  const slotW = innerW / data.length;
  const barW = Math.max(4, slotW / 2 - 2);

  const yScale = (v: number) => PAD_T + innerH - (v / maxVal) * innerH;

  // Labels eixo X — primeiro / meio / último
  const xLabelsIdx = data.length <= 7
    ? data.map((_, i) => i)
    : [0, Math.floor(data.length / 2), data.length - 1];

  return (
    <div className="criativo-dd-chart-wrap">
      <div className="criativo-dd-chart-legend">
        <span className="criativo-dd-chart-legend-item">
          <span className="criativo-dd-chart-dot criativo-dd-chart-dot--spend" />
          Gasto
        </span>
        <span className="criativo-dd-chart-legend-item">
          <span className="criativo-dd-chart-dot criativo-dd-chart-dot--rev" />
          Faturamento
        </span>
      </div>
      <svg
        className="criativo-dd-chart"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Tendência de gasto e faturamento"
      >
        {/* Eixo Y - linhas guia */}
        {[0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1={PAD_L}
            x2={W - PAD_R}
            y1={PAD_T + innerH - p * innerH}
            y2={PAD_T + innerH - p * innerH}
            className="criativo-dd-chart-grid"
          />
        ))}

        {/* Labels Y */}
        {[0.5, 1].map((p) => (
          <text
            key={p}
            x={PAD_L - 6}
            y={PAD_T + innerH - p * innerH + 4}
            textAnchor="end"
            className="criativo-dd-chart-axis"
          >
            R$ {Math.round((maxVal * p) / 1000)}k
          </text>
        ))}

        {/* Barras */}
        {data.map((p, i) => {
          const xBase = PAD_L + i * slotW;
          const spend = (p.spend_cents || 0) / 100;
          const rev = (p.revenue_cents || 0) / 100;
          const spendY = yScale(spend);
          const revY = yScale(rev);
          return (
            <g key={p.date}>
              <rect
                x={xBase + 2}
                y={spendY}
                width={barW}
                height={Math.max(0, PAD_T + innerH - spendY)}
                className="criativo-dd-chart-bar criativo-dd-chart-bar--spend"
              />
              <rect
                x={xBase + 2 + barW + 2}
                y={revY}
                width={barW}
                height={Math.max(0, PAD_T + innerH - revY)}
                className="criativo-dd-chart-bar criativo-dd-chart-bar--rev"
              />
            </g>
          );
        })}

        {/* Labels X */}
        {xLabelsIdx.map((i) => {
          const p = data[i];
          if (!p) return null;
          const xBase = PAD_L + i * slotW + slotW / 2;
          const lbl = p.date.length >= 10 ? p.date.slice(5) : p.date; // MM-DD
          return (
            <text
              key={`x-${i}`}
              x={xBase}
              y={H - 8}
              textAnchor="middle"
              className="criativo-dd-chart-axis"
            >
              {lbl}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DemografiaTables — idade×gênero + região
// ─────────────────────────────────────────────────────────────────────────────
function DemografiaTables({ demografia }: { demografia: Demografia }) {
  const idade = demografia.por_idade_genero || [];
  const regiao = demografia.por_regiao || [];
  const maxIdadeSpend = idade.reduce((m, r) => Math.max(m, r.spend_cents || 0), 0) || 1;
  const maxRegiaoSpend = regiao.reduce((m, r) => Math.max(m, r.spend_cents || 0), 0) || 1;

  return (
    <div className="criativo-dd-demo-grid">
      <div className="criativo-dd-demo-block">
        <div className="criativo-dd-demo-title">Por idade × gênero</div>
        {idade.length === 0 ? (
          <div className="perf-empty">Sem dados.</div>
        ) : (
          <table className="criativo-dd-demo-table">
            <thead>
              <tr>
                <th>Faixa</th>
                <th>Gênero</th>
                <th className="num">Gasto</th>
                <th className="num">Compras</th>
              </tr>
            </thead>
            <tbody>
              {idade.map((r, i) => (
                <tr key={`${r.age}-${r.gender}-${i}`}>
                  <td>{r.age}</td>
                  <td>{r.gender}</td>
                  <td className="num">
                    <div className="criativo-dd-demo-bar-wrap">
                      <div
                        className="criativo-dd-demo-bar"
                        style={{ width: `${((r.spend_cents || 0) / maxIdadeSpend) * 100}%` }}
                      />
                      <span>{fmtBRL(r.spend_cents)}</span>
                    </div>
                  </td>
                  <td className="num">{fmtNum(r.purchases)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="criativo-dd-demo-block">
        <div className="criativo-dd-demo-title">Por região</div>
        {regiao.length === 0 ? (
          <div className="perf-empty">Sem dados.</div>
        ) : (
          <table className="criativo-dd-demo-table">
            <thead>
              <tr>
                <th>Região</th>
                <th className="num">Gasto</th>
                <th className="num">Compras</th>
              </tr>
            </thead>
            <tbody>
              {regiao.map((r, i) => (
                <tr key={`${r.region}-${i}`}>
                  <td>{r.region}</td>
                  <td className="num">
                    <div className="criativo-dd-demo-bar-wrap">
                      <div
                        className="criativo-dd-demo-bar"
                        style={{ width: `${((r.spend_cents || 0) / maxRegiaoSpend) * 100}%` }}
                      />
                      <span>{fmtBRL(r.spend_cents)}</span>
                    </div>
                  </td>
                  <td className="num">{fmtNum(r.purchases)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PlacementsList — lista vertical
// ─────────────────────────────────────────────────────────────────────────────
function PlacementsList({ placements }: { placements: PlacementRow[] }) {
  const maxSpend = placements.reduce((m, p) => Math.max(m, p.spend_cents || 0), 0) || 1;
  return (
    <ul className="criativo-dd-placements">
      {placements.map((p, i) => (
        <li key={`${p.placement}-${i}`} className="criativo-dd-placement">
          <div className="criativo-dd-placement-row">
            <span className="criativo-dd-placement-name">{p.placement}</span>
            <span className="criativo-dd-placement-stats">
              {fmtBRL(p.spend_cents)} · {fmtNum(p.impressions)} impressões
            </span>
          </div>
          <div className="criativo-dd-placement-track">
            <div
              className="criativo-dd-placement-fill"
              style={{ width: `${((p.spend_cents || 0) / maxSpend) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
