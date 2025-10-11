import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      console.log('[AuthContext] initAuth called, token:', token ? 'exists' : 'null');
      if (token) {
        try {
          console.log('[AuthContext] Calling api.getProfile()...');
          const data = await api.getProfile();
          console.log('[AuthContext] Profile loaded:', data);
          setUser(data.user);
        } catch (error) {
          console.error('[AuthContext] Failed to load user profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    console.log('[AuthContext] login called:', { email });
    try {
      const data = await api.login(email, password);
      console.log('[AuthContext] login successful, storing token and user:', { userId: data.user?._id, email: data.user?.email });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('[AuthContext] login failed:', error);
      throw error;
    }
  };

  const register = async (email, name, password) => {
    console.log('[AuthContext] register called:', { email, name });
    try {
      const data = await api.register(email, name, password);
      console.log('[AuthContext] register successful, storing token and user:', { userId: data.user?._id, email: data.user?.email });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('[AuthContext] register failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('[AuthContext] logout called, clearing token and user');
    try {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      console.log('[AuthContext] logout successful');
    } catch (error) {
      console.error('[AuthContext] logout failed:', error);
    }
  };

  const updateUser = (updatedUser) => {
    console.log('[AuthContext] updateUser called:', { updatedUser });
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
