import type { TranslationKey } from '@/features/patient/i18n/translations';
import type { Language } from '@/features/patient/types/language';
import '@/features/patient/components/step-education-content.css';
import {
  buildEducationSections,
  getEducationForStep,
  type EducationSection,
} from '@/features/patient/services/educationService';

type StepEducationContentProps = {
  protocolId: string;
  stepOrder: number;
  language: Language;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
};

const SECTION_TITLE_KEYS: Record<EducationSection['id'], TranslationKey> = {
  whatHappens: 'eduWhatHappens',
  whyImportant: 'eduWhyImportant',
  commonQuestion: 'eduCommonQuestion',
  reassurance: 'eduReassurance',
};

function isFaqSection(
  section: EducationSection,
): section is Extract<EducationSection, { id: 'commonQuestion' }> {
  return section.id === 'commonQuestion';
}

export function StepEducationContent({
  protocolId,
  stepOrder,
  language,
  t,
}: StepEducationContentProps) {
  const education = getEducationForStep(protocolId, stepOrder);
  const sections = buildEducationSections(education, language);

  if (sections.length === 0) {
    return (
      <p className="step-education-content__fallback">{t('eduNoInformation')}</p>
    );
  }

  return (
    <>
      <p className="step-education-content__intro">{t('eduPanelIntro')}</p>
      <div className="step-education-content__sections">
        {sections.map((section) => (
          <article
            key={section.id}
            className={`step-education-content__section step-education-content__section--${section.id}`}
          >
            <h3 className="step-education-content__section-title">
              {t(SECTION_TITLE_KEYS[section.id])}
            </h3>

            {isFaqSection(section) ? (
              <div className="step-education-content__faq">
                {section.question && (
                  <p className="step-education-content__faq-question">
                    {section.question}
                  </p>
                )}
                {section.answer && (
                  <p
                    className={
                      section.question
                        ? 'step-education-content__faq-answer'
                        : 'step-education-content__body'
                    }
                  >
                    {section.answer}
                  </p>
                )}
              </div>
            ) : (
              <p className="step-education-content__body">{section.body}</p>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
