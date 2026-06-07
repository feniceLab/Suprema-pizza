import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { computeSobral, detectarAlertas, type Alerta, type MetricasSobral } from '../../trafego';
import type { ApiClientRow, ApiInsightsResponse, ApiSaldoResponse, ApiSaldoRow, Preset } from './types';
import { PERIODS, calcDiasCobertura, dursDias, pctDelta } from './format';

const REFRESH_MS = 5 * 60 * 1000;

async function fetchInsights(apiBase: string, params: URLSearchParams): Promise<ApiInsightsResponse> {
  const r = await fetch(`${apiBase}/api/insights?${params}`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

async function fetchSaldo(apiBase: string): Promise<ApiSaldoResponse> {
  const r = await fetch(`${apiBase}/api/saldo`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`saldo ${r.status}`);
  return r.json();
}

export interface UsePerformanceDataInput {
  slug: string;
  apiBase: string;
  margem: number;
}

export interface UsePerformanceDataResult {
  period: Preset;
  setPeriod: (p: Preset) => void;
  curr: ApiClientRow | null;
  prev: ApiClientRow | null;
  saldo: ApiSaldoRow | null;
  loading: boolean;
  err: string | null;
  updatedAt: Date | null;
  metricas: MetricasSobral | null;
  deltaRoasPct: number | null;
  diasCobertura: number | null;
  alertas: Alerta[];
  reload: () => void;
}

export function usePerformanceData({ slug, apiBase, margem }: UsePerformanceDataInput): UsePerformanceDataResult {
  const [period, setPeriod] = useState<Preset>('last_month');
  const [curr, setCurr] = useState<ApiClientRow | null>(null);
  const [prev, setPrev] = useState<ApiClientRow | null>(null);
  const [saldo, setSaldo] = useState<ApiSaldoRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const opt = useMemo(() => PERIODS.find((p) => p.preset === period)!, [period]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [a, b, s] = await Promise.all([
        fetchInsights(apiBase, new URLSearchParams({ preset: opt.preset })),
        fetchInsights(apiBase, new URLSearchParams({ since: opt.prevSince(), until: opt.prevUntil() })),
        fetchSaldo(apiBase).catch(() => null),
      ]);
      setCurr(a.clients.find((c) => c.slug === slug) ?? null);
      setPrev(b.clients.find((c) => c.slug === slug) ?? null);
      setSaldo(s?.clients.find((c) => c.slug === slug) ?? null);
      setUpdatedAt(new Date(a.updated_at));
    } catch (e: any) {
      setErr(e?.message || 'falha ao carregar');
    } finally {
      setLoading(false);
    }
  }, [opt, slug, apiBase]);

  useEffect(() => { load(); }, [load]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => load(), REFRESH_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [load]);

  const metricas: MetricasSobral | null = useMemo(() => {
    if (!curr) return null;
    return computeSobral({
      faturamento: (curr.revenue_cents || 0) / 100,
      investido: (curr.spend_cents || 0) / 100,
      pedidos: curr.purchases || 0,
      frequencia: curr.frequency || 0,
      margem,
    });
  }, [curr, margem]);

  const deltaRoasPct = useMemo(() => {
    if (!curr || !prev || !prev.roas) return null;
    return ((curr.roas - prev.roas) / prev.roas) * 100;
  }, [curr, prev]);

  const diasCobertura = useMemo(() => {
    if (!curr || !saldo) return null;
    return calcDiasCobertura(saldo.disponivel_cents, curr.spend_cents || 0, dursDias(period));
  }, [curr, saldo, period]);

  const alertas: Alerta[] = useMemo(() => {
    if (!metricas) return [];
    const gastoDiarioCents = (curr?.spend_cents || 0) / dursDias(period);
    return detectarAlertas({
      metricas,
      deltaRoasPct,
      saldoCents: saldo?.disponivel_cents ?? null,
      gastoDiarioCents,
      addToCart: curr?.add_to_cart ?? null,
      purchases: curr?.purchases ?? null,
    });
  }, [metricas, deltaRoasPct, saldo, curr, period]);

  // suprime warning de pctDelta exportado mas não usado
  void pctDelta;

  return { period, setPeriod, curr, prev, saldo, loading, err, updatedAt, metricas, deltaRoasPct, diasCobertura, alertas, reload: load };
}
