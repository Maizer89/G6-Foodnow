import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, authOnly, guestOnly }) {
  const { isLoggedIn } = useAuth();

  if (authOnly && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (guestOnly && isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}
