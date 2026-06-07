// ============================================================
// Performance war room — barrel export.
// Consumido pelo portal cliente e pelo painel admin.
// ============================================================

export { WarRoomShell } from './WarRoomShell';
export type { WarRoomShellProps } from './WarRoomShell';

export type {
  Preset, PeriodOption, ApiClientRow, ApiInsightsResponse,
  ApiSaldoRow, ApiSaldoResponse, TabKey, TabDef,
} from './types';

export { PERIODS, dursDias, fmtBRL, fmtBRL0, fmtNum, fmtRoas, fmtPct, pctDelta, ageString, calcDiasCobertura, timeUntilRefresh } from './format';
export { usePerformanceData } from './usePerformanceData';
export type { UsePerformanceDataInput, UsePerformanceDataResult } from './usePerformanceData';

export { HeroLucro } from './blocks/HeroLucro';
export { AlertasList } from './blocks/AlertasList';
export { FunilConversao } from './blocks/FunilConversao';
export { SaldoCard } from './blocks/SaldoCard';
export { KpiGrid } from './blocks/KpiGrid';
export { Tendencia } from './blocks/Tendencia';
export { Campanhas } from './blocks/Campanhas';
export { Criativos } from './blocks/Criativos';
export { CriativoDrillDown } from './blocks/CriativoDrillDown';
export type { CriativoDrillDownProps } from './blocks/CriativoDrillDown';
export { Breakdowns } from './blocks/Breakdowns';
export { ComparativoMensal } from './blocks/ComparativoMensal';
export { ComparativoAds } from './blocks/ComparativoAds';
export { AuditLog } from './blocks/AuditLog';
export { FavoritoStar } from './blocks/FavoritoStar';
export { FavoritosCriativos } from './blocks/FavoritosCriativos';
export { useFavoritos } from './useFavoritos';
export type { UseFavoritosResult } from './useFavoritos';
export {
  useEntityActions,
  ConfirmModal,
  ToastView,
  EntityActionButton,
} from './blocks/EntityActions';
export type {
  EntityType,
  EntityAction,
  PendingConfirm,
  ToastState,
} from './blocks/EntityActions';
