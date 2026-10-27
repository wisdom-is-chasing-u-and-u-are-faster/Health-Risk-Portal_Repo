import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOperator: boolean;
  login: (username: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Pure in-memory user state without browser storage persistence (Zero-ePHI compliant)
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password?: string) => {
    const loggedInUser = await authService.loginOAuth2(username, password);
    setUser(loggedInUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isOperator = user?.role === 'Operator';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isOperator,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
