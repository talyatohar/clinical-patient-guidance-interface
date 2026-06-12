export const ROUTES = {
  patient: {
    root: '/patient',
    login: '/patient/login',
    welcome: '/patient/welcome',
    preparation: '/patient/preparation',
    step: '/patient/step',
    nextSteps: '/patient/next-steps',
    completion: '/patient/completion',
  },
  staff: {
    root: '/staff',
  },
} as const;
