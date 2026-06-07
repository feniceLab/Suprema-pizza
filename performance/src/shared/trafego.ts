// ============================================================
// Lógica de tráfego pago — Pedro Sobral + Alex Hormozi (delivery BR).
// Fonte da verdade compartilhada entre Painel e Portal.
// Snapshot original em apps/painel/src/dashboard/data.ts;
// extraído pra cá pra reuso em apps/portal/relatorio/RelatorioLive.
// ============================================================

export type Nivel = 'verde' | 'amarelo' | 'vermelho';
export type Decisao = 'SCALE' | 'HOLD' | 'KILL';

export interface MetricasSobral {
  /** Faturamento bruto Meta (revenue purchase). */
  faturamento: number;
  /** Investido em ads. */
  investido: number;
  /** Nº de compras. */
  pedidos: number;
  frequencia: number;
  /** Margem de contribuição (0-1). Default 0.30 se não informado. */
  margem: number;
  /** Ticket médio = faturamento / pedidos. */
  ticket: number;
  /** Custo por aquisição = investido / pedidos. */
  cpa: number;
  /** % que o CPA representa do ticket. */
  cpaPctTicket: number;
  /** ROAS observado = faturamento / investido. */
  roas: number;
  /** Break-even CPA: ticket × margem. Acima disso é prejuízo. */
  beCpa: number;
  /** Contribuição por pedido após custos = ticket × margem - CPA. */
  contribPedido: number;
  /** Lucro pós-ads do período = faturamento × margem − investido. */
  lucroPosAds: number;
  /** Margem de segurança = (beCpa - cpa) / beCpa. Quanto o CPA pode subir até zerar lucro. */
  margemSegCpa: number;
  /** ROAS mínimo pra empatar = 1 / margem. */
  roasMin: number;
  /** Semáforo composto da operação. */
  semaforo: Nivel;
  /** Decisão recomendada. */
  decisao: Decisao;
}

/** Thresholds Sobral pra delivery BR. */
export const nivelRoas = (r: number): Nivel => (r < 3 ? 'vermelho' : r <= 5 ? 'amarelo' : 'verde');
export const nivelFreq = (f: number): Nivel => (f > 5 ? 'vermelho' : f >= 3.5 ? 'amarelo' : 'verde');
export const nivelCpaPct = (p: number): Nivel => (p > 30 ? 'vermelho' : p >= 15 ? 'amarelo' : 'verde');

/** Semáforo composto hierárquico (ROAS manda; freq antecipa o próximo problema). */
function semaforoComposto(roas: Nivel, freq: Nivel, cpa: Nivel): Nivel {
  if (roas === 'vermelho') return 'vermelho';
  if (roas === 'verde') return freq === 'vermelho' ? 'amarelo' : 'verde';
  return cpa === 'vermelho' ? 'vermelho' : 'amarelo';
}

const decisaoPorSeg = (seg: number): Decisao => (seg >= 0.5 ? 'SCALE' : seg >= 0.2 ? 'HOLD' : 'KILL');

export interface ComputeInput {
  faturamento: number;
  investido: number;
  pedidos: number;
  frequencia?: number;
  /** Margem de contribuição (0-1). Default 0.30. */
  margem?: number;
}

/** Calcula métricas Sobral. Tudo 0 se input zerado. */
export function computeSobral(input: ComputeInput): MetricasSobral {
  const fat = input.faturamento || 0;
  const inv = input.investido || 0;
  const ped = input.pedidos || 0;
  const freq = input.frequencia || 0;
  const mg = input.margem ?? 0.30;

  const ticket = ped > 0 ? fat / ped : 0;
  const cpa = ped > 0 ? inv / ped : 0;
  const cpaPctTicket = ticket > 0 ? (cpa / ticket) * 100 : 0;
  const roas = inv > 0 ? fat / inv : 0;
  const beCpa = ticket * mg;
  const contribPedido = ticket * mg - cpa;
  const lucroPosAds = fat * mg - inv;
  const margemSegCpa = beCpa > 0 ? (beCpa - cpa) / beCpa : 0;
  const roasMin = mg > 0 ? 1 / mg : 0;

  const semaforo = semaforoComposto(nivelRoas(roas), nivelFreq(freq), nivelCpaPct(cpaPctTicket));
  const decisao = decisaoPorSeg(margemSegCpa);

  return {
    faturamento: fat, investido: inv, pedidos: ped, frequencia: freq, margem: mg,
    ticket, cpa, cpaPctTicket, roas, beCpa, contribPedido,
    lucroPosAds, margemSegCpa, roasMin,
    semaforo, decisao,
  };
}

// ============================================================
// Margens por cliente (override). Default 0.30 se não definido.
// ============================================================
export const MARGEM_POR_SLUG: Record<string, number> = {
  suprema: 0.35,
  arena: 0.33,
  // oca, cotafacil, imperio: usar default 0.30 até confirmar com cliente
};

export const margemDoCliente = (slug: string): number => MARGEM_POR_SLUG[slug] ?? 0.30;

// ============================================================
// Detectores de alertas operacionais
// ============================================================

export type AlertaSeveridade = 'critico' | 'aviso' | 'info';

export interface Alerta {
  severidade: AlertaSeveridade;
  titulo: string;
  detalhe: string;
}

export interface AlertaInput {
  metricas: MetricasSobral;
  /** Δ % do ROAS vs período anterior (positivo = subiu). */
  deltaRoasPct?: number | null;
  /** Saldo disponível em centavos (se pré-pago). null = cartão/sem dado. */
  saldoCents?: number | null;
  /** Gasto médio diário em centavos. */
  gastoDiarioCents?: number | null;
  /** Add-to-cart total no período. */
  addToCart?: number | null;
  /** Compras totais no período. */
  purchases?: number | null;
}

export function detectarAlertas(i: AlertaInput): Alerta[] {
  const a: Alerta[] = [];
  const { metricas, deltaRoasPct, saldoCents, gastoDiarioCents, addToCart, purchases } = i;

  // 1. Saldo crítico (< 7 dias de cobertura)
  if (saldoCents != null && gastoDiarioCents != null && gastoDiarioCents > 0) {
    const diasCobertura = saldoCents / gastoDiarioCents;
    if (diasCobertura < 3) {
      a.push({ severidade: 'critico', titulo: 'Saldo crítico',
        detalhe: `Apenas ${diasCobertura.toFixed(1)} dias de cobertura — repor antes que pause.` });
    } else if (diasCobertura < 7) {
      a.push({ severidade: 'aviso', titulo: 'Saldo baixo',
        detalhe: `${diasCobertura.toFixed(1)} dias de cobertura — programar reposição.` });
    }
  }

  // 2. Frequência saturando
  if (metricas.frequencia > 5) {
    a.push({ severidade: 'critico', titulo: 'Público saturado',
      detalhe: `Freq ${metricas.frequencia.toFixed(2)} — mesma pessoa vendo demais. Renovar criativo AGORA.` });
  } else if (metricas.frequencia >= 3.5) {
    a.push({ severidade: 'aviso', titulo: 'Público saturando',
      detalhe: `Freq ${metricas.frequencia.toFixed(2)} — preparar próximo criativo.` });
  }

  // 3. ROAS caindo
  if (deltaRoasPct != null && deltaRoasPct < -15) {
    a.push({ severidade: 'critico', titulo: 'ROAS caindo forte',
      detalhe: `${deltaRoasPct.toFixed(1)}% vs período anterior — investigar criativo + público.` });
  } else if (deltaRoasPct != null && deltaRoasPct < -8) {
    a.push({ severidade: 'aviso', titulo: 'ROAS em queda',
      detalhe: `${deltaRoasPct.toFixed(1)}% vs anterior — monitorar.` });
  }

  // 4. Pixel suspeito: ATC sem purchase
  if (addToCart != null && purchases != null && addToCart > 10 && purchases === 0) {
    a.push({ severidade: 'critico', titulo: 'Pixel suspeito',
      detalhe: `${addToCart} adições ao carrinho e ZERO purchase rastreada — checar evento Purchase.` });
  }

  // 5. CPA alto demais
  if (metricas.cpaPctTicket > 30) {
    a.push({ severidade: 'aviso', titulo: 'CPA alto',
      detalhe: `CPA ${metricas.cpaPctTicket.toFixed(0)}% do ticket — alvo Sobral: <30%.` });
  }

  // 6. Decisão KILL
  if (metricas.decisao === 'KILL' && metricas.pedidos > 0) {
    a.push({ severidade: 'critico', titulo: 'Operação no vermelho',
      detalhe: `Margem de segurança ${(metricas.margemSegCpa * 100).toFixed(0)}% — corrigir antes de escalar.` });
  }

  return a;
}
