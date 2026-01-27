import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApis } from '../services/authApis';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('jwtToken');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (loginData) => {
    try {
      const response = await authApis.login(loginData);
      
      // Extract user info from JWT response
      const userInfo = {
        token: response.token,
        message: response.message,
        // You might need to decode JWT to get user details
        // or make a separate API call to get user profile
      };
      
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (signupData) => {
    try {
      const response = await authApis.signup(signupData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authApis.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('jwtToken');
    return !!token && !!user;
  };

  const hasRole = (role) => {
    return user?.userRole === role;
  };

  const canAccessVoterServices = () => {
    return user?.userRole === 'USER';
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    hasRole,
    canAccessVoterServices,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};