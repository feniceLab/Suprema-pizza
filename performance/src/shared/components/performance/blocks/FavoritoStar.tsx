// ============================================================
// FavoritoStar — botão estrela reutilizável.
// Toggle de favorito persistido via useFavoritos(slug).
// ============================================================

import type { MouseEvent } from 'react';
import { useFavoritos } from '../useFavoritos';

interface Props {
  slug: string;
  adId: string;
  /** Tamanho do ícone (px). Default 18. */
  size?: number;
  /** Classe extra (ex: 'is-overlay' pra estrela sobre thumbnail). */
  className?: string;
  /** auth.users.id — quando presente, favoritos persistem no Supabase. */
  authId?: string;
}

const STYLES_ID = 'fenice-perf-fav-btn-styles';
const STYLES_CSS = `
.perf-fav-btn {
  background: rgba(0,0,0,.5);
  border: 1px solid var(--p-line, rgba(255,255,255,.15));
  color: var(--p-warn);
  cursor: pointer;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: transform 0.12s, background 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.perf-fav-btn:hover { transform: scale(1.08); }
.perf-fav-btn.is-on { background: color-mix(in srgb, var(--p-warn) 18%, transparent); color: var(--p-warn); }
.perf-fav-btn.is-overlay { position: absolute; top: 8px; left: 8px; z-index: 2; }
`;

function ensureStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLES_ID)) return;
  const style = document.createElement('style');
  style.id = STYLES_ID;
  style.textContent = STYLES_CSS;
  document.head.appendChild(style);
}

export function FavoritoStar({ slug, adId, size = 18, className, authId }: Props) {
  if (typeof document !== 'undefined') ensureStyles();

  const { isFav, toggleFav } = useFavoritos(slug, authId);
  const active = isFav(adId);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFav(adId);
  };

  const label = active ? 'Remover dos favoritos' : 'Favoritar criativo';
  const classes = ['perf-fav-btn', active ? 'is-on' : '', className || '']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={handleClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      style={{ fontSize: size }}
    >
      {active ? '★' : '☆'}
    </button>
  );
}
