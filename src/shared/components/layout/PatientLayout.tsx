import { Outlet } from 'react-router-dom';
import { PatientAppHeader } from '@/features/patient/components/PatientAppHeader';
import { AccessibilityProvider } from '@/features/patient/state/AccessibilityContext';
import '@/styles/accessibility.css';
import '@/styles/patient.css';

export function PatientLayout() {
  return (
    <AccessibilityProvider>
      <div className="patient-app">
        <PatientAppHeader />
        <main className="patient-main">
          <Outlet />
        </main>
      </div>
    </AccessibilityProvider>
  );
}
