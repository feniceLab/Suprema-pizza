import type { ApiClientRow } from '../types';
import { fmtNum } from '../format';

export function FunilConversao({ c }: { c: ApiClientRow }) {
  const estagios = [
    { label: 'Impressões', value: c.impressions || 0 },
    { label: 'Alcance', value: c.reach || 0 },
    { label: 'Cliques no link', value: c.link_clicks || 0 },
    { label: 'Add to cart', value: c.add_to_cart || 0 },
    { label: 'Iniciou checkout', value: c.initiate_checkout || 0 },
    { label: 'Compras', value: c.purchases || 0 },
  ];
  const topo = estagios[0].value || 1;
  let gargalo = -1;
  let menorPct = Infinity;
  for (let i = 1; i < estagios.length; i++) {
    const prev = estagios[i - 1].value;
    const cur = estagios[i].value;
    if (prev > 0 && cur > 0) {
      const p = cur / prev;
      if (p < menorPct) { menorPct = p; gargalo = i; }
    }
  }

  return (
    <div className="perf-funil">
      <div className="perf-block-head">
        <div>
          <div className="perf-section-kicker">Funil de conversão</div>
          <div className="perf-section-title">Por onde o dinheiro vaza</div>
        </div>
      </div>
      <div className="perf-funil-body">
        {estagios.map((s, i) => {
          const totalPct = (s.value / topo) * 100;
          const prevValue = i > 0 ? estagios[i - 1].value : null;
          const stepPct = prevValue && prevValue > 0 ? (s.value / prevValue) * 100 : null;
          const isGargalo = i === gargalo;
          return (
            <div key={s.label} className={`perf-funil-row${isGargalo ? ' is-gargalo' : ''}`}>
              <div className="perf-funil-label">
                {s.label}
                {isGargalo && <span className="perf-funil-gargalo-tag">gargalo</span>}
              </div>
              <div className="perf-funil-bar">
                <div className="perf-funil-fill" style={{ width: `${Math.max(2, totalPct)}%` }} />
              </div>
              <div className="perf-funil-value">{fmtNum(s.value)}</div>
              <div className="perf-funil-pct">{stepPct != null ? `${stepPct.toFixed(1)}%` : '—'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
