import type { TranslationKey } from '@/features/patient/i18n/translations';
import type { Language } from '@/features/patient/types/language';
import '@/features/patient/components/step-education-content.css';
import {
  buildEducationBlocks,
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

function EducationSectionArticle({
  section,
  t,
}: {
  section: EducationSection;
  t: StepEducationContentProps['t'];
}) {
  return (
    <article
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
  );
}

export function StepEducationContent({
  protocolId,
  stepOrder,
  language,
  t,
}: StepEducationContentProps) {
  const educationRows = getEducationForStep(protocolId, stepOrder);
  const blocks = buildEducationBlocks(educationRows, language);

  if (blocks.length === 0) {
    return (
      <p className="step-education-content__fallback">{t('eduNoInformation')}</p>
    );
  }

  const hasMultipleBlocks = blocks.length > 1;

  return (
    <>
      <p className="step-education-content__intro">{t('eduPanelIntro')}</p>
      <div
        className={
          hasMultipleBlocks
            ? 'step-education-content__blocks step-education-content__blocks--multiple'
            : 'step-education-content__blocks'
        }
      >
        {blocks.map((block, blockIndex) => (
          <div key={blockIndex} className="step-education-content__block">
            <div className="step-education-content__sections">
              {block.sections.map((section, sectionIndex) => (
                <EducationSectionArticle
                  key={`${blockIndex}-${section.id}-${sectionIndex}`}
                  section={section}
                  t={t}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
