import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ClienteTheme } from '../../clientes/themes';
import { margemDoCliente } from '../../trafego';
import type { TabKey, TabDef } from './types';
import { PERIODS, dursDias, ageString, timeUntilRefresh } from './format';
import { WizardModal } from '../criar/WizardModal';
import type { VerticalKey } from '../criar/templates';

const REFRESH_MS = 5 * 60 * 1000;

/** Vertical Sobral por slug (default delivery — maioria dos clientes Fenice é restaurante). */
const VERTICAL_POR_SLUG: Record<string, VerticalKey> = {
  arena: 'delivery',
  suprema: 'delivery',
  oca: 'delivery',
  imperio: 'delivery',
  cotafacil: 'servicos',
};
const verticalDoSlug = (slug: string): VerticalKey => VERTICAL_POR_SLUG[slug] || 'delivery';

import { usePerformanceData } from './usePerformanceData';
import { HeroLucro } from './blocks/HeroLucro';
import { AlertasList } from './blocks/AlertasList';
import { FunilConversao } from './blocks/FunilConversao';
import { SaldoCard } from './blocks/SaldoCard';
import { KpiGrid } from './blocks/KpiGrid';
import { Tendencia } from './blocks/Tendencia';
import { Campanhas } from './blocks/Campanhas';
import { Criativos } from './blocks/Criativos';
import { Breakdowns } from './blocks/Breakdowns';
import { ComparativoMensal } from './blocks/ComparativoMensal';
import { FavoritosCriativos } from './blocks/FavoritosCriativos';
import './performance.css';

const TABS: TabDef[] = [
  { key: 'resumo', label: 'Resumo' },
  { key: 'campanhas', label: 'Campanhas' },
  { key: 'criativos', label: 'Criativos' },
  { key: 'demografia', label: 'Demografia' },
  { key: 'favoritos', label: '★ Favoritos' },
];

export interface WarRoomShellProps {
  slug: string;
  clienteNome: string;
  logo?: string | null;
  theme: ClienteTheme;
  /** Surface ativa — afeta hash, classes e título do header. */
  surface?: 'portal' | 'painel';
  /** Margem operacional (0-1). Default = margemDoCliente(slug). */
  margem?: number;
  /** Base da API. Default = VITE_TRAFEGO_URL ou '' (same-domain). */
  apiBase?: string;
  /**
   * Role do usuário logado (RBAC).
   *  - 'admin_fenice' → pode pausar e escalar (budget_up/budget_down).
   *  - 'cliente'      → pode pausar SÓ; sem escalada.
   *  - undefined      → comportamento legado (tudo liberado, ex: portal sem auth).
   */
  userRole?: 'admin_fenice' | 'cliente';
  /** Identificador do usuário (email ou nome de exibição) pra audit log. */
  userEmail?: string;
  /** auth.users.id — habilita o botão "Criar campanha" embedded (RBAC backend). */
  userAuthId?: string;
}

/**
 * War room de Performance — Hero + tabs (Resumo/Campanhas/Criativos/Demografia)
 * em grid 12 colunas responsivo. Mesma surface no portal cliente e no painel admin.
 */
export function WarRoomShell({
  slug, clienteNome, logo = null, theme, surface = 'portal',
  margem, apiBase, userRole, userEmail, userAuthId,
}: WarRoomShellProps) {
  const apiBaseResolved = apiBase ?? ((import.meta as any).env?.VITE_TRAFEGO_URL || '');
  const margemCliente = margem ?? margemDoCliente(slug);
  // RBAC: se userRole não foi passado, mantém comportamento legado (tudo true).
  const canPause = userRole === undefined ? true : userRole === 'admin_fenice' || userRole === 'cliente';
  const canEscalate = userRole === undefined ? true : userRole === 'admin_fenice';
  // Criar campanha embedded — só habilita se temos auth_id (senão backend rejeita).
  const podeCriar = !!userAuthId;
  const [criarOpen, setCriarOpen] = useState(false);
  const [criarMotivacao, setCriarMotivacao] = useState<string | undefined>(undefined);
  const abrirCriar = useCallback((motivacao?: string) => {
    setCriarMotivacao(motivacao);
    setCriarOpen(true);
  }, []);
  const [tab, setTab] = useState<TabKey>(() => {
    const h = (typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : '') as TabKey;
    return TABS.some((t) => t.key === h) ? h : 'resumo';
  });

  useEffect(() => {
    if (surface === 'portal' && typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  }, [tab, surface]);

  const data = usePerformanceData({ slug, apiBase: apiBaseResolved, margem: margemCliente });
  const opt = useMemo(() => PERIODS.find((p) => p.preset === data.period)!, [data.period]);

  // Carrega Google Fonts do cliente (uma vez)
  useEffect(() => {
    if (!theme.googleFonts) return;
    const id = `perf-gf-${slug}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id; link.rel = 'stylesheet'; link.href = theme.googleFonts;
    document.head.appendChild(link);
  }, [theme.googleFonts, slug]);

  // Tick visual do countdown (a cada 1s pra animar contagem regressiva)
  const [, force] = useState(0);
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const themeVars: React.CSSProperties = {
    ['--p-bg' as any]: theme.bg,
    ['--p-card' as any]: theme.card,
    ['--p-card2' as any]: theme.card2,
    ['--p-line' as any]: theme.line,
    ['--p-ink' as any]: theme.ink,
    ['--p-muted' as any]: theme.muted,
    ['--p-faint' as any]: theme.faint,
    ['--p-accent' as any]: theme.accent,
    ['--p-accent2' as any]: theme.accent2,
    ['--p-ok' as any]: theme.ok,
    ['--p-warn' as any]: theme.warn,
    ['--p-bad' as any]: theme.bad,
    ['--p-font-display' as any]: theme.fontDisplay,
    ['--p-font-body' as any]: theme.fontBody,
    // Compat com .rep-* (Tendencia/Campanhas/Criativos/Breakdowns/Comp ainda usam vars --r-*)
    ['--r-bg' as any]: theme.bg,
    ['--r-card' as any]: theme.card,
    ['--r-card2' as any]: theme.card2,
    ['--r-line' as any]: theme.line,
    ['--r-ink' as any]: theme.ink,
    ['--r-muted' as any]: theme.muted,
    ['--r-faint' as any]: theme.faint,
    ['--r-accent' as any]: theme.accent,
    ['--r-accent2' as any]: theme.accent2,
    ['--r-ok' as any]: theme.ok,
    ['--r-warn' as any]: theme.warn,
    ['--r-bad' as any]: theme.bad,
    ['--r-font-display' as any]: theme.fontDisplay,
    ['--r-font-body' as any]: theme.fontBody,
  };

  return (
    <div className={`perf perf--${surface}`} style={themeVars}>
      {/* HEADER */}
      <header className="perf-header">
        <div className="perf-header-brand">
          {logo ? (
            <img src={logo} alt={clienteNome} className="perf-header-logo" />
          ) : (
            <span className="perf-header-name">{clienteNome}</span>
          )}
          <div>
            <div className="perf-header-kicker">Fenice Lab</div>
            <div className="perf-header-title">Performance · ao vivo</div>
          </div>
        </div>
        <div className="perf-header-live">
          <span className={`perf-live-dot${data.loading ? ' is-loading' : ''}`} aria-hidden />
          <span className="perf-live-text">
            {data.err ? (
              <>⚠ {data.err}</>
            ) : data.loading ? (
              'atualizando…'
            ) : (
              <>
                <span className="perf-live-main">dado vivo · {ageString(data.updatedAt)}</span>
                <span className="perf-live-next">próx em {timeUntilRefresh(data.updatedAt, REFRESH_MS)}</span>
              </>
            )}
          </span>
        </div>
      </header>

      {/* TOOLBAR — Tabs + Período + Print */}
      <div className="perf-toolbar perf-no-print">
        <div className="perf-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={t.key === tab}
              className={`perf-tab${t.key === tab ? ' is-on' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="perf-toolbar-right">
          <div className="perf-period" role="tablist" aria-label="Período">
            {PERIODS.map((p) => (
              <button
                key={p.preset}
                type="button"
                role="tab"
                aria-selected={p.preset === data.period}
                className={`perf-period-btn${p.preset === data.period ? ' is-on' : ''}`}
                onClick={() => data.setPeriod(p.preset)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="perf-icon-btn"
            onClick={data.reload}
            disabled={data.loading}
            aria-label="Atualizar"
            title="Atualizar agora"
          >
            {data.loading ? '…' : '↻'}
          </button>
          <button
            type="button"
            className="perf-icon-btn"
            onClick={() => typeof window !== 'undefined' && window.print()}
            aria-label="Imprimir"
            title="Imprimir / PDF"
          >
            🖨
          </button>
        </div>
      </div>

      {/* CONTEÚDO (key={tab} força remount + animação enter) */}
      <div className="perf-content" key={tab}>
        {tab === 'resumo' && (
          <ResumoLayout
            data={data}
            slug={slug}
            margemCliente={margemCliente}
            periodoLabel={opt.label}
            onCriar={podeCriar ? abrirCriar : undefined}
          />
        )}
        {tab === 'campanhas' && (
          <div className="perf-tab-content">
            {podeCriar && (
              <div className="perf-campanhas-bar perf-no-print">
                <button type="button" className="perf-criar-btn" onClick={() => abrirCriar()}>
                  <span aria-hidden>＋</span> Nova campanha
                </button>
              </div>
            )}
            <Campanhas
              slug={slug}
              preset={opt.preset}
              margemCliente={margemCliente}
              canPause={canPause}
              canEscalate={canEscalate}
              actor={userEmail}
            />
            <ComparativoMensal slug={slug} margemCliente={margemCliente} monthsBack={6} />
          </div>
        )}
        {tab === 'criativos' && (
          <div className="perf-tab-content">
            <Criativos slug={slug} preset={opt.preset} actor={userEmail} authId={userAuthId} />
          </div>
        )}
        {tab === 'demografia' && (
          <div className="perf-tab-content">
            <Breakdowns slug={slug} preset={opt.preset} />
          </div>
        )}
        {tab === 'favoritos' && (
          <div className="perf-tab-content">
            <FavoritosCriativos slug={slug} preset={opt.preset} authId={userAuthId} />
          </div>
        )}
      </div>

      <div className="perf-footer-note perf-no-print">
        Δ vs período anterior · Refresh 5 min · Margem operacional {(margemCliente * 100).toFixed(0)}% (config Sobral) · Dados Meta Graph v23
      </div>

      {podeCriar && (
        <WizardModal
          open={criarOpen}
          slug={slug}
          apiBase={apiBaseResolved}
          prefillVertical={verticalDoSlug(slug)}
          prefillMotivacao={criarMotivacao}
          userRole={userRole}
          userEmail={userEmail}
          userAuthId={userAuthId}
          onClose={() => setCriarOpen(false)}
          onSubmitted={() => { data.reload(); }}
        />
      )}
    </div>
  );
}

/** Layout da tab Resumo: grid 12 col responsivo. */
function ResumoLayout({
  data, slug, margemCliente, periodoLabel, onCriar,
}: {
  data: ReturnType<typeof usePerformanceData>;
  slug: string;
  margemCliente: number;
  periodoLabel: string;
  onCriar?: (motivacao?: string) => void;
}) {
  const { curr, prev, saldo, metricas, diasCobertura, alertas, period } = data;
  if (!metricas || !curr) {
    return <div className="perf-empty">Sem dados pra esse período.</div>;
  }

  return (
    <div className="perf-grid">
      {/* Linha 1 · Hero (8) + Alertas (4) */}
      <section className="perf-grid-hero">
        <HeroLucro metricas={metricas} curr={curr} periodoLabel={periodoLabel} onCriar={onCriar} />
      </section>
      <aside className="perf-grid-alerts">
        <AlertasList alertas={alertas} onCriar={onCriar} />
      </aside>

      {/* Linha 2 · KPIs (8) + Saldo (4) */}
      <section className="perf-grid-kpis">
        <KpiGrid curr={curr} prev={prev} />
      </section>
      <aside className="perf-grid-saldo">
        {saldo ? (
          <SaldoCard
            saldo={saldo}
            diasCobertura={diasCobertura}
            gastoPeriodoCents={curr.spend_cents || 0}
            diasPeriodo={dursDias(period)}
          />
        ) : (
          <div className="perf-saldo perf-saldo--ok">
            <div className="perf-saldo-head">
              <div className="perf-section-kicker">Saldo</div>
              <div className="perf-section-title">Indisponível</div>
            </div>
          </div>
        )}
      </aside>

      {/* Linha 3 · Tendência (8) + Funil (4) */}
      <section className="perf-grid-tendencia">
        <Tendencia slug={slug} preset={period} margemCliente={margemCliente} />
      </section>
      <aside className="perf-grid-funil">
        <FunilConversao c={curr} />
      </aside>
    </div>
  );
}
