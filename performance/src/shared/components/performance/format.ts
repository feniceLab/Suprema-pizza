// ============================================================
// Helpers de formatação numérica e período — performance war room.
// ============================================================

import type { PeriodOption, Preset } from './types';

const fmtDate = (d: Date): string => d.toISOString().slice(0, 10);
const daysAgo = (n: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};
const monthStart = (offset: number): Date => {
  const d = new Date();
  d.setMonth(d.getMonth() + offset, 1);
  return d;
};
const monthEnd = (offset: number): Date => {
  const d = new Date();
  d.setMonth(d.getMonth() + offset + 1, 0);
  return d;
};

export const PERIODS: PeriodOption[] = [
  {
    preset: 'this_month',
    label: 'Este mês',
    prevSince: () => fmtDate(monthStart(-1)),
    prevUntil: () => fmtDate(monthEnd(-1)),
  },
  {
    preset: 'last_month',
    label: 'Mês passado',
    prevSince: () => fmtDate(monthStart(-2)),
    prevUntil: () => fmtDate(monthEnd(-2)),
  },
  {
    preset: 'last_7d',
    label: '7 dias',
    prevSince: () => fmtDate(daysAgo(14)),
    prevUntil: () => fmtDate(daysAgo(8)),
  },
  {
    preset: 'last_30d',
    label: '30 dias',
    prevSince: () => fmtDate(daysAgo(60)),
    prevUntil: () => fmtDate(daysAgo(31)),
  },
];

export const dursDias = (preset: Preset): number => {
  if (preset === 'last_7d') return 7;
  if (preset === 'last_30d') return 30;
  return 30;
};

export const fmtBRL = (cents: number): string =>
  'R$ ' + (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtBRL0 = (cents: number): string =>
  'R$ ' + Math.round(cents / 100).toLocaleString('pt-BR');
export const fmtNum = (n: number): string => Math.round(n).toLocaleString('pt-BR');
export const fmtRoas = (n: number): string => n.toFixed(2) + '×';
export const fmtPct = (n: number): string => n.toFixed(2) + '%';

export function pctDelta(curr: number, prev: number): number | null {
  if (!isFinite(prev) || prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}

export function ageString(date: Date | null): string {
  if (!date) return '—';
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return 'agora';
  if (s < 3600) return `há ${Math.floor(s / 60)} min`;
  return `há ${Math.floor(s / 3600)}h`;
}

/** Countdown até o próximo refresh automático. Retorna string tipo "4:23" ou "agora". */
export function timeUntilRefresh(updatedAt: Date | null, refreshMs: number): string {
  if (!updatedAt) return '—';
  const elapsed = Date.now() - updatedAt.getTime();
  const remaining = Math.max(0, refreshMs - elapsed);
  if (remaining < 1000) return 'agora';
  const totalSec = Math.floor(remaining / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m > 0) return `${m}:${s.toString().padStart(2, '0')}`;
  return `${s}s`;
}

export function calcDiasCobertura(saldoCents: number | null, gastoTotalCents: number, diasPeriodo: number): number | null {
  if (saldoCents == null || diasPeriodo <= 0) return null;
  const gastoDiario = gastoTotalCents / diasPeriodo;
  if (gastoDiario <= 0) return null;
  return saldoCents / gastoDiario;
}
