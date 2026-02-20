import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { UserListPage } from '../pages/users/UserListPage';
import { CountryListPage } from '../pages/countries/CountryListPage';
import { TranslationListPage } from '../pages/translations/TranslationListPage';
import { ReleaseHistoryPage } from '../pages/releases/ReleaseHistoryPage';
import { AuditLogPage } from '../pages/audit/AuditLogPage';
import { AppLanguageListPage } from '../pages/appLanguages/AppLanguageListPage';
import { BakongSenderConfigPage } from '../pages/bakong/BakongSenderConfigPage';
import { BakongReceiverConfigPage } from '../pages/bakong/BakongReceiverConfigPage';
import { RoleFormPage } from '../pages/roles/RoleFormPage';
import { WingLocationPage } from '../pages/wing/WingLocationPage';
import { WingCategoryPage } from '../pages/wing/WingCategoryPage';
import { WingServicePage } from '../pages/wing/WingServicePage';
import { WingBannerPage } from '../pages/wing/WingBannerPage';
import { WingPopularCardPage } from '../pages/wing/WingPopularCardPage';
import { WingPartnerPage } from '../pages/wing/WingPartnerPage';

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
        <Route path="roles/new" element={<RoleFormPage />} />
        <Route path="roles/:id/edit" element={<RoleFormPage />} />
        <Route path="roles" element={<Navigate to="/users?tab=roles" replace />} />
        <Route path="permissions" element={<Navigate to="/users" replace />} />
        <Route path="countries" element={<CountryListPage />} />
        <Route path="app-languages" element={<AppLanguageListPage />} />
        <Route path="translations" element={<TranslationListPage />} />
        <Route path="messages" element={<Navigate to="/translations" replace />} />
        <Route path="notifications" element={<Navigate to="/translations" replace />} />
        <Route path="bakong/sender" element={<BakongSenderConfigPage />} />
        <Route path="bakong/receiver" element={<BakongReceiverConfigPage />} />
        <Route path="wing/locations" element={<WingLocationPage />} />
        <Route path="wing/categories" element={<WingCategoryPage />} />
        <Route path="wing/partners" element={<WingServicePage />} />
        <Route path="wing/banners" element={<WingBannerPage />} />
        <Route path="wing/popular-partners" element={<WingPopularCardPage />} />
        <Route path="wing/new-partners" element={<WingPartnerPage />} />
        <Route path="releases" element={<ReleaseHistoryPage />} />
        <Route path="audit-logs" element={<AuditLogPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
