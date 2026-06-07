// Passo 3 — Público: idade, gênero, raio, interesses.
import { useEffect, useState } from 'react';
import type { DraftCampanha, Genero } from '../types';
import { TEMPLATES_SOBRAL } from '../templates';
import { Tooltip } from '../Tooltip';
import { tip } from '../tooltips';
import { EstimativaCard } from '../EstimativaCard';

export interface Step3Props {
  draft: DraftCampanha;
  onChange: (patch: Partial<DraftCampanha>) => void;
  apiBase: string;
  slug: string;
}

const GENERO_OPTS: Array<{ key: Genero; label: string }> = [
  { key: 'masculino', label: 'Homens' },
  { key: 'feminino', label: 'Mulheres' },
];

export function Step3Publico({ draft, onChange, apiBase, slug }: Step3Props) {
  const pub = draft.publico || {
    idade_min: 25,
    idade_max: 55,
    generos: ['masculino', 'feminino'] as Genero[],
    raio_km: 5,
    interesses: [],
  };
  const tpl = draft.vertical ? TEMPLATES_SOBRAL[draft.vertical] : null;
  const [novoInteresse, setNovoInteresse] = useState('');

  const update = (patch: Partial<typeof pub>) => {
    onChange({ publico: { ...pub, ...patch } });
  };

  // Garante que o draft tem publico inicial.
  useEffect(() => {
    if (!draft.publico) update({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleGenero = (g: Genero) => {
    const tem = pub.generos.includes(g);
    const next = tem ? pub.generos.filter((x) => x !== g) : [...pub.generos, g];
    if (next.length === 0) return; // sempre 1 gênero mínimo
    update({ generos: next });
  };

  const addInteresse = () => {
    const v = novoInteresse.trim();
    if (!v || pub.interesses.includes(v)) return;
    update({ interesses: [...pub.interesses, v] });
    setNovoInteresse('');
  };

  const removeInteresse = (i: string) => {
    update({ interesses: pub.interesses.filter((x) => x !== i) });
  };

  // Sugestões Sobral baseadas no template
  const sugestoesInteresses = tpl?.audiences.cold.interests || [];

  return (
    <section className="wiz-step wiz-step--publico">
      <header className="wiz-step-head">
        <h2 className="wiz-step-title">Quem vai ver o anúncio?</h2>
        <p className="wiz-step-sub">
          {tpl?.tooltips.publico || 'Defina o público-alvo. Quanto mais específico, melhor.'}
        </p>
      </header>

      <div className="wiz-grid-2col">
        <div className="wiz-grid-main">
          {/* Idade */}
          <div className="wiz-field">
            <label className="wiz-label">
              Idade
              <Tooltip text={tip('idade')} />
            </label>
            <div className="wiz-range-row">
              <div className="wiz-range-pair">
                <label htmlFor="wiz-age-min" className="wiz-range-pair-label">de</label>
                <input
                  id="wiz-age-min"
                  type="number"
                  className="wiz-input wiz-input--num"
                  min={13} max={pub.idade_max - 1}
                  value={pub.idade_min}
                  onChange={(e) => update({ idade_min: Math.max(13, Number(e.target.value)) })}
                />
              </div>
              <div className="wiz-range-pair">
                <label htmlFor="wiz-age-max" className="wiz-range-pair-label">até</label>
                <input
                  id="wiz-age-max"
                  type="number"
                  className="wiz-input wiz-input--num"
                  min={pub.idade_min + 1} max={65}
                  value={pub.idade_max}
                  onChange={(e) => update({ idade_max: Math.min(65, Number(e.target.value)) })}
                />
              </div>
              <span className="wiz-range-text">anos</span>
            </div>
          </div>

          {/* Gênero */}
          <div className="wiz-field">
            <label className="wiz-label">
              Gênero
              <Tooltip text={tip('genero')} />
            </label>
            <div className="wiz-chips" role="group" aria-label="Gênero">
              {GENERO_OPTS.map((opt) => {
                const on = pub.generos.includes(opt.key);
                return (
                  <button
                    key={opt.key}
                    type="button"
                    className={`wiz-chip${on ? ' is-on' : ''}`}
                    onClick={() => toggleGenero(opt.key)}
                    aria-pressed={on}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cidade */}
          <div className="wiz-field">
            <label htmlFor="wiz-cidade" className="wiz-label">Cidade / região</label>
            <input
              id="wiz-cidade"
              type="text"
              className="wiz-input"
              placeholder='Ex: "São Paulo, SP" ou CEP'
              value={pub.cidade || ''}
              onChange={(e) => update({ cidade: e.target.value })}
            />
            <div className="wiz-hint">
              A Fenice valida e geocoda esse endereço antes de publicar.
            </div>
          </div>

          {/* Raio */}
          <div className="wiz-field">
            <label htmlFor="wiz-raio" className="wiz-label">
              Raio de alcance
              <Tooltip text={tip('raio_km')} />
            </label>
            <div className="wiz-slider-row">
              <input
                id="wiz-raio"
                type="range"
                className="wiz-slider"
                min={1} max={tpl?.geo_default.raio_km_max || 50} step={1}
                value={pub.raio_km}
                onChange={(e) => update({ raio_km: Number(e.target.value) })}
              />
              <div className="wiz-slider-val">{pub.raio_km} km</div>
            </div>
            {tpl && (
              <div className="wiz-hint">
                Sobral pra {tpl.nome_exibicao.toLowerCase()}: {tpl.geo_default.raio_km_default} km recomendado.
              </div>
            )}
          </div>

          {/* Interesses */}
          <div className="wiz-field">
            <label htmlFor="wiz-int" className="wiz-label">
              Interesses
              <Tooltip text={tip('interesses')} />
            </label>
            <div className="wiz-tag-input">
              <input
                id="wiz-int"
                type="text"
                className="wiz-input"
                placeholder="Digite e tecle Enter (ex: pizza, gastronomia)"
                value={novoInteresse}
                onChange={(e) => setNovoInteresse(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addInteresse();
                  }
                }}
              />
              <button type="button" className="wiz-btn-secondary" onClick={addInteresse}>
                Adicionar
              </button>
            </div>
            {pub.interesses.length > 0 && (
              <div className="wiz-tags">
                {pub.interesses.map((i) => (
                  <span key={i} className="wiz-tag">
                    {i}
                    <button
                      type="button"
                      className="wiz-tag-remove"
                      onClick={() => removeInteresse(i)}
                      aria-label={`Remover ${i}`}
                    >×</button>
                  </span>
                ))}
              </div>
            )}
            {sugestoesInteresses.length > 0 && (
              <div className="wiz-sugestoes">
                <span className="wiz-sugestoes-label">Sugestões Sobral:</span>
                {sugestoesInteresses
                  .filter((s) => !pub.interesses.includes(s))
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="wiz-sugestao"
                      onClick={() => update({ interesses: [...pub.interesses, s] })}
                    >
                      + {s}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="wiz-grid-aside">
          <EstimativaCard apiBase={apiBase} slug={slug} draft={draft} />
        </div>
      </div>
    </section>
  );
}
