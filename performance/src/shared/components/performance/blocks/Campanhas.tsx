import { useEffect, useMemo, useState } from 'react';
import { SkeletonTable } from './Skeletons';
import { CampanhaDrillDown } from './CampanhaDrillDown';
import { AuditLog } from './AuditLog';
import { nivelRoas } from '../../../trafego';

interface CampaignRow {
  campaign_id: string;
  name: string;
  status: string | null;
  effective_status: string | null;
  objective: string | null;
  daily_budget_cents: number | null;
  lifetime_budget_cents: number | null;
  start_time: string | null;
  stop_time: string | null;
  spend_cents: number | null;
  revenue_cents: number | null;
  purchases: number | null;
  roas: number | null;
  impressions: number | null;
  reach: number | null;
  frequency: number | null;
  clicks: number | null;
  ctr: number | null;
  cpc: number | null;
  cpa_cents: number | null;
}

interface Sugestao {
  acao: 'ESCALAR' | 'PAUSAR' | 'RENOVAR' | 'OBSERVAR';
  campaign: string;
  motivo: string;
}

const API_BASE = (import.meta as any).env?.VITE_TRAFEGO_URL || '';

const fmtBRL = (cents: number | null) =>
  cents == null ? '—' : 'R$ ' + (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtRoas = (n: number | null) => (n == null ? '—' : n.toFixed(2) + '×');

interface Props {
  slug: string;
  preset?: string;
  since?: string;
  until?: string;
  margemCliente: number;
  /** RBAC — se false, esconde botões de pausar/reativar. Default: true. */
  canPause?: boolean;
  /** RBAC — se false, esconde botões de budget_up (+20%). Default: true. */
  canEscalate?: boolean;
  /** Identificador do usuário pra audit log (email ou nome). */
  actor?: string;
}

type ActionKind = 'pause' | 'resume' | 'budget_up';

interface PendingAction {
  campaign_id: string;
  name: string;
  action: ActionKind;
}

export function Campanhas({
  slug, preset, since, until, margemCliente,
  canPause = true, canEscalate = true, actor,
}: Props) {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: 'ok' | 'bad'; msg: string } | null>(null);
  const [confirming, setConfirming] = useState<PendingAction | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [drillCampaign, setDrillCampaign] = useState<{ id: string; name: string } | null>(null);

  const showToast = (kind: 'ok' | 'bad', msg: string) => {
    setToast({ kind, msg });
    window.setTimeout(() => setToast(null), 4500);
  };

  const doAction = async (campaign_id: string, action: ActionKind) => {
    setActionLoading(campaign_id + ':' + action);
    try {
      const r = await fetch(`${API_BASE}/api/campaign/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, campaign_id, action, actor }),
      });
      const j = await r.json();
      if (j.ok) {
        showToast('ok', action === 'pause' ? 'Campanha pausada' :
          action === 'resume' ? 'Campanha reativada' : 'Budget +20% aplicado');
        setReloadKey((k) => k + 1);
      } else {
        showToast('bad', j.error || 'Falha');
      }
    } catch (e: any) {
      showToast('bad', e?.message || 'Erro de rede');
    } finally {
      setActionLoading(null);
      setConfirming(null);
    }
  };

  useEffect(() => {
    setLoading(true);
    setErr(null);
    const params = new URLSearchParams({ slug });
    if (since && until) { params.set('since', since); params.set('until', until); }
    else if (preset) params.set('preset', preset);
    fetch(`${API_BASE}/api/campaigns?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErr(d.error);
        else setCampaigns(d.campaigns || []);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [slug, preset, since, until, reloadKey]);

  const sugestoes: Sugestao[] = useMemo(() => {
    if (campaigns.length === 0) return [];
    const roasMin = 1 / margemCliente;
    const out: Sugestao[] = [];
    const ativas = campaigns.filter((c) => c.effective_status === 'ACTIVE');

    // Top ativas com ROAS folgado → ESCALAR
    ativas
      .filter((c) => (c.roas || 0) >= roasMin * 1.8) // >1.8x break-even
      .slice(0, 3)
      .forEach((c) => {
        out.push({
          acao: 'ESCALAR',
          campaign: c.name,
          motivo: `ROAS ${fmtRoas(c.roas)} (break-even ${roasMin.toFixed(1)}×) — folga pra +20% de budget`,
        });
      });

    // Ativas com ROAS ruim → PAUSAR
    ativas
      .filter((c) => (c.roas || 0) > 0 && (c.roas || 0) < roasMin)
      .forEach((c) => {
        out.push({
          acao: 'PAUSAR',
          campaign: c.name,
          motivo: `ROAS ${fmtRoas(c.roas)} abaixo do break-even (${roasMin.toFixed(1)}×) — está queimando dinheiro`,
        });
      });

    // Frequência alta → RENOVAR criativo
    ativas
      .filter((c) => (c.frequency || 0) > 4)
      .forEach((c) => {
        out.push({
          acao: 'RENOVAR',
          campaign: c.name,
          motivo: `Frequência ${c.frequency?.toFixed(2)} — público vendo demais, renovar criativo`,
        });
      });

    // ATC=0 com gasto alto = problema
    ativas
      .filter((c) => (c.purchases || 0) === 0 && (c.spend_cents || 0) > 5000)
      .forEach((c) => {
        out.push({
          acao: 'OBSERVAR',
          campaign: c.name,
          motivo: `${fmtBRL(c.spend_cents)} gasto sem conversão — verificar pixel ou pausar`,
        });
      });

    return out.slice(0, 10);
  }, [campaigns, margemCliente]);

  if (loading) return <SkeletonTable rows={5} />;
  if (err) return <div className="perf-empty">Campanhas indisponíveis: {err}</div>;
  if (campaigns.length === 0) return null;

  return (
    <>
      {/* BLOCO 10 · SUGESTÕES SOBRAL */}
      {sugestoes.length > 0 && (
        <div className="perf-block perf-sugestoes">
          <div className="perf-block-head">
            <div>
              <div className="perf-section-kicker">Recomendações Sobral</div>
              <div className="perf-section-title">O que fazer agora</div>
            </div>
          </div>
          <div className="perf-sugestoes-list">
            {sugestoes.map((s, i) => (
              <div key={i} className={`perf-sugestao perf-sugestao--${s.acao.toLowerCase()}`}>
                <span className="perf-sugestao-acao">{s.acao}</span>
                <div className="perf-sugestao-body">
                  <div className="perf-sugestao-camp">{s.campaign}</div>
                  <div className="perf-sugestao-motivo">{s.motivo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOCO 5 · TABELA DE CAMPANHAS */}
      <div className="perf-block perf-campanhas">
        <div className="perf-block-head">
          <div>
            <div className="perf-section-kicker">Campanhas</div>
            <div className="perf-section-title">Por ROAS (Pareto)</div>
          </div>
          <div className="perf-block-meta">{campaigns.length} campanhas</div>
        </div>
        <div className="perf-campanhas-table">
          <div className="perf-camp-row perf-camp-row--head">
            <div>Nome</div>
            <div className="ta-c">Status</div>
            <div className="ta-r">Gasto</div>
            <div className="ta-r">CPA</div>
            <div className="ta-r">Freq</div>
            <div className="ta-r">ROAS</div>
            <div className="ta-c">Ações</div>
          </div>
          {campaigns.map((c) => {
            const tone = c.roas != null ? nivelRoas(c.roas) : 'amarelo';
            const isActive = c.effective_status === 'ACTIVE';
            const isPaused = c.effective_status === 'PAUSED';
            return (
              <div
                key={c.campaign_id}
                className={`perf-camp-row perf-camp-row--clickable perf-camp-tone-${tone}`}
                onClick={(e) => {
                  // Não abrir drill se clicou nos botões de ação
                  if ((e.target as HTMLElement).closest('.perf-camp-actions')) return;
                  setDrillCampaign({ id: c.campaign_id, name: c.name });
                }}
                role="button"
                tabIndex={0}
              >
                <div className="perf-camp-name" title={c.name}>{c.name}</div>
                <div className="ta-c">
                  <span className={`perf-camp-status perf-camp-status--${(c.effective_status || 'OFF').toLowerCase()}`}>
                    {isActive ? '● ATIVA' : isPaused ? '○ pausada' : c.effective_status || '—'}
                  </span>
                </div>
                <div className="ta-r mono">{fmtBRL(c.spend_cents)}</div>
                <div className="ta-r mono">{fmtBRL(c.cpa_cents)}</div>
                <div className="ta-r mono">{c.frequency != null ? c.frequency.toFixed(2) : '—'}</div>
                <div className="ta-r mono perf-camp-roas">{fmtRoas(c.roas)}</div>
                <div className="perf-camp-actions">
                  {isActive && (
                    <>
                      {canPause && (
                        <button
                          type="button"
                          className="perf-act-btn perf-act-btn--pause"
                          title="Pausar"
                          disabled={actionLoading != null}
                          onClick={() => setConfirming({ campaign_id: c.campaign_id, name: c.name, action: 'pause' })}
                        >
                          {actionLoading === c.campaign_id + ':pause' ? '…' : '⏸'}
                        </button>
                      )}
                      {canEscalate && c.daily_budget_cents != null && (
                        <button
                          type="button"
                          className="perf-act-btn perf-act-btn--up"
                          title="Aumentar budget +20%"
                          disabled={actionLoading != null}
                          onClick={() => setConfirming({ campaign_id: c.campaign_id, name: c.name, action: 'budget_up' })}
                        >
                          {actionLoading === c.campaign_id + ':budget_up' ? '…' : '+20%'}
                        </button>
                      )}
                    </>
                  )}
                  {isPaused && canPause && (
                    <button
                      type="button"
                      className="perf-act-btn perf-act-btn--resume"
                      title="Reativar"
                      disabled={actionLoading != null}
                      onClick={() => setConfirming({ campaign_id: c.campaign_id, name: c.name, action: 'resume' })}
                    >
                      {actionLoading === c.campaign_id + ':resume' ? '…' : '▶'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AUDIT LOG — histórico de pausas/reativações/budgets desse cliente */}
      <AuditLog slug={slug} limit={20} />

      {/* DRILL-DOWN — modal com adsets+ads da campanha clicada */}
      {drillCampaign && (
        <CampanhaDrillDown
          slug={slug}
          preset={preset}
          campaign_id={drillCampaign.id}
          campaign_name={drillCampaign.name}
          onClose={() => setDrillCampaign(null)}
          actor={actor}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div className={`perf-toast perf-toast--${toast.kind}`} role="status">
          <span>{toast.kind === 'ok' ? '✓' : '⚠'}</span>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* CONFIRMAÇÃO modal */}
      {confirming && (
        <div className="perf-modal-overlay" onClick={() => setConfirming(null)}>
          <div className="perf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="perf-modal-title">
              {confirming.action === 'pause' ? 'Pausar campanha?' :
               confirming.action === 'resume' ? 'Reativar campanha?' :
               'Aumentar budget +20%?'}
            </div>
            <div className="perf-modal-body">
              <strong>{confirming.name}</strong><br />
              Essa ação afeta a campanha <em>real</em> no Meta Ads Manager.
            </div>
            <div className="perf-modal-actions">
              <button
                type="button"
                className="perf-modal-btn perf-modal-btn--cancel"
                onClick={() => setConfirming(null)}
                disabled={actionLoading != null}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`perf-modal-btn perf-modal-btn--${confirming.action === 'pause' ? 'danger' : 'primary'}`}
                onClick={() => doAction(confirming.campaign_id, confirming.action)}
                disabled={actionLoading != null}
              >
                {actionLoading != null ? 'Aplicando…' :
                 confirming.action === 'pause' ? 'Pausar' :
                 confirming.action === 'resume' ? 'Reativar' : 'Aplicar +20%'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
