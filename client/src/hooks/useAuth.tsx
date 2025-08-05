import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (username: string, password: string) => Promise<{ error?: any }>;
  signUp: (username: string, password: string, fullName?: string) => Promise<{ error?: any }>;
  signOut: () => Promise<{ error?: any }>;
  loading: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        setUserRole('admin'); // For now, all users are admins
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      setUser(response.user);
      setUserRole('admin'); // For now, all users are admins
      
      return { error: null };
    } catch (error) {
      return { error: { message: error instanceof Error ? error.message : 'Login failed' } };
    }
  };

  const signUp = async (username: string, password: string, fullName?: string) => {
    try {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      setUser(response.user);
      setUserRole('admin'); // For now, all users are admins
      
      return { error: null };
    } catch (error) {
      return { error: { message: error instanceof Error ? error.message : 'Registration failed' } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setUserRole(null);
    return { error: null };
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
    userRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}