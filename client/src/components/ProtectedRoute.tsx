// components/ProtectedRoute.tsx
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading, checkAuth } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const verifyAccess = async () => {
      if (loading) return;

      if (!isAuthenticated) {
        setLocation('/admin/login');
        return;
      }

      if (adminOnly && user && !(user.is_admin || user.is_staff)) {
        setLocation('/unauthorized');
        return;
      }
    };

    verifyAccess();
  }, [isAuthenticated, loading, user, adminOnly, setLocation]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show children only if authenticated and authorized
  if (isAuthenticated && (!adminOnly || (user && (user.is_admin || user.is_staff)))) {
    return <>{children}</>;
  }

  // Don't render anything while redirecting
  return null;
}