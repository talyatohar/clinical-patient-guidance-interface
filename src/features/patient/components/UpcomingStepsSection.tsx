import type { ProtocolStep } from '@/shared/models/ProtocolStep';
import { formatVisitDuration } from '@/features/patient/utils/formatDuration';
import { getProtocolStepDisplayTitle } from '@/features/patient/utils/protocolStepTitle';
import type { Language } from '@/features/patient/types/language';
import '@/features/patient/components/upcoming-steps-section.css';

type UpcomingStepsSectionProps = {
  steps: ProtocolStep[];
  language: Language;
  title: string;
  emptyLabel: string;
  unknownStepLabel: string;
  minutesLabel: string;
};

export function UpcomingStepsSection({
  steps,
  language,
  title,
  emptyLabel,
  unknownStepLabel,
  minutesLabel,
}: UpcomingStepsSectionProps) {
  return (
    <section className="upcoming-steps" aria-labelledby="upcoming-steps-heading">
      <h2 id="upcoming-steps-heading" className="upcoming-steps__title">
        {title}
      </h2>

      {steps.length === 0 ? (
        <p className="upcoming-steps__empty">{emptyLabel}</p>
      ) : (
        <ul className="upcoming-steps__list">
          {steps.map((step) => {
            const stepTitle = getProtocolStepDisplayTitle(
              step,
              language,
              unknownStepLabel,
            );
            const duration =
              step.estimatedMinutes > 0
                ? formatVisitDuration(language, step.estimatedMinutes)
                : null;

            return (
              <li
                key={`${step.protocolId}-${step.stepOrder}`}
                className="upcoming-steps__item"
              >
                <span className="upcoming-steps__order">{step.stepOrder}</span>
                <div className="upcoming-steps__details">
                  <span className="upcoming-steps__name">{stepTitle}</span>
                  {duration && (
                    <span className="upcoming-steps__duration">
                      {minutesLabel.replace('{duration}', duration)}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
