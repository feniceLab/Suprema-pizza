// Wizard de criação de campanhas — barril de exports.
export { Wizard } from './Wizard';
export type { WizardProps } from './Wizard';
export { WizardShell } from './WizardShell';
export type { WizardShellProps } from './WizardShell';
export { WizardModal } from './WizardModal';
export type { WizardModalProps } from './WizardModal';

export { ProgressBar } from './ProgressBar';
export { EstimativaCard } from './EstimativaCard';
export { GuardrailToast } from './GuardrailToast';
export { Tooltip } from './Tooltip';
export { CreativeUpload } from './CreativeUpload';

export { useDraft } from './useDraft';
export { useEstimativa } from './useEstimativa';

export { validateStep, getValidSteps } from './validate';
export { TOOLTIPS, tip } from './tooltips';

// Templates Sobral já são re-exportados via shared/index.ts.
// Re-export aqui pra quem importa direto de '@fenice/shared/components/criar'.
export {
  TEMPLATES_SOBRAL,
  VERTICAL_KEYS,
  pickTemplate,
  getTooltips,
  TOOLTIPS_GERAL,
  validateBudget,
  suggestDuration,
} from './templates';
export type {
  VerticalKey,
  TemplateSobral,
  AudienceSpec,
  CreativeSpec,
  SobralTooltips,
  ObjetivoMeta,
  OptimizationGoal,
  CTAType,
} from './templates';

export {
  STEP_ORDER,
  STEP_LABELS,
  OBJETIVOS,
} from './types';
export type {
  WizardStepKey,
  ObjetivoKey,
  ObjetivoOption,
  Genero,
  CriativoUpload,
  DraftCampanha,
  EstimativaResposta,
  ValidacaoResultado,
  DraftSaveStatus,
} from './types';

// CSS (consumidores precisam importar em algum lugar)
import './criar.css';
