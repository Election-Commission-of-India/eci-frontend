import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const useEroAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('eroToken');
    if (!token) {
      navigate('/ero/login');
    }
  }, [navigate]);

  const isAuthenticated = () => {
    return !!localStorage.getItem('eroToken');
  };

  return { isAuthenticated };
};