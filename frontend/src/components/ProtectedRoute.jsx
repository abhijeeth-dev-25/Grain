import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — wraps routes that require auth or a specific role.
 * @param {string} role - optional: "admin" or "user" to restrict by role
 * If no role specified, any logged-in user can access.
 */
export default function ProtectedRoute({ children, role }) {
  const { token, user } = useAuth();

  // Not logged in → go to login
  if (!token) return <Navigate to="/login" replace />;

  // Role check (if role is specified)
  if (role && user?.role !== role) return <Navigate to="/" replace />;

  return children;
}
