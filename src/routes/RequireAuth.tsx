import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth() {
  const { user, token, ready } = useAuth();
  const location = useLocation();

  // evita parpadeo al recargar
  if (!ready) return null;

  if (!user || !token) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
