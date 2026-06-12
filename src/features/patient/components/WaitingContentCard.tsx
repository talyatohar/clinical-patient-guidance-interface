import type { TranslationKey } from '@/features/patient/i18n/translations';
import type { Language } from '@/features/patient/types/language';
import {
  buildWaitingContentDisplay,
  hasWaitingContentData,
  lookupWaitingContent,
} from '@/features/patient/services/waitingContentService';
import '@/features/patient/components/waiting-content-card.css';

type WaitingContentCardProps = {
  protocolId: string;
  stepOrder: number;
  language: Language;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
};

export function WaitingContentCard({
  protocolId,
  stepOrder,
  language,
  t,
}: WaitingContentCardProps) {
  const content = lookupWaitingContent(protocolId, stepOrder);

  if (!hasWaitingContentData(content) || !content) {
    return null;
  }

  const display = buildWaitingContentDisplay(
    content,
    language,
    t('waitingBreathingTitle'),
  );

  if (!display) {
    return null;
  }

  const showFunFact = Boolean(display.funFact);
  const showBreathing = Boolean(display.breathingInstruction);

  if (!showFunFact && !showBreathing) {
    return null;
  }

  return (
    <section
      className="waiting-content-card"
      aria-labelledby={showFunFact ? 'waiting-content-heading' : undefined}
      aria-label={showFunFact ? undefined : display.breathingTitle}
    >
      {showFunFact && (
        <div className="waiting-content-card__section">
          <h2
            id="waiting-content-heading"
            className="waiting-content-card__heading"
          >
            {t('waitingFunFactTitle')}
          </h2>
          <p className="waiting-content-card__text">{display.funFact}</p>
        </div>
      )}

      {showBreathing && (
        <div className="waiting-content-card__section">
          <h2 className="waiting-content-card__heading">
            {display.breathingTitle}
          </h2>
          <p className="waiting-content-card__text">
            {display.breathingInstruction}
          </p>
        </div>
      )}
    </section>
  );
}
