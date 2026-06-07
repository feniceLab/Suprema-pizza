import { useEffect } from 'react';
import type { ClienteTheme } from '../shared/clientes/themes';
import type { RelatorioData, RepCampaign } from './report-data';
import './relatorio.css';

// Geometria fixa do funil (7 estágios) — viewBox 720x370, centro x=360.
const GEO = [
  { poly: '60,10 660,10 620,50 100,50', lx: 50, y: 30, dx: 0, op: 0.35 },
  { poly: '100,55 620,55 580,95 140,95', lx: 90, y: 75, dx: 630, op: 0.45 },
  { poly: '140,100 580,100 555,140 165,140', lx: 130, y: 120, dx: 590, op: 0.55 },
  { poly: '165,145 555,145 530,185 190,185', lx: 155, y: 165, dx: 565, op: 0.65 },
  { poly: '190,190 530,190 500,230 220,230', lx: 180, y: 210, dx: 540, op: 0.75 },
  { poly: '220,235 500,235 470,275 250,275', lx: 210, y: 255, dx: 510, op: 0.85 },
  { poly: '250,280 470,280 440,345 280,345', lx: 245, y: 313, dx: 485, op: 1, final: true },
];

function themeVars(t: ClienteTheme): React.CSSProperties {
  return {
    '--r-bg': t.bg, '--r-card': t.card, '--r-card2': t.card2, '--r-line': t.line,
    '--r-ink': t.ink, '--r-muted': t.muted, '--r-faint': t.faint,
    '--r-accent': t.accent, '--r-accent2': t.accent2,
    '--r-ok': t.ok, '--r-warn': t.warn, '--r-bad': t.bad,
    '--r-font-display': t.fontDisplay, '--r-font-body': t.fontBody,
  } as React.CSSProperties;
}

export interface RelatorioProps {
  data: RelatorioData;
  theme: ClienteTheme;
}

export function Relatorio({ data, theme }: RelatorioProps) {
  // carrega a fonte do cliente (Google Fonts) uma vez
  useEffect(() => {
    if (!theme.googleFonts) return;
    const id = `gf-${data.slug}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = theme.googleFonts;
    document.head.appendChild(link);
  }, [theme.googleFonts, data.slug]);

  return (
    <div className="rep" style={themeVars(theme)}>
      <div className="rep-container">
        {/* HEADER */}
        <header className="rep-header">
          {data.logo ? (
            <img src={data.logo} alt={data.cliente} className="rep-header-logo" />
          ) : (
            <span className="rep-header-brand">{data.cliente}</span>
          )}
          <div className="rep-header-meta">
            <div className="rep-kicker">Fenice Lab</div>
            <div className="rep-header-title">Performance</div>
            <div className="rep-header-sub">Relatório Mensal</div>
          </div>
        </header>

        {/* MONTH BANNER */}
        <div className="rep-month">
          <div className="rep-month-meta">
            <div className="rep-month-label">Período do Relatório</div>
            <div className="rep-month-display">
              <span className="rep-month-name">{data.period.month}</span>
              <span className="rep-month-year">{data.period.year}</span>
            </div>
            <div className="rep-month-range">{data.period.range}</div>
          </div>
          <div className="rep-month-side">
            <div className="rep-month-side-label">Status</div>
            <div className="rep-month-side-value">{data.period.status}</div>
          </div>
        </div>

        {/* TAGLINE */}
        {data.tagline && (
          <div className="rep-tagline">
            <div className="rep-tagline-1">{data.tagline.l1}</div>
            <div className="rep-tagline-2">{data.tagline.l2}</div>
          </div>
        )}

        {/* OPERAÇÃO DA LOJA · POR CANAL */}
        {data.operacao && (
          <section className="rep-section">
            <h2 className="rep-section-title">{data.operacao.title}</h2>
            {data.operacao.desc && <p className="rep-section-desc">{data.operacao.desc}</p>}
            <div className="rep-op-total">
              {data.operacao.total.map((k) => (
                <div className="rep-op-total-item" key={k.label}>
                  <div className="rep-op-total-label">{k.label}</div>
                  <div className={`rep-op-total-value mono${k.accent ? ' accent' : ''}`}>{k.value}</div>
                </div>
              ))}
            </div>
            {data.operacao.proporcao && (
              <div className="rep-op-prop">
                <div className="rep-op-prop-bar">
                  {data.operacao.proporcao.map((p) => (
                    <span
                      key={p.label}
                      className={`rep-op-prop-seg${p.tom ? ' ' + p.tom : ''}`}
                      style={{ width: `${p.pct}%` }}
                      title={`${p.label} ${p.pct}%`}
                    />
                  ))}
                </div>
                <div className="rep-op-prop-legend">
                  {data.operacao.proporcao.map((p) => (
                    <span className="rep-op-prop-leg" key={p.label}>
                      <i className={`rep-op-prop-dot${p.tom ? ' ' + p.tom : ''}`} />
                      {p.label} <b className="mono">{String(p.pct).replace('.', ',')}%</b>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="rep-op-grid">
              {data.operacao.canais.map((canal) => (
                <div className={`rep-op-card${canal.tom ? ' ' + canal.tom : ''}`} key={canal.nome}>
                  <div className="rep-op-card-head">
                    <span className="rep-op-card-name">{canal.nome}</span>
                    <span className="rep-op-card-fat mono">{canal.faturamento}</span>
                  </div>
                  <div className="rep-op-card-sub">
                    {canal.pedidos} pedidos · ticket {canal.ticket}
                    {canal.novos ? ` · ${canal.novos} novos` : ''}
                  </div>
                  <div className="rep-op-modais">
                    {canal.modalidades.map((m) => (
                      <div className="rep-op-modal" key={m.label}>
                        <span className="rep-op-modal-label">{m.label}</span>
                        <span className="rep-op-modal-track">
                          <span className="rep-op-modal-fill" style={{ width: `${m.pct}%` }} />
                        </span>
                        <span className="rep-op-modal-val mono">{m.pedidos ? `${m.pedidos} · ` : ''}{m.valor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {data.operacao.note && <p className="rep-note">{data.operacao.note}</p>}
          </section>
        )}

        {/* FUNIL DO CARDÁPIO DIGITAL · SITE */}
        {data.siteFunnel && (
          <section className="rep-section">
            <h2 className="rep-section-title">{data.siteFunnel.title}</h2>
            {data.siteFunnel.desc && <p className="rep-section-desc">{data.siteFunnel.desc}</p>}
            <div className="rep-sfun">
              {data.siteFunnel.stages.map((s) => (
                <div className={`rep-sfun-step${s.final ? ' final' : ''}`} key={s.label}>
                  <div className="rep-sfun-label">{s.label}</div>
                  <div className="rep-sfun-value mono">{s.value}</div>
                  <div className="rep-sfun-track">
                    <span className="rep-sfun-fill" style={{ width: `${s.pctNum}%` }} />
                  </div>
                  <div className="rep-sfun-pct mono">{s.pct}</div>
                </div>
              ))}
            </div>
            <div className="rep-funnel-foot">
              {data.siteFunnel.foot.map((f, i) => (
                <span key={i}>
                  {i > 0 && <>&nbsp;·&nbsp;</>}
                  {f.text}: <b className={f.accent ? 'accent' : undefined}>{f.value}</b>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* MÍDIA PAGA */}
        <h2 className="rep-section-title" style={{ marginTop: 30 }}>Mídia Paga · Valor de Conversão</h2>

        {/* HERO */}
        <div className="rep-hero">
          <div className="rep-hero-kicker">{data.hero.kicker}</div>
          <div className="rep-hero-amount mono">{data.hero.amount}</div>
          <div className="rep-hero-meta">
            Investido {data.hero.investido} · <strong>ROAS {data.hero.roas}</strong> · {data.hero.compras}
          </div>
          <div className="rep-hero-net">
            <span className="rep-hero-net-label">{data.hero.netLabel}</span>
            <span className="rep-hero-net-amount mono">{data.hero.netAmount}</span>
          </div>
        </div>

        {/* KPIs */}
        <div className="rep-kpis">
          {data.kpis.map((k) => (
            <div className="rep-kpi" key={k.label}>
              <div className="rep-kpi-label">{k.label}</div>
              <div className={`rep-kpi-value mono${k.tone ? ' ' + k.tone : ''}`}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* STATS */}
        <div className="rep-stats">
          {data.stats.map((s) => (
            <div className="rep-stat" key={s.label}>
              <div className="rep-stat-label">{s.label}</div>
              <div className="rep-stat-value mono">{s.value}</div>
              <div className="rep-stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {data.midiaVsAnterior && (
          <div className="rep-vsprev">
            <span className="rep-vsprev-label">vs mês anterior (abril)</span>
            {data.midiaVsAnterior.map((v, i) => (
              <span className="rep-vsprev-item" key={i}>
                {v.text} <b className={v.tone === 'down' ? 'down' : 'up'}>{v.value}</b>
              </span>
            ))}
          </div>
        )}

        {/* FUNIL MÍDIA PAGA */}
        <section className="rep-section">
          <h2 className="rep-section-title">Funil de Conversão · Mídia Paga</h2>
          <div className="rep-funnel-wrap">
            <Funnel data={data} theme={theme} />
            <div className="rep-funnel-foot">
              {data.funnel.foot.map((f, i) => (
                <span key={i}>
                  {i > 0 && <>&nbsp;·&nbsp;</>}
                  {f.text}: <b className={f.accent ? 'accent' : undefined}>{f.value}</b>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÕES DE CAMPANHAS */}
        {data.sections.map((sec) => (
          <section className="rep-section" key={sec.title}>
            <h2 className="rep-section-title">{sec.title}</h2>
            {sec.desc && <p className="rep-section-desc">{sec.desc}</p>}
            <div className="rep-ranking">
              {sec.campaigns.map((c) => (
                <CampaignCard key={c.name + c.pos} c={c} />
              ))}
            </div>
            {sec.subtotal && <div className="rep-subtotal" dangerouslySetInnerHTML={{ __html: sec.subtotal }} />}
          </section>
        ))}

        {/* FOOTER */}
        <footer className="rep-footer">
          <div className="rep-footer-tagline" dangerouslySetInnerHTML={{ __html: data.footer.tagline }} />
          <div className="rep-footer-meta">
            <div className="rep-footer-meta-label">Período</div>
            <div className="mono">{data.footer.period}</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Funnel({ data, theme }: { data: RelatorioData; theme: ClienteTheme }) {
  const stages = data.funnel.stages.slice(0, 7);
  return (
    <svg className="rep-funnel" viewBox="0 0 720 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Funil de Conversão">
      <defs>
        <linearGradient id={`fg-${data.slug}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="55%" stopColor={theme.accent2} />
          <stop offset="100%" stopColor={theme.accent} />
        </linearGradient>
        <linearGradient id={`fgf-${data.slug}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3ec569" />
          <stop offset="100%" stopColor="#15692f" />
        </linearGradient>
        <filter id={`glow-${data.slug}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {stages.map((s, i) => {
        const g = GEO[i];
        if (g.final) {
          return (
            <g key={i}>
              <polygon className="stage-shape" points={g.poly} fill={`url(#fgf-${data.slug})`} stroke="#3ec569" strokeWidth={1.8} filter={`url(#glow-${data.slug})`} />
              <text className="stage-final-label" x={g.lx} y={g.y}>{s.label}</text>
              <text className="stage-final-value" x={360} y={g.y}>{s.value}</text>
              {s.drop && <text className={`stage-drop${s.dropOk ? ' ok' : ''}`} x={g.dx} y={g.y}>{s.drop}</text>}
            </g>
          );
        }
        return (
          <g key={i}>
            <polygon className="stage-shape" points={g.poly} fill={`url(#fg-${data.slug})`} fillOpacity={g.op} />
            <text className="stage-label" x={g.lx} y={g.y}>{s.label}</text>
            <text className="stage-value" x={360} y={g.y}>{s.value}</text>
            {s.drop && <text className={`stage-drop${s.dropOk ? ' ok' : ''}`} x={g.dx} y={g.y}>{s.drop}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function CampaignCard({ c }: { c: RepCampaign }) {
  const toneClass = c.tone === 'champion' ? ' champion' : c.tone === 'warn' ? ' warn' : c.tone === 'bad' ? ' bad' : '';
  return (
    <div className={`rep-rank${toneClass}`}>
      <div className="rep-rank-header">
        <span className="rep-rank-pos">{c.pos}</span>
        <div className="rep-rank-name-wrap">
          <div className="rep-rank-name">{c.name}</div>
          <div className="rep-rank-tag">{c.tag}</div>
        </div>
        <span className="rep-rank-roas mono">{c.roas}</span>
      </div>
      <div className="rep-rank-stats">
        {c.stats.map((s) => (
          <div key={s.label}>
            <div className="rep-rank-stat-label">{s.label}</div>
            <div className="rep-rank-stat-value mono">{s.value}</div>
          </div>
        ))}
      </div>

      {c.adset && (
        <div className="rep-rank-detail">
          <div className="rep-adset-bar">
            <span className="rep-adset-kicker">Conjunto</span>
            <span className="rep-adset-name">{c.adset.name}</span>
            <span className="rep-adset-budget mono">{c.adset.budget}</span>
          </div>
          <div className="rep-adset-metrics">
            {c.adset.metrics.map((m) => (
              <div className="rep-adset-metric" key={m.label}>
                <div className="rep-adset-metric-label">{m.label}</div>
                <div className="rep-adset-metric-value">{m.value}</div>
              </div>
            ))}
          </div>
          {c.adset.ads.length > 0 && (
            <div className="rep-ads">
              <div className="rep-ads-header">{c.adset.adsHeader}</div>
              {c.adset.ads.map((a) => (
                <div className="rep-ad" key={a.pos}>
                  <span className="rep-ad-pos">{a.pos}</span>
                  <span className="rep-ad-name">
                    <span className={`rep-ad-status ${a.status}`}>{a.status === 'active' ? 'Ativo' : 'Pausado'}</span>
                    {a.name}
                  </span>
                  {a.cells.map((cell, ci) => (
                    <span className="rep-ad-metric" key={ci}><b>{cell.value}</b>{cell.label}</span>
                  ))}
                  <span className={`rep-ad-roas mono${a.roasTone ? ' ' + a.roasTone : ''}`}>{a.roas}</span>
                </div>
              ))}
            </div>
          )}
          {c.adset.note && <p className="rep-note">{c.adset.note}</p>}
        </div>
      )}
    </div>
  );
}
