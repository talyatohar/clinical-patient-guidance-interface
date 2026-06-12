import type { TranslationKey } from '@/features/patient/i18n/translations';
import type { ProtocolStep } from '@/shared/models/ProtocolStep';
import { isIsolationNavigationStep } from '@/features/patient/utils/isolationNavigation';
import '@/features/patient/components/isolation-navigation-cue.css';

const FOOTPRINT_COUNT = 5;

type IsolationNavigationCueProps = {
  step: Pick<ProtocolStep, 'protocolId' | 'stepOrder'> | null | undefined;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
};

export function IsolationNavigationCue({ step, t }: IsolationNavigationCueProps) {
  if (!isIsolationNavigationStep(step)) {
    return null;
  }

  return (
    <section
      className="isolation-nav-cue"
      aria-labelledby="isolation-nav-cue-heading"
    >
      <p id="isolation-nav-cue-heading" className="isolation-nav-cue__intro">
        {t('isolationNavIntro')}
      </p>

      <ul className="isolation-nav-cue__routes">
        <li className="isolation-nav-cue__route isolation-nav-cue__route--room18">
          <div className="isolation-nav-cue__route-header">
            <span className="isolation-nav-cue__room-label">
              {t('isolationNavWaitingRoom18')}
            </span>
            <div
              className="isolation-nav-cue__footprints"
              aria-hidden="true"
            >
              {Array.from({ length: FOOTPRINT_COUNT }, (_, index) => (
                <span
                  key={index}
                  className="isolation-nav-cue__footprint"
                  style={{ animationDelay: `${index * 0.45}s` }}
                />
              ))}
            </div>
          </div>
        </li>

        <li className="isolation-nav-cue__route isolation-nav-cue__route--room12">
          <div className="isolation-nav-cue__route-header">
            <span className="isolation-nav-cue__room-label">
              {t('isolationNavWaitingRoom12')}
            </span>
            <div
              className="isolation-nav-cue__line-track"
              aria-hidden="true"
            >
              <span className="isolation-nav-cue__line-fill" />
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
}
