import React, { createContext, useState, useEffect } from 'react';
import { validateToken, signup, login as loginAPI, AuthResponse } from '../api/auth';

interface AuthContextType {
  user: AuthResponse | null;
  loading: boolean;
  setUser: (user: AuthResponse | null) => void;
  login: (username: string, password: string) => Promise<AuthResponse>;
  signup: (username: string, email: string, password: string, birthdate: string, gender: string) => Promise<AuthResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  login: async () => ({} as AuthResponse),
  signup: async () => ({} as AuthResponse),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      validateToken(token)
        .then((userData: AuthResponse) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await loginAPI(username, password);
  if (response.token) {
    localStorage.setItem('authToken', response.token);
  }
  setUser(response);
  return response;
};

const handleSignup = async (username: string, email: string, password: string, birthdate: string, gender: string): Promise<AuthResponse> => {
  const response = await signup(username, email, password, birthdate, gender);
  if (response.token) {
    localStorage.setItem('authToken', response.token);
  }
  setUser(response);
  return response;
};

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login, signup: handleSignup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}