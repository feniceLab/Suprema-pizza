// ============================================================
// Hook estimativa Meta — chama GET /api/audience/estimate
// com targeting do draft atual. Debounce de 600ms.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import type { DraftCampanha, EstimativaResposta } from './types';

interface UseEstimativaOptions {
  apiBase: string;
  slug: string;
  draft: DraftCampanha;
  enabled: boolean;
}

export function useEstimativa({ apiBase, slug, draft, enabled }: UseEstimativaOptions): EstimativaResposta {
  const [data, setData] = useState<EstimativaResposta>({
    audience_lower: 0,
    audience_upper: 0,
    cpm_estimado_cents: 0,
    alcance_diario_estimado: 0,
    loading: false,
  });
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!draft.publico) return;

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      setData((d) => ({ ...d, loading: true, error: undefined }));
      try {
        const targeting = {
          age_min: draft.publico?.idade_min,
          age_max: draft.publico?.idade_max,
          generos: draft.publico?.generos,
          raio_km: draft.publico?.raio_km,
          interesses: draft.publico?.interesses,
          budget_diario_cents: draft.budget?.diario_cents,
          cidade: draft.publico?.cidade,
        };
        const url = `${apiBase}/api/audience/estimate?slug=${encodeURIComponent(slug)}&targeting=${encodeURIComponent(
          JSON.stringify(targeting)
        )}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as Partial<EstimativaResposta>;
        setData({
          audience_lower: json.audience_lower || 0,
          audience_upper: json.audience_upper || 0,
          cpm_estimado_cents: json.cpm_estimado_cents || 0,
          alcance_diario_estimado: json.alcance_diario_estimado || 0,
          conversoes_diarias_estimadas: json.conversoes_diarias_estimadas,
          loading: false,
        });
      } catch (err) {
        setData((d) => ({
          ...d,
          loading: false,
          error: (err as Error).message || 'Falha na estimativa',
        }));
      }
    }, 600);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [
    apiBase,
    slug,
    enabled,
    draft.publico?.idade_min,
    draft.publico?.idade_max,
    draft.publico?.generos?.join(','),
    draft.publico?.raio_km,
    draft.publico?.interesses?.join(','),
    draft.publico?.cidade,
    draft.budget?.diario_cents,
  ]);

  return data;
}
