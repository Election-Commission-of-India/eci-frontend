import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const useEroAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/ero/login');
    }
  }, [navigate]);

  const isAuthenticated = () => {
    return !!localStorage.getItem('jwtToken');
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('eroUser');
    navigate('/ero/login');
  };

  return { isAuthenticated, logout };
};