import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner size={32} />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
