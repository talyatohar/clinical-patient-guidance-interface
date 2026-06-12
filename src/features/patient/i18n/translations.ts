import type { Language } from '@/features/patient/types/language';

export type TranslationKey =
  | 'appTitle'
  | 'loginSubtitle'
  | 'languageLabel'
  | 'languageHebrew'
  | 'languageEnglish'
  | 'idNumberLabel'
  | 'idNumberPlaceholder'
  | 'verificationCodeLabel'
  | 'verificationCodePlaceholder'
  | 'loginButton'
  | 'loginLoading'
  | 'loginErrorInvalid'
  | 'loginErrorDatabase'
  | 'loginPatientsLoaded'
  | 'loginPatientsLoadFailed'
  | 'welcomeTitle'
  | 'valueUnavailable'
  | 'unknownStepTitle'
  | 'welcomeGreeting'
  | 'welcomeFirstNameLabel'
  | 'welcomeExamLabel'
  | 'welcomeAppointmentLabel'
  | 'startJourneyButton'
  | 'preparationChecklistTitle'
  | 'preparationChecklistIntro'
  | 'preparationChecklistWarning'
  | 'continueToJourneyButton'
  | 'stepTitle'
  | 'stepProgress'
  | 'stepRemainingTime'
  | 'progressTrackerTitle'
  | 'remainingTimeTitle'
  | 'stepDurationEstimate'
  | 'completeStepButton'
  | 'viewNextStepsButton'
  | 'backToCurrentStep'
  | 'nextStepsTitle'
  | 'nextStepsEmpty'
  | 'nextStepItem'
  | 'completionTitle'
  | 'completionMessage'
  | 'completionVisitSummaryTitle'
  | 'completionTotalDurationLabel'
  | 'completionTimeLabel'
  | 'completionResultsInfo'
  | 'completionFeedbackTitle'
  | 'completionRatingAriaLabel'
  | 'completionStarLabel'
  | 'completionCommentLabel'
  | 'completionCommentPlaceholder'
  | 'noProtocolSteps'
  | 'eduPanelTitle'
  | 'eduPanelIntro'
  | 'eduWhatHappens'
  | 'eduWhyImportant'
  | 'eduCommonQuestion'
  | 'eduReassurance'
  | 'eduNoInformation'
  | 'openStepInfoButton'
  | 'closePanel'
  | 'needHelpButton'
  | 'helpModalTitle'
  | 'helpSubmitButton'
  | 'helpSentConfirmation'
  | 'helpReasonFindRoom'
  | 'helpReasonExamQuestion'
  | 'helpReasonFeelUnwell'
  | 'helpReasonInstructions'
  | 'helpReasonOther'
  | 'isolationNavIntro'
  | 'isolationNavWaitingRoom18'
  | 'isolationNavWaitingRoom12'
  | 'waitingFunFactTitle'
  | 'waitingBreathingTitle'
  | 'accessibilityLabel'
  | 'accessibilityPanelTitle'
  | 'textSizeLabel'
  | 'textSizeNormal'
  | 'textSizeLarge'
  | 'textSizeExtraLarge'
  | 'contrastModeLabel'
  | 'contrastModeStandard'
  | 'contrastModeHigh';

const translations: Record<Language, Record<TranslationKey, string>> = {
  he: {
    appTitle: 'מדריך רפואה גרעינית',
    loginSubtitle: 'התחברות למערכת המטופל',
    languageLabel: 'שפה',
    languageHebrew: 'עברית',
    languageEnglish: 'English',
    idNumberLabel: 'מספר תעודת זהות',
    idNumberPlaceholder: 'הזן מספר תעודת זהות',
    verificationCodeLabel: 'קוד אימות',
    verificationCodePlaceholder: 'הזן קוד אימות',
    loginButton: 'התחבר',
    loginLoading: 'מתחבר...',
    loginErrorInvalid: 'מספר זהות או קוד אימות שגויים. אנא נסה שוב.',
    loginErrorDatabase:
      'לא ניתן לטעון את נתוני המטופלים. אנא נסה שוב מאוחר יותר.',
    loginPatientsLoaded: 'נטענו {count} מטופלים',
    loginPatientsLoadFailed: 'לא ניתן לטעון מטופלים',
    welcomeTitle: 'ברוכים הבאים',
    valueUnavailable: 'לא זמין',
    unknownStepTitle: 'שלב לא ידוע',
    welcomeGreeting: 'שלום, {name}',
    welcomeFirstNameLabel: 'שם פרטי',
    welcomeExamLabel: 'סוג בדיקה',
    welcomeAppointmentLabel: 'שעת תור',
    startJourneyButton: 'התחל את המסע שלי',
    preparationChecklistTitle: 'צ׳קליסט הכנה',
    preparationChecklistIntro:
      'לפני שנתחיל, אנא עברו על הנחיות ההכנה הבאות.',
    preparationChecklistWarning:
      'אם אחת מההנחיות לא בוצעה, יש ליידע את הצוות הרפואי לפני המשך הבדיקה.',
    continueToJourneyButton: 'המשך למסלול שלי',
    eduPanelTitle: 'מידע לשלב זה',
    eduPanelIntro: 'המידע הבא נועד לעזור לך להבין מה קורה עכשיו ולהרגיש רגוע יותר.',
    eduWhatHappens: 'מה קורה עכשיו?',
    eduWhyImportant: 'למה זה חשוב?',
    eduCommonQuestion: 'שאלה נפוצה',
    eduReassurance: 'לידיעתך',
    eduNoInformation: 'אין מידע נוסף זמין.',
    openStepInfoButton: 'מידע על השלב הזה',
    closePanel: 'סגור',
    needHelpButton: 'אני צריך עזרה',
    helpModalTitle: 'במה אפשר לעזור?',
    helpSubmitButton: 'שליחה',
    helpSentConfirmation: 'הבקשה נשלחה לצוות',
    helpReasonFindRoom: 'אני לא מוצא/ת את החדר',
    helpReasonExamQuestion: 'יש לי שאלה על הבדיקה',
    helpReasonFeelUnwell: 'אני לא מרגיש/ה טוב',
    helpReasonInstructions: 'אני לא מבין/ה את ההנחיות',
    helpReasonOther: 'אחר',
    isolationNavIntro:
      'מעבר לחדרי בידוד: אם נאמר לך להמתין בחדר המתנה 18, יש ללכת בעקבות הצעדים הכחולים שעל הרצפה לחדר הבידוד. אם נאמר לך להמתין בחדר המתנה 12, יש ללכת על הפס האדום שעל הרצפה.',
    isolationNavWaitingRoom18: 'חדר המתנה 18',
    isolationNavWaitingRoom12: 'חדר המתנה 12',
    waitingFunFactTitle: 'הידעת?',
    waitingBreathingTitle: 'תרגיל נשימה',
    accessibilityLabel: 'נגישות',
    accessibilityPanelTitle: 'הגדרות נגישות',
    textSizeLabel: 'גודל טקסט',
    textSizeNormal: 'רגיל',
    textSizeLarge: 'גדול',
    textSizeExtraLarge: 'גדול מאוד',
    contrastModeLabel: 'מצב ניגודיות',
    contrastModeStandard: 'רגיל',
    contrastModeHigh: 'ניגודיות גבוהה',
    stepTitle: 'שלב נוכחי',
    stepProgress: 'שלב {current} מתוך {total}',
    stepRemainingTime: 'זמן משוער שנותר: {duration}',
    progressTrackerTitle: 'התקדמות הביקור',
    remainingTimeTitle: 'זמן משוער שנותר לביקור',
    stepDurationEstimate: '~{duration}',
    completeStepButton: 'סיימתי את השלב הזה',
    viewNextStepsButton: 'צפה בשלבים הבאים',
    backToCurrentStep: 'חזרה לשלב הנוכחי',
    nextStepsTitle: 'השלבים הבאים',
    nextStepsEmpty: 'אין שלבים נוספים',
    nextStepItem: '{order}. {title}',
    completionTitle: 'הבדיקה הסתיימה',
    completionMessage: 'הבדיקה הסתיימה בהצלחה.',
    completionVisitSummaryTitle: 'סיכום הביקור',
    completionTotalDurationLabel: 'משך ביקור משוער (סה״כ)',
    completionTimeLabel: 'שעת סיום',
    completionResultsInfo:
      'תוצאות הבדיקה ייבדקו על ידי הצוות הרפואי ויישלחו לרופא/ה המפנה.',
    completionFeedbackTitle: 'איך הייתה החוויה שלך היום?',
    completionRatingAriaLabel: 'דירוג החוויה',
    completionStarLabel: '{count} כוכבים',
    completionCommentLabel: 'הערות (אופציונלי)',
    completionCommentPlaceholder: 'שתף/י איתנו את חווייתך...',
    noProtocolSteps: 'לא נמצאו שלבים עבור פרוטוקול זה',
  },
  en: {
    appTitle: 'Nuclear Medicine Guide',
    loginSubtitle: 'Patient sign in',
    languageLabel: 'Language',
    languageHebrew: 'עברית',
    languageEnglish: 'English',
    idNumberLabel: 'ID number',
    idNumberPlaceholder: 'Enter your ID number',
    verificationCodeLabel: 'Verification code',
    verificationCodePlaceholder: 'Enter verification code',
    loginButton: 'Sign in',
    loginLoading: 'Signing in...',
    loginErrorInvalid:
      'Invalid ID number or verification code. Please try again.',
    loginErrorDatabase:
      'Unable to load patient data. Please try again later.',
    loginPatientsLoaded: 'Loaded {count} patients',
    loginPatientsLoadFailed: 'Unable to load patients',
    welcomeTitle: 'Welcome',
    valueUnavailable: 'Not available',
    unknownStepTitle: 'Unknown Step',
    welcomeGreeting: 'Hello, {name}',
    welcomeFirstNameLabel: 'First name',
    welcomeExamLabel: 'Exam type',
    welcomeAppointmentLabel: 'Appointment time',
    startJourneyButton: 'Start My Journey',
    preparationChecklistTitle: 'Preparation Checklist',
    preparationChecklistIntro:
      'Before we begin, please review the following preparation instructions.',
    preparationChecklistWarning:
      'If any instruction was not completed, please inform the medical staff before proceeding.',
    continueToJourneyButton: 'Continue to My Journey',
    eduPanelTitle: 'About this step',
    eduPanelIntro: 'The information below is here to help you understand what is happening and feel more at ease.',
    eduWhatHappens: 'What Happens Now?',
    eduWhyImportant: 'Why Is This Important?',
    eduCommonQuestion: 'Common Question',
    eduReassurance: 'Reassurance',
    eduNoInformation: 'No additional information available.',
    openStepInfoButton: 'Information about this step',
    closePanel: 'Close',
    needHelpButton: 'I Need Help',
    helpModalTitle: 'How can we help?',
    helpSubmitButton: 'Submit',
    helpSentConfirmation: 'Your request has been sent to the staff',
    helpReasonFindRoom: 'I cannot find the room',
    helpReasonExamQuestion: 'I have a question about the examination',
    helpReasonFeelUnwell: 'I do not feel well',
    helpReasonInstructions: 'I do not understand the instructions',
    helpReasonOther: 'Other',
    isolationNavIntro:
      'Moving to isolation rooms: If you were instructed to wait in Waiting Room 18, follow the blue footprints on the floor to the isolation room. If you were instructed to wait in Waiting Room 12, follow the red line on the floor.',
    isolationNavWaitingRoom18: 'Waiting Room 18',
    isolationNavWaitingRoom12: 'Waiting Room 12',
    waitingFunFactTitle: 'Did you know?',
    waitingBreathingTitle: 'Breathing exercise',
    accessibilityLabel: 'Accessibility',
    accessibilityPanelTitle: 'Accessibility settings',
    textSizeLabel: 'Text size',
    textSizeNormal: 'Normal',
    textSizeLarge: 'Large',
    textSizeExtraLarge: 'Extra Large',
    contrastModeLabel: 'Contrast mode',
    contrastModeStandard: 'Standard',
    contrastModeHigh: 'High Contrast',
    stepTitle: 'Current step',
    stepProgress: 'Step {current} of {total}',
    stepRemainingTime: 'Estimated time remaining: {duration}',
    progressTrackerTitle: 'Visit progress',
    remainingTimeTitle: 'Estimated remaining visit time',
    stepDurationEstimate: '~{duration}',
    completeStepButton: 'I completed this step',
    viewNextStepsButton: 'View next steps',
    backToCurrentStep: 'Back to current step',
    nextStepsTitle: 'Upcoming steps',
    nextStepsEmpty: 'No more steps',
    nextStepItem: '{order}. {title}',
    completionTitle: 'Examination Completed',
    completionMessage: 'Your examination has been completed successfully.',
    completionVisitSummaryTitle: 'Visit Summary',
    completionTotalDurationLabel: 'Total estimated visit duration',
    completionTimeLabel: 'Completion time',
    completionResultsInfo:
      'Your results will be reviewed by the medical team and sent to your referring physician.',
    completionFeedbackTitle: 'How was your experience today?',
    completionRatingAriaLabel: 'Rate your experience',
    completionStarLabel: '{count} stars',
    completionCommentLabel: 'Comments (optional)',
    completionCommentPlaceholder: 'Share your experience with us...',
    noProtocolSteps: 'No steps found for this protocol',
  },
};

export function translate(
  language: Language,
  key: TranslationKey,
  params?: Record<string, string>,
): string {
  let text = translations[language][key];
  if (params) {
    for (const [param, value] of Object.entries(params)) {
      text = text.replace(`{${param}}`, value);
    }
  }
  return text;
}
