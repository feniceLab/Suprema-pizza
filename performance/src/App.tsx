import { useEffect, useState } from 'react';
import { clienteBySlug } from './shared/clientes/fenice';
import { themeBySlug } from './shared/clientes/themes';
import { supabase } from './shared/lib/supabase';
import { RelatorioLive } from './relatorio/RelatorioLive';
import { REPORTS } from './relatorio/report-data';

// Sub-app autossuficiente da Suprema: SÓ o war room de Performance em modo embed,
// tela cheia, sem DeviceFrame e sem as telas mockadas do portal.
// Servido do próprio subdomínio (supremapizza.fenicelab.com.br/performance/dist/).
const SLUG = 'suprema';

interface PerfAuth {
  authId?: string;
  email?: string;
  role?: 'admin_fenice' | 'cliente';
  loading: boolean;
}

// Sessão Supabase (se houver). No iframe cross-origin pode não haver sessão
// (storage partitioning) — nesse caso o war room funciona normal, só sem o
// botão "Criar campanha" (podeCriar = !!authId no WarRoomShell).
function useAuth(): PerfAuth {
  const [auth, setAuth] = useState<PerfAuth>({ loading: true });
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;
        if (!user) {
          if (alive) setAuth({ loading: false });
          return;
        }
        let role: 'admin_fenice' | 'cliente' | undefined;
        try {
          const { data: row } = await supabase
            .from('usuarios')
            .select('role, papel')
            .eq('auth_id', user.id)
            .maybeSingle();
          const raw = ((row as any)?.role ?? (row as any)?.papel ?? '').toLowerCase();
          if (raw.includes('admin') || raw === 'fenice' || raw === 'agencia') role = 'admin_fenice';
          else if (raw) role = 'cliente';
        } catch {
          /* ignore */
        }
        if (alive) setAuth({ authId: user.id, email: user.email ?? undefined, role, loading: false });
      } catch {
        if (alive) setAuth({ loading: false });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  return auth;
}

export function App() {
  const cliente = clienteBySlug(SLUG);
  const report = REPORTS[SLUG];
  const theme = themeBySlug(SLUG, cliente?.cor || '#B23A2E');
  const auth = useAuth();
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'auto', background: theme.bg }}>
      <RelatorioLive
        slug={SLUG}
        clienteNome={cliente?.nome || SLUG}
        logo={report?.logo || null}
        theme={theme}
        userRole={auth.role}
        userEmail={auth.email}
        userAuthId={auth.authId}
      />
    </div>
  );
}
