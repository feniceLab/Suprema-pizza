import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env ?? {};
const url: string = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const anon: string = env.VITE_SUPABASE_ANON_KEY || 'public-anon-placeholder';

/** Cliente Supabase. Usa placeholder se o env não estiver presente (não quebra o app). */
export const supabase: SupabaseClient = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
export async function signOut() { await supabase.auth.signOut(); }

export async function meuPapel(): Promise<string | null> {
  const { data } = await supabase.from('usuarios').select('papel').limit(1).maybeSingle();
  return (data as { papel?: string } | null)?.papel ?? null;
}
