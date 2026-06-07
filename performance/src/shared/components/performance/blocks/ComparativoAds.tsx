import './ComparativoAds.css';

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
  ads: AdRow[];
  adset_name?: string;
}

const fmtBRL = (cents: number | null) =>
  cents == null ? '—' : 'R$ ' + (cents / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
const fmtRoas = (n: number | null) => (n == null ? '—' : n.toFixed(2) + '×');
const fmtNum = (n: number | null) =>
  n == null ? '—' : Math.round(n).toLocaleString('pt-BR');

const MAX_LABEL = 28;
const truncate = (s: string) =>
  s.length > MAX_LABEL ? s.slice(0, MAX_LABEL - 1) + '…' : s;

type Tone = 'is-good' | 'is-bad' | 'is-mid';
const toneFromRoas = (roas: number | null): Tone => {
  if (roas == null) return 'is-mid';
  if (roas >= 3) return 'is-good';
  if (roas < 1.5) return 'is-bad';
  return 'is-mid';
};

// Conversões = purchases (decisão: usar purchases puro; link_clicks é métrica
// de tráfego, não de conversão). Se purchases for null, cai pra 0 pra ordenar.
const conversoesOf = (ad: AdRow): number => ad.purchases ?? 0;

interface ChartProps {
  label: string;
  rows: Array<{
    ad_id: string;
    name: string;
    value: number;
    display: string;
    tone: Tone;
  }>;
}

function Chart({ label, rows }: ChartProps) {
  const max = rows.reduce((m, r) => (r.value > m ? r.value : m), 0);
  const sorted = [...rows].sort((a, b) => b.value - a.value);

  return (
    <div className="perf-cmp-chart">
      <div className="perf-cmp-chart-label">{label}</div>
      {sorted.map((r) => {
        const pct = max > 0 ? Math.max(2, (r.value / max) * 100) : 0;
        return (
          <div key={r.ad_id} className={`perf-cmp-bar-row ${r.tone}`}>
            <div className="perf-cmp-bar-meta">
              <span className="perf-cmp-label" title={r.name}>
                {truncate(r.name)}
              </span>
              <span className="perf-cmp-value">{r.display}</span>
            </div>
            <div className="perf-cmp-bar" aria-hidden="true">
              <div
                className="perf-cmp-bar-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ComparativoAds({ ads, adset_name }: Props) {
  if (!ads || ads.length < 2) {
    return (
      <div className="perf-cmp-block">
        <div className="perf-cmp-header">
          <div className="perf-cmp-kicker">Comparativo</div>
          <h3 className="perf-cmp-title">Por que comprar quem</h3>
          {adset_name && (
            <div className="perf-cmp-subtitle">{adset_name}</div>
          )}
        </div>
        <div className="perf-cmp-empty">Sem comparativo (1 ad só)</div>
      </div>
    );
  }

  const roasRows = ads.map((a) => ({
    ad_id: a.ad_id,
    name: a.name,
    value: a.roas ?? 0,
    display: fmtRoas(a.roas),
    tone: toneFromRoas(a.roas),
  }));

  const spendRows = ads.map((a) => ({
    ad_id: a.ad_id,
    name: a.name,
    value: a.spend_cents ?? 0,
    display: fmtBRL(a.spend_cents),
    tone: toneFromRoas(a.roas),
  }));

  const convRows = ads.map((a) => ({
    ad_id: a.ad_id,
    name: a.name,
    value: conversoesOf(a),
    display: fmtNum(a.purchases),
    tone: toneFromRoas(a.roas),
  }));

  return (
    <div className="perf-cmp-block">
      <div className="perf-cmp-header">
        <div className="perf-cmp-kicker">Comparativo</div>
        <h3 className="perf-cmp-title">Por que comprar quem</h3>
        {adset_name && (
          <div className="perf-cmp-subtitle">{adset_name}</div>
        )}
      </div>
      <div className="perf-cmp-grid">
        <Chart label="ROAS" rows={roasRows} />
        <Chart label="Gasto" rows={spendRows} />
        <Chart label="Conversões" rows={convRows} />
      </div>
    </div>
  );
}
