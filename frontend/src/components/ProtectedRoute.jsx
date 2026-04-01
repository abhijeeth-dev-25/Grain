import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — wraps routes that require auth or a specific role.
 * Waits for auth state to be initialized before deciding to redirect,
 * preventing a flash of content or incorrect redirects on first load.
 */
export default function ProtectedRoute({ children, role }) {
  const { token, user, initialized } = useAuth();

  // Auth state is still being resolved from localStorage — render nothing
  if (!initialized) return null;

  // Not logged in → go to login
  if (!token) return <Navigate to="/login" replace />;

  // Role check (if role is specified)
  if (role && user?.role !== role) return <Navigate to="/" replace />;

  return children;
}

