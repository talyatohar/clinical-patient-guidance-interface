import type { ProtocolStep } from '@/shared/models/ProtocolStep';
import type { Language } from '@/features/patient/types/language';
import { getProtocolStepDisplayTitle } from '@/features/patient/utils/protocolStepTitle';
import '@/features/patient/components/protocol-step-tracker.css';

type ProtocolStepTrackerProps = {
  steps: ProtocolStep[];
  currentStepIndex: number;
  language: Language;
  unknownStepLabel: string;
};

type StepStatus = 'completed' | 'current' | 'upcoming';

function getStepStatus(index: number, currentStepIndex: number): StepStatus {
  if (index < currentStepIndex) return 'completed';
  if (index === currentStepIndex) return 'current';
  return 'upcoming';
}

export function ProtocolStepTracker({
  steps,
  currentStepIndex,
  language,
  unknownStepLabel,
}: ProtocolStepTrackerProps) {
  return (
    <ol className="step-tracker" aria-label="Protocol progress">
      {steps.map((step, index) => {
        const status = getStepStatus(index, currentStepIndex);
        const title = getProtocolStepDisplayTitle(
          step,
          language,
          unknownStepLabel,
        );
        const isLast = index === steps.length - 1;

        return (
          <li
            key={`${step.protocolId}-${step.stepOrder}-${index}`}
            className={`step-tracker__item step-tracker__item--${status}`}
          >
            <div className="step-tracker__marker-column">
              <span className="step-tracker__marker" aria-hidden="true">
                {status === 'completed' ? (
                  <svg
                    className="step-tracker__check"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M5 10l3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="step-tracker__dot" />
                )}
              </span>
              {!isLast && <span className="step-tracker__connector" />}
            </div>
            <div className="step-tracker__content">
              <span className="step-tracker__order">
                {step.stepOrder > 0 ? step.stepOrder : index + 1}
              </span>
              <span className="step-tracker__title">{title}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
