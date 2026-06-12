import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import type { TranslationKey } from '@/features/patient/i18n/translations';
import {
  HELP_REASON_KEYS,
  type HelpReasonKey,
} from '@/features/patient/types/helpReason';
import '@/features/patient/components/help-request-modal.css';

type HelpRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
};

export function HelpRequestModal({ isOpen, onClose, t }: HelpRequestModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [selectedReason, setSelectedReason] = useState<HelpReasonKey | null>(
    null,
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedReason(null);
      setIsSubmitted(false);
      return;
    }

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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selectedReason) {
      return;
    }
    setIsSubmitted(true);
  }

  return (
    <div className="help-request-modal">
      <button
        type="button"
        className="help-request-modal__backdrop"
        aria-label={t('closePanel')}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="help-request-modal__panel"
      >
        <header className="help-request-modal__header">
          <h2 id={titleId} className="help-request-modal__title">
            {t('helpModalTitle')}
          </h2>
          <button
            type="button"
            className="help-request-modal__close"
            aria-label={t('closePanel')}
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="help-request-modal__body">
          {isSubmitted ? (
            <div className="help-request-modal__confirmation">
              <p className="help-request-modal__confirmation-text">
                {t('helpSentConfirmation')}
              </p>
              <button
                type="button"
                className="help-request-modal__submit"
                onClick={onClose}
              >
                {t('closePanel')}
              </button>
            </div>
          ) : (
            <form className="help-request-modal__form" onSubmit={handleSubmit}>
              <fieldset className="help-request-modal__options">
                <legend className="help-request-modal__legend">
                  {t('helpModalTitle')}
                </legend>
                {HELP_REASON_KEYS.map((reasonKey) => {
                  const inputId = `help-reason-${reasonKey}`;
                  return (
                    <label
                      key={reasonKey}
                      htmlFor={inputId}
                      className="help-request-modal__option"
                    >
                      <input
                        id={inputId}
                        type="radio"
                        name="help-reason"
                        value={reasonKey}
                        checked={selectedReason === reasonKey}
                        onChange={() => setSelectedReason(reasonKey)}
                      />
                      <span>{t(reasonKey)}</span>
                    </label>
                  );
                })}
              </fieldset>
              <button
                type="submit"
                className="help-request-modal__submit"
                disabled={!selectedReason}
              >
                {t('helpSubmitButton')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
