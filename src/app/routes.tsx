import { Navigate, Route, Routes } from 'react-router-dom';
import { CompletionPage } from '@/features/patient/pages/CompletionPage';
import { CurrentStepPage } from '@/features/patient/pages/CurrentStepPage';
import { LoginPage } from '@/features/patient/pages/LoginPage';
import { NextStepsPage } from '@/features/patient/pages/NextStepsPage';
import { PreparationChecklistPage } from '@/features/patient/pages/PreparationChecklistPage';
import { WelcomePage } from '@/features/patient/pages/WelcomePage';
import { PatientLayout } from '@/shared/components/layout/PatientLayout';
import { StaffLayout } from '@/shared/components/layout/StaffLayout';
import { ROUTES } from '@/shared/constants/routes';

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.patient.root} element={<PatientLayout />}>
        <Route index element={<Navigate to={ROUTES.patient.login} replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="preparation" element={<PreparationChecklistPage />} />
        <Route path="step" element={<CurrentStepPage />} />
        <Route path="next-steps" element={<NextStepsPage />} />
        <Route path="completion" element={<CompletionPage />} />
      </Route>

      <Route path={ROUTES.staff.root} element={<StaffLayout />}>
        {/* Staff screens will be added here */}
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.patient.login} replace />} />
    </Routes>
  );
}
