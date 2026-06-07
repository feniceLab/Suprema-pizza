// Passo 6 — Data início + data fim opcional.
import type { DraftCampanha } from '../types';
import { TEMPLATES_SOBRAL } from '../templates';
import { Tooltip } from '../Tooltip';
import { tip } from '../tooltips';
import { GuardrailToast } from '../GuardrailToast';

export interface Step6Props {
  draft: DraftCampanha;
  onChange: (patch: Partial<DraftCampanha>) => void;
}

const hoje = (): string => new Date().toISOString().slice(0, 10);

const diffDias = (ini: string, fim: string): number => {
  const a = new Date(ini).getTime();
  const b = new Date(fim).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
};

export function Step6Periodo({ draft, onChange }: Step6Props) {
  const tpl = draft.vertical ? TEMPLATES_SOBRAL[draft.vertical] : null;
  const duracaoMin = tpl?.duracao_minima_dias || 7;
  const per = draft.periodo || { data_inicio: hoje(), data_fim: undefined };

  const update = (patch: Partial<typeof per>) => {
    onChange({ periodo: { ...per, ...patch } });
  };

  const duracao = per.data_fim ? diffDias(per.data_inicio, per.data_fim) : null;
  const curto = duracao !== null && duracao < duracaoMin;

  return (
    <section className="wiz-step wiz-step--periodo">
      <header className="wiz-step-head">
        <h2 className="wiz-step-title">
          Quando o anúncio roda?
          <Tooltip text={tip('periodo')} />
        </h2>
        <p className="wiz-step-sub">
          {tpl?.tooltips.periodo || `Mínimo Sobral: ${duracaoMin} dias contínuos.`}
        </p>
      </header>

      <div className="wiz-field-row">
        <div className="wiz-field">
          <label htmlFor="wiz-ini" className="wiz-label">
            Data de início
            <Tooltip text={tip('data_inicio')} />
          </label>
          <input
            id="wiz-ini"
            type="date"
            className="wiz-input"
            min={hoje()}
            value={per.data_inicio}
            onChange={(e) => update({ data_inicio: e.target.value })}
          />
        </div>

        <div className="wiz-field">
          <label htmlFor="wiz-fim" className="wiz-label">
            Data de fim (opcional)
            <Tooltip text={tip('data_fim')} />
          </label>
          <input
            id="wiz-fim"
            type="date"
            className="wiz-input"
            min={per.data_inicio}
            value={per.data_fim || ''}
            onChange={(e) => update({ data_fim: e.target.value || undefined })}
          />
          <div className="wiz-hint">Vazio = roda até você pausar.</div>
        </div>
      </div>

      {duracao !== null && (
        <div className="wiz-periodo-info">
          <strong>{duracao} {duracao === 1 ? 'dia' : 'dias'}</strong> de duração programada.
        </div>
      )}

      {curto && (
        <GuardrailToast
          severidade="aviso"
          titulo={`Sobral recomenda mínimo ${duracaoMin} dias`}
          detalhe={`Adset com menos de ${duracaoMin} dias não estabiliza — Meta paga mais caro durante learning phase e você corta antes de aprender.`}
        />
      )}
    </section>
  );
}
