import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function AdminProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const authRole = localStorage.getItem('authRole');
      
      if (token && authRole === 'ROLE_ADMIN') {
        setIsAuthenticated(true);
      } else {
        // Not authenticated or not admin, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('authRole');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
}