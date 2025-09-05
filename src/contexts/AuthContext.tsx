import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/mock-data';
import { login as apiLogin } from '@/lib/api-client';
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on app load
    const storedUser = localStorage.getItem('loggedUser');
    const storedToken = localStorage.getItem('jwtToken');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log(email, password);
      const response = await apiLogin({ email, password });
      if (response.error) {
        throw new Error(response.message);
      }
      setUser(response.user as User);
      localStorage.setItem('loggedUser', JSON.stringify(response.user));
      localStorage.setItem('jwtToken', response.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('jwtToken');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}