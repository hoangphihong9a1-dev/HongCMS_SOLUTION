import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem('customer');
    return localUser ? JSON.parse(localUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      // Backend returns customer object on success
      const userData = response.data || response;
      setUser(userData);
      localStorage.setItem('customer', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const register = async (customerData) => {
    try {
      const response = await authService.register(customerData);
      const userData = response.data || response;
      // Proactively log the customer in after successful registration
      setUser(userData);
      localStorage.setItem('customer', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Registration error in AuthContext:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('customer');
  };

  const updateProfile = async (customerData) => {
    try {
      await authService.updateProfile(user.id, customerData);
      const updatedUser = { ...user, ...customerData };
      setUser(updatedUser);
      localStorage.setItem('customer', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Update profile error in AuthContext:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      customer: user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateProfile
    }}>
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
