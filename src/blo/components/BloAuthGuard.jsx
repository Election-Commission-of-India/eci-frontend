import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserId } from '../../utils/auth';
import { toast } from 'react-toastify';

export default function BloAuthGuard({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getCurrentUserId();
    
    if (!userId) {
      toast.error('Please login first to access BLO dashboard');
      navigate('/blo/login');
    }
  }, [navigate]);

  const userId = getCurrentUserId();
  
  if (!userId) {
    return null; // Don't render anything while redirecting
  }

  return children;
}