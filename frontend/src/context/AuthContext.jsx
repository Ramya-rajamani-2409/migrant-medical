// src/context/AuthContext.jsx
// Manages login state globally across the app

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Try to restore session from localStorage on page refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mmrs_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('mmrs_token') || null);

  // Login: save user + token
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('mmrs_user', JSON.stringify(userData));
    localStorage.setItem('mmrs_token', authToken);
  };

  // Logout: clear everything
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mmrs_user');
    localStorage.removeItem('mmrs_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
