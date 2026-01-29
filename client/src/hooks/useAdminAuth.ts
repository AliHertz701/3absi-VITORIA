// admin/hooks/useAdminAuth.ts
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { adminApi } from '../admin_api';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
}

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved admin session
    const savedUser = localStorage.getItem('admin_user');
    const savedToken = localStorage.getItem('admin_token');
    
    if (savedUser && savedToken) {
      try {
        setAdmin(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await adminApi.login(credentials);
      
      if (response.success) {
        const { user, tokens } = response;
        
        // Save to localStorage
        localStorage.setItem('admin_user', JSON.stringify(user));
        localStorage.setItem('admin_token', tokens.access);
        
        // Update state
        setAdmin(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}