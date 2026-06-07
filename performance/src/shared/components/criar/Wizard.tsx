// ============================================================
// Wizard — state machine + auto-save + step rendering.
// Sem libs de form: state local + useDraft pra persistência.
// ============================================================

import { useCallback, useMemo, useState } from 'react';
import { STEP_ORDER, type DraftCampanha, type WizardStepKey } from './types';
import { Step1Objetivo } from './steps/Step1Objetivo';
import { Step2Template } from './steps/Step2Template';
import { Step3Publico } from './steps/Step3Publico';
import { Step4Mensagem } from './steps/Step4Mensagem';
import { Step5Orcamento } from './steps/Step5Orcamento';
import { Step6Periodo } from './steps/Step6Periodo';
import { Step7Revisao } from './steps/Step7Revisao';
import { Step8Aprovacao } from './steps/Step8Aprovacao';
import { useDraft } from './useDraft';
import { validateStep, getValidSteps } from './validate';
import { WizardShell } from './WizardShell';

export interface WizardProps {
  slug: string;
  apiBase: string;
  initialDraftId?: string;
  initial?: DraftCampanha;
  userRole?: 'admin_fenice' | 'cliente';
  userEmail?: string;
  /** auth.users.id (RBAC backend). Obrigatório pra salvar/submeter. */
  userAuthId?: string;
  /** Voltar pra lista/tela anterior. */
  onClose?: () => void;
  /** Callback após aprovar+publicar (só admin). */
  onApproveAndPublish?: (draftId: string) => Promise<{ ok: boolean; error?: string }>;
}

export function Wizard({
  slug,
  apiBase,
  initialDraftId,
  initial,
  userRole,
  userEmail,
  userAuthId,
  onClose,
  onApproveAndPublish,
}: WizardProps) {
  const initialDraft = useMemo<DraftCampanha>(
    () => initial || { slug, criado_por: userEmail || undefined, status: 'rascunho' },
    [initial, slug, userEmail]
  );

  const { draft, setDraft, status, save, submit } = useDraft({
    apiBase,
    slug,
    initialDraftId,
    initial: initialDraft,
    actorAuthId: userAuthId,
    actorEmail: userEmail,
  });

  const [step, setStep] = useState<WizardStepKey>('objetivo');
  const [showErrors, setShowErrors] = useState(false);

  const validation = validateStep(step, draft);
  const validSteps = getValidSteps(draft);

  const stepIndex = STEP_ORDER.indexOf(step);
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEP_ORDER.length - 1;

  const patch = useCallback(
    (patch: Partial<DraftCampanha>) => {
      setDraft((d) => ({ ...d, ...patch }));
    },
    [setDraft]
  );

  const goNext = useCallback(async () => {
    if (!validation.valido) {
      setShowErrors(true);
      return;
    }
    await save();
    const next = STEP_ORDER[stepIndex + 1];
    if (next) {
      setStep(next);
      setShowErrors(false);
    }
  }, [validation.valido, save, stepIndex]);

  const goPrev = useCallback(() => {
    const prev = STEP_ORDER[stepIndex - 1];
    if (prev) {
      setStep(prev);
      setShowErrors(false);
    }
  }, [stepIndex]);

  const jumpTo = useCallback(
    (target: WizardStepKey) => {
      const targetIdx = STEP_ORDER.indexOf(target);
      // Permite voltar livremente ou avançar até o último válido + 1.
      if (targetIdx <= stepIndex || validSteps.has(target) || targetIdx === stepIndex + 1) {
        setStep(target);
        setShowErrors(false);
      }
    },
    [stepIndex, validSteps]
  );

  const handleApproveAndPublish = useCallback(async () => {
    if (!onApproveAndPublish) return { ok: false, error: 'Ação indisponível' };
    await save();
    if (!draft.id) return { ok: false, error: 'Rascunho não foi salvo ainda' };
    return onApproveAndPublish(draft.id);
  }, [onApproveAndPublish, save, draft.id]);

  const renderStep = () => {
    switch (step) {
      case 'objetivo':
        return <Step1Objetivo draft={draft} onChange={patch} />;
      case 'template':
        return <Step2Template draft={draft} onChange={patch} />;
      case 'publico':
        return <Step3Publico draft={draft} onChange={patch} apiBase={apiBase} slug={slug} />;
      case 'mensagem':
        return <Step4Mensagem draft={draft} onChange={patch} apiBase={apiBase} slug={slug} />;
      case 'orcamento':
        return <Step5Orcamento draft={draft} onChange={patch} apiBase={apiBase} slug={slug} />;
      case 'periodo':
        return <Step6Periodo draft={draft} onChange={patch} />;
      case 'revisao':
        return <Step7Revisao draft={draft} apiBase={apiBase} slug={slug} onGoToStep={setStep} />;
      case 'aprovacao':
        return (
          <Step8Aprovacao
            draft={draft}
            apiBase={apiBase}
            userRole={userRole}
            onSubmit={submit}
            onApproveAndPublish={onApproveAndPublish ? handleApproveAndPublish : undefined}
            onDone={onClose}
          />
        );
    }
  };

  return (
    <WizardShell
      step={step}
      validSteps={validSteps}
      saveStatus={status}
      isFirst={isFirst}
      isLast={isLast}
      validation={showErrors ? validation : { valido: true, erros: [], avisos: validation.avisos }}
      onJumpTo={jumpTo}
      onNext={goNext}
      onPrev={goPrev}
      onClose={onClose}
      slug={slug}
    >
      {renderStep()}
    </WizardShell>
  );
}
