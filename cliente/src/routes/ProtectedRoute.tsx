import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

const ProtectedRoute = () => {
  const auth = useAuth();

  if (auth.loading) {
    return <div></div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
