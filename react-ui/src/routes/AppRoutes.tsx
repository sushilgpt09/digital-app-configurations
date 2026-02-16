import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { UserListPage } from '../pages/users/UserListPage';
import { CountryListPage } from '../pages/countries/CountryListPage';
import { TranslationListPage } from '../pages/translations/TranslationListPage';
import { GlobalConfigListPage } from '../pages/globalConfigs/GlobalConfigListPage';
import { AuditLogPage } from '../pages/audit/AuditLogPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UserListPage />} />
        <Route path="roles" element={<Navigate to="/users" replace />} />
        <Route path="permissions" element={<Navigate to="/users" replace />} />
        <Route path="countries" element={<CountryListPage />} />
        <Route path="translations" element={<TranslationListPage />} />
        <Route path="messages" element={<Navigate to="/translations" replace />} />
        <Route path="notifications" element={<Navigate to="/translations" replace />} />
        <Route path="global-configs" element={<GlobalConfigListPage />} />
        <Route path="audit-logs" element={<AuditLogPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
