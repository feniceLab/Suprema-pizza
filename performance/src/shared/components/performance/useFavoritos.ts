// ============================================================
// useFavoritos — hook de favoritos de criativos.
//
// Dois modos:
//   • COM authId  → persiste em Supabase (tabela favoritos_criativos),
//                    isolado por usuário via RLS (auth.uid() = auth_id).
//   • SEM authId  → fallback localStorage (chave fenice.perf.favoritos.<slug>),
//                    mantém compat com quem ainda não passa o authId.
//
// Atualização otimista: a UI muda na hora; a escrita no Supabase roda em
// background e, se falhar, reverte o estado local.
//
// SSR safe.
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

const storageKey = (slug: string) => `fenice.perf.favoritos.${slug}`;

function readStorage(slug: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === 'string');
    }
    return [];
  } catch {
    return [];
  }
}

function writeStorage(slug: string, list: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(slug), JSON.stringify(list));
  } catch {
    // quota / acesso negado — silenciamos pra não quebrar a UI
  }
}

export interface UseFavoritosResult {
  favoritos: string[];
  isFav: (adId: string) => boolean;
  toggleFav: (adId: string) => void;
  clearFavs: () => void;
}

/**
 * useFavoritos
 * @param slug   cliente atual
 * @param authId (opcional) id do usuário autenticado (auth.users.id). Se presente,
 *               persiste no Supabase por usuário; senão, cai no localStorage.
 */
export function useFavoritos(slug: string, authId?: string): UseFavoritosResult {
  const useRemote = !!authId;
  const [favoritos, setFavoritos] = useState<string[]>(() =>
    useRemote ? [] : readStorage(slug)
  );

  // Guarda o último estado bom pra reverter em falha otimista (modo remoto).
  const lastGoodRef = useRef<string[]>(favoritos);

  // ── Modo localStorage ────────────────────────────────────────────────
  // Resync quando troca o slug (cliente diferente)
  useEffect(() => {
    if (useRemote) return;
    setFavoritos(readStorage(slug));
  }, [slug, useRemote]);

  // Persistir toda mudança (só local)
  useEffect(() => {
    if (useRemote) return;
    writeStorage(slug, favoritos);
  }, [slug, favoritos, useRemote]);

  // ── Modo Supabase ────────────────────────────────────────────────────
  // Carrega a lista do servidor ao montar / trocar slug ou usuário.
  useEffect(() => {
    if (!useRemote) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('favoritos_criativos')
        .select('ad_id')
        .eq('auth_id', authId)
        .eq('slug', slug);
      if (cancelled) return;
      if (error) {
        // Falhou ler do servidor — não quebra a UI, fica vazio.
        // eslint-disable-next-line no-console
        console.warn('[useFavoritos] load remoto falhou:', error.message);
        return;
      }
      const list = (data ?? [])
        .map((r) => (r as { ad_id?: unknown }).ad_id)
        .filter((x): x is string => typeof x === 'string');
      lastGoodRef.current = list;
      setFavoritos(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, authId, useRemote]);

  const isFav = useCallback(
    (adId: string) => favoritos.includes(adId),
    [favoritos]
  );

  const toggleFav = useCallback(
    (adId: string) => {
      if (!useRemote) {
        setFavoritos((prev) =>
          prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
        );
        return;
      }

      // Otimista: atualiza UI na hora, sincroniza em background.
      const wasFav = favoritos.includes(adId);
      const optimistic = wasFav
        ? favoritos.filter((id) => id !== adId)
        : [...favoritos, adId];
      const previous = favoritos;
      setFavoritos(optimistic);
      lastGoodRef.current = optimistic;

      (async () => {
        try {
          if (wasFav) {
            const { error } = await supabase
              .from('favoritos_criativos')
              .delete()
              .eq('auth_id', authId)
              .eq('slug', slug)
              .eq('ad_id', adId);
            if (error) throw error;
          } else {
            const { error } = await supabase
              .from('favoritos_criativos')
              .insert({ auth_id: authId, slug, ad_id: adId });
            // ignora violação de unique (23505) — já estava favoritado
            if (error && (error as { code?: string }).code !== '23505') throw error;
          }
        } catch (e) {
          // Reverte em falha.
          // eslint-disable-next-line no-console
          console.warn('[useFavoritos] toggle remoto falhou, revertendo:', e);
          setFavoritos(previous);
          lastGoodRef.current = previous;
        }
      })();
    },
    [favoritos, slug, authId, useRemote]
  );

  const clearFavs = useCallback(() => {
    if (!useRemote) {
      setFavoritos([]);
      return;
    }
    const previous = favoritos;
    setFavoritos([]);
    lastGoodRef.current = [];
    (async () => {
      const { error } = await supabase
        .from('favoritos_criativos')
        .delete()
        .eq('auth_id', authId)
        .eq('slug', slug);
      if (error) {
        // eslint-disable-next-line no-console
        console.warn('[useFavoritos] clear remoto falhou, revertendo:', error.message);
        setFavoritos(previous);
        lastGoodRef.current = previous;
      }
    })();
  }, [favoritos, slug, authId, useRemote]);

  return { favoritos, isFav, toggleFav, clearFavs };
}
