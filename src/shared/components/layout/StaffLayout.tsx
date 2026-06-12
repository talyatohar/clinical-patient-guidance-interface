import { Outlet } from 'react-router-dom';
import '@/styles/staff.css';

export function StaffLayout() {
  return (
    <div className="staff-app">
      <aside className="staff-sidebar" aria-label="Staff navigation" />
      <div className="staff-content">
        <header className="staff-header" />
        <main className="staff-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
