// Validação de cada step. Devolve {valido, erros, avisos}.
import type { DraftCampanha, ValidacaoResultado, WizardStepKey } from './types';

const ok = (): ValidacaoResultado => ({ valido: true, erros: [], avisos: [] });

export function validateStep(step: WizardStepKey, draft: DraftCampanha): ValidacaoResultado {
  const erros: string[] = [];
  const avisos: string[] = [];

  switch (step) {
    case 'objetivo':
      if (!draft.objetivo) erros.push('Escolha um objetivo.');
      break;

    case 'template':
      if (!draft.vertical) erros.push('Escolha o tipo do negócio.');
      if (!draft.nome_campanha?.trim()) erros.push('Dê um nome pra campanha.');
      break;

    case 'publico': {
      const p = draft.publico;
      if (!p) {
        erros.push('Defina o público.');
        break;
      }
      if (p.idade_min < 13) erros.push('Idade mínima deve ser 13+.');
      if (p.idade_max < p.idade_min) erros.push('Idade máxima deve ser maior que mínima.');
      if (p.generos.length === 0) erros.push('Escolha ao menos um gênero.');
      if (p.raio_km <= 0) erros.push('Defina o raio de alcance.');
      if (!p.cidade?.trim()) erros.push('Indique a cidade ou região.');
      break;
    }

    case 'mensagem': {
      const m = draft.mensagem;
      if (!draft.criativo?.image_hash && !draft.criativo?.video_id && !draft.criativo?.preview_url) {
        erros.push('Suba uma imagem ou vídeo.');
      }
      if (!m?.titulo?.trim()) erros.push('Escreva o título.');
      if (!m?.descricao?.trim()) erros.push('Escreva a descrição.');
      if (!m?.cta) erros.push('Escolha um botão de ação.');
      break;
    }

    case 'orcamento':
      if (!draft.budget || draft.budget.diario_cents < 3000) {
        avisos.push('Sobral recomenda mínimo R$30/dia. Você pode prosseguir mesmo assim.');
      }
      if (!draft.budget) erros.push('Defina o orçamento diário.');
      break;

    case 'periodo': {
      if (!draft.periodo?.data_inicio) {
        erros.push('Escolha a data de início.');
        break;
      }
      const ini = new Date(draft.periodo.data_inicio + 'T00:00:00');
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      if (ini < hoje) erros.push('Data de início não pode ser no passado.');
      if (draft.periodo.data_fim) {
        const fim = new Date(draft.periodo.data_fim + 'T00:00:00');
        if (fim <= ini) erros.push('Data fim deve ser depois de início.');
      }
      break;
    }

    case 'revisao':
      // sempre passa
      break;

    case 'aprovacao':
      // sempre passa (botão lida)
      break;
  }

  return { valido: erros.length === 0, erros, avisos };
}

export function getValidSteps(draft: DraftCampanha): Set<WizardStepKey> {
  const set = new Set<WizardStepKey>();
  const steps: WizardStepKey[] = ['objetivo', 'template', 'publico', 'mensagem', 'orcamento', 'periodo', 'revisao'];
  for (const s of steps) {
    if (validateStep(s, draft).valido) set.add(s);
    else break;
  }
  return set;
}

export const _internal = { ok };
