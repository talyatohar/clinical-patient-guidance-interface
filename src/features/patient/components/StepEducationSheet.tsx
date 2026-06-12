import { useEffect, useId, useRef } from 'react';
import type { TranslationKey } from '@/features/patient/i18n/translations';
import type { Language } from '@/features/patient/types/language';
import { StepEducationContent } from '@/features/patient/components/StepEducationContent';
import '@/features/patient/components/step-education-sheet.css';

type StepEducationSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  protocolId: string;
  stepOrder: number;
  language: Language;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
};

export function StepEducationSheet({
  isOpen,
  onClose,
  protocolId,
  stepOrder,
  language,
  t,
}: StepEducationSheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="step-education-sheet">
      <button
        type="button"
        className="step-education-sheet__backdrop"
        aria-label={t('closePanel')}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="step-education-sheet__panel"
      >
        <header className="step-education-sheet__header">
          <h2 id={titleId} className="step-education-sheet__title">
            {t('eduPanelTitle')}
          </h2>
          <button
            type="button"
            className="step-education-sheet__close"
            aria-label={t('closePanel')}
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="step-education-sheet__body">
          <StepEducationContent
            protocolId={protocolId}
            stepOrder={stepOrder}
            language={language}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
