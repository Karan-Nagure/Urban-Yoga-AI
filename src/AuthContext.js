import { createContext, useContext, useState, useEffect } from 'react';
import { api } from './utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const token   = localStorage.getItem('uy_token');
    const stored  = localStorage.getItem('uy_user');
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('uy_token', data.token);
    localStorage.setItem('uy_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (username, email, password) => {
    const data = await api.register({ username, email, password });
    localStorage.setItem('uy_token', data.token);
    localStorage.setItem('uy_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('uy_token');
    localStorage.removeItem('uy_user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const fresh = await api.getProfile();
      localStorage.setItem('uy_user', JSON.stringify(fresh));
      setUser(fresh);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
