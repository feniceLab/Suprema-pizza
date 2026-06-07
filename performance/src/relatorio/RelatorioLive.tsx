import { WarRoomShell } from '../shared/components/performance';
import type { ClienteTheme } from '../shared/clientes/themes';

export interface RelatorioLiveProps {
  slug: string;
  clienteNome: string;
  logo: string | null;
  theme: ClienteTheme;
  /** RBAC — repassado quando o cliente está logado (habilita Criar campanha). */
  userRole?: 'admin_fenice' | 'cliente';
  userEmail?: string;
  userAuthId?: string;
}

/**
 * Wrapper do war room compartilhado (shared/components/performance).
 * Surface = portal (cliente final). Painel admin usa o mesmo WarRoomShell
 * com surface='painel' direto em apps/painel/screens/Performance.tsx.
 */
export function RelatorioLive(props: RelatorioLiveProps) {
  return <WarRoomShell {...props} surface="portal" />;
}
