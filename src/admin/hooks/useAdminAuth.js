import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const useAdminAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const authRole = localStorage.getItem('authRole');
    if (!token || authRole !== 'ROLE_ADMIN') {
      navigate('/admin/login');
    }
  }, [navigate]);

  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    const authRole = localStorage.getItem('authRole');
    return !!(token && authRole === 'ROLE_ADMIN');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authRole');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const getAdminUser = () => {
    const adminUser = localStorage.getItem('adminUser');
    return adminUser ? JSON.parse(adminUser) : null;
  };

  return { isAuthenticated, logout, getAdminUser };
};