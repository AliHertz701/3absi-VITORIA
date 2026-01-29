// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  is_staff?: boolean;
  first_name?: string;
  last_name?: string;
}

interface Tokens {
  access: string;
  refresh: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  tokens: Tokens;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to get stored tokens
  const getStoredTokens = (): Tokens | null => {
    try {
      const tokens = localStorage.getItem('auth_tokens');
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  };

  // Helper to get stored user
  const getStoredUser = (): User | null => {
    try {
      const user = localStorage.getItem('auth_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  };

  // Helper to set auth headers
  const getAuthHeaders = () => {
    const tokens = getStoredTokens();
    if (tokens?.access) {
      return {
        'Authorization': `Bearer ${tokens.access}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  };

  // Get current access token (for API calls)
  const getAccessToken = (): string | null => {
    const tokens = getStoredTokens();
    return tokens?.access || null;
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const tokens = getStoredTokens();
      if (!tokens?.refresh) return false;

      const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: tokens.refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        const newTokens = {
          ...tokens,
          access: data.access,
        };
        localStorage.setItem('auth_tokens', JSON.stringify(newTokens));
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  };

  // Check if user is authenticated
  const checkAuth = async (): Promise<void> => {
    try {
      setLoading(true);
      
      const storedUser = getStoredUser();
      const tokens = getStoredTokens();

      if (!storedUser || !tokens?.access) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Verify token with backend
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/profile/`, {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          setUser(storedUser);
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          // Token expired, try to refresh
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            // Try again with new token
            const retryResponse = await fetch(`${API_BASE_URL}/api/user/profile/`, {
              headers: getAuthHeaders(),
            });
            
            if (retryResponse.ok) {
              setUser(storedUser);
              setIsAuthenticated(true);
            } else {
              throw new Error('Token refresh failed');
            }
          } else {
            throw new Error('Token expired and refresh failed');
          }
        } else {
          throw new Error('Profile fetch failed');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid auth data
        localStorage.removeItem('auth_tokens');
        localStorage.removeItem('auth_user');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
      }

      const data: AuthResponse = await response.json();
      
      if (!data.success || !data.user || !data.tokens) {
        throw new Error('Invalid response format');
      }
      
      // Store auth data
      localStorage.setItem('auth_tokens', JSON.stringify(data.tokens));
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_user');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/admin/login';
  };

  // Initialize auth state
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};