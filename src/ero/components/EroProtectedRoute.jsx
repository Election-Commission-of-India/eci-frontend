import { useEroAuth } from '../hooks/useEroAuth';
import LoadingSmall from '../../components/SmallLoading';

export default function EroProtectedRoute({ children }) {
  const { isAuthenticated } = useEroAuth();

  if (!isAuthenticated()) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSmall size="lg" />
      </div>
    );
  }

  return children;
}