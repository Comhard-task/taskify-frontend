// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskify_token'));
  const [loading, setLoading] = useState(true);

  // Auto-fetch profile on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getMe();
        if (response && response.data) {
          setUser(response.data);
        }
      } catch (err) {
        console.warn('Session expired or offline:', err.message);
        // If 401, clear token
        if (err.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for 401 unauthorized events from api.js
    const handleUnauthorized = () => logout();
    window.addEventListener('taskify:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('taskify:unauthorized', handleUnauthorized);
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('taskify_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    const res = await authAPI.signup({ name, email, password });
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('taskify_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('taskify_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        signup,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
