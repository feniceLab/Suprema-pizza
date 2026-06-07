import type { ApiSaldoRow } from '../types';
import { fmtBRL } from '../format';

interface Props {
  saldo: ApiSaldoRow;
  diasCobertura: number | null;
  gastoPeriodoCents: number;
  diasPeriodo: number;
}

export function SaldoCard({ saldo, diasCobertura, gastoPeriodoCents, diasPeriodo }: Props) {
  const gastoDiarioCents = gastoPeriodoCents / Math.max(1, diasPeriodo);
  const isCartao = saldo.funding_tipo === 'cartao';
  const disponivel = saldo.disponivel_cents;
  const sugestao = gastoDiarioCents > 0 ? gastoDiarioCents * 15 : 0;

  let tone: 'ok' | 'aviso' | 'critico' = 'ok';
  if (!isCartao && diasCobertura != null) {
    if (diasCobertura < 3) tone = 'critico';
    else if (diasCobertura < 7) tone = 'aviso';
  }

  return (
    <div className={`perf-saldo perf-saldo--${tone}`}>
      <div className="perf-saldo-head">
        <div className="perf-section-kicker">Saldo & reposição</div>
        <div className="perf-section-title">
          {isCartao ? 'Conta no cartão' :
           disponivel != null ? fmtBRL(disponivel) : 'Saldo indisponível'}
        </div>
      </div>
      <div className="perf-saldo-grid">
        <div>
          <div className="perf-saldo-label">Tipo</div>
          <div className="perf-saldo-val">
            {isCartao ? 'Cartão' :
             saldo.funding_tipo === 'prepago' ? 'Pré-pago' : 'Outro'}
          </div>
          <div className="perf-saldo-detail">{saldo.funding_source_details?.display_string || '—'}</div>
        </div>
        <div>
          <div className="perf-saldo-label">Gasto/dia</div>
          <div className="perf-saldo-val">{fmtBRL(gastoDiarioCents)}</div>
          <div className="perf-saldo-detail">{fmtBRL(gastoPeriodoCents)} no período</div>
        </div>
        <div>
          <div className="perf-saldo-label">Cobertura</div>
          <div className="perf-saldo-val">
            {isCartao ? '∞' :
             diasCobertura != null ? `${diasCobertura.toFixed(1)}d` : '—'}
          </div>
          <div className="perf-saldo-detail">{isCartao ? 'Sem risco' : 'até zerar'}</div>
        </div>
        <div>
          <div className="perf-saldo-label">Repor 15d</div>
          <div className="perf-saldo-val">
            {isCartao ? '—' : sugestao > 0 ? fmtBRL(sugestao) : '—'}
          </div>
          <div className="perf-saldo-detail">sugestão Sobral</div>
        </div>
      </div>
    </div>
  );
}
