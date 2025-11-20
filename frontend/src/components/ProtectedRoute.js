import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUser } from '../services/auth';

function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles) {
    const user = getUser();
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" />;
    }
  }

  return children;
}

export default ProtectedRoute;
