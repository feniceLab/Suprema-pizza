// Tooltip educacional inline — hover/focus mostra explicação curta em PT-BR.
import { useState } from 'react';

export interface TooltipProps {
  children?: React.ReactNode;
  text: string;
  /** Aria label do trigger (default: "Saiba mais"). */
  label?: string;
}

export function Tooltip({ text, label = 'Saiba mais', children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  if (!text) return null;

  return (
    <span
      className={`criar-tooltip${open ? ' is-open' : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        className="criar-tooltip-trigger"
        aria-label={label}
        aria-describedby="criar-tooltip-body"
        onClick={(e) => { e.preventDefault(); setOpen((v) => !v); }}
      >
        {children || '?'}
      </button>
      {open && (
        <span role="tooltip" id="criar-tooltip-body" className="criar-tooltip-body">
          {text}
        </span>
      )}
    </span>
  );
}
