// ============================================================
// Tipos do Wizard de Criação de Campanhas.
// State machine, payload do draft, integrações com API.
// ============================================================

import type { VerticalKey } from './templates';

export type WizardStepKey =
  | 'objetivo'
  | 'template'
  | 'publico'
  | 'mensagem'
  | 'orcamento'
  | 'periodo'
  | 'revisao'
  | 'aprovacao';

export const STEP_ORDER: WizardStepKey[] = [
  'objetivo',
  'template',
  'publico',
  'mensagem',
  'orcamento',
  'periodo',
  'revisao',
  'aprovacao',
];

export const STEP_LABELS: Record<WizardStepKey, string> = {
  objetivo: 'Objetivo',
  template: 'Template',
  publico: 'Público',
  mensagem: 'Mensagem',
  orcamento: 'Orçamento',
  periodo: 'Período',
  revisao: 'Revisão',
  aprovacao: 'Aprovação',
};

export type ObjetivoKey = 'vendas' | 'mensagens' | 'marca';

export interface ObjetivoOption {
  key: ObjetivoKey;
  label: string;
  descricao: string;
  meta_objetivo: 'OUTCOME_SALES' | 'OUTCOME_LEADS' | 'OUTCOME_AWARENESS';
}

export const OBJETIVOS: ObjetivoOption[] = [
  {
    key: 'vendas',
    label: 'Vendas',
    descricao: 'Quero que o cliente compre, peça pelo site ou app, faça uma transação.',
    meta_objetivo: 'OUTCOME_SALES',
  },
  {
    key: 'mensagens',
    label: 'Mensagens / Leads',
    descricao: 'Quero que o cliente mande WhatsApp, preencha um formulário ou deixe contato.',
    meta_objetivo: 'OUTCOME_LEADS',
  },
  {
    key: 'marca',
    label: 'Marca / Awareness',
    descricao: 'Quero que mais gente conheça minha marca. Sem foco em venda imediata.',
    meta_objetivo: 'OUTCOME_AWARENESS',
  },
];

export type Genero = 'masculino' | 'feminino';

export interface CriativoUpload {
  tipo: 'image' | 'video';
  image_hash?: string;
  video_id?: string;
  preview_url?: string;
  filename?: string;
}

export interface DraftCampanha {
  /** id do draft no backend (se já salvo) */
  id?: string;
  slug: string;
  /** id do usuário/admin que está criando */
  criado_por?: string;
  /** status no fluxo de aprovação */
  status?: 'rascunho' | 'aguardando_aprovacao' | 'aprovada' | 'rejeitada' | 'publicada';

  // Step 1
  objetivo?: ObjetivoKey;

  // Step 2
  vertical?: VerticalKey;
  nome_campanha?: string;

  // Step 3
  publico?: {
    idade_min: number;
    idade_max: number;
    generos: Genero[];
    raio_km: number;
    cidade?: string;
    cep?: string;
    lat?: number;
    lng?: number;
    interesses: string[];
  };

  // Step 4
  criativo?: CriativoUpload;
  mensagem?: {
    titulo: string;
    descricao: string;
    corpo?: string;
    cta: string;
    url_destino?: string;
  };

  // Step 5
  budget?: {
    diario_cents: number;
    tipo: 'diario' | 'total';
  };

  // Step 6
  periodo?: {
    data_inicio: string; // ISO yyyy-mm-dd
    data_fim?: string;
  };

  // Audit
  rejeicao_motivo?: string;
  aprovado_por?: string;
  aprovado_em?: string;
  submitted_at?: string;
  updated_at?: string;
}

export interface EstimativaResposta {
  audience_lower: number;
  audience_upper: number;
  cpm_estimado_cents: number;
  alcance_diario_estimado: number;
  conversoes_diarias_estimadas?: number;
  loading?: boolean;
  error?: string;
}

export interface ValidacaoResultado {
  valido: boolean;
  erros: string[];
  avisos: string[];
}

export interface DraftSaveStatus {
  saving: boolean;
  saved_at: Date | null;
  error: string | null;
}
