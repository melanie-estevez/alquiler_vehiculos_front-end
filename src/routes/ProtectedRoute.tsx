
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, ready } = useAuth();
  const loc = useLocation();

  if (!ready) return <div className="container mt-5 pt-4">Cargando...</div>;

  if (!user) {
    return <Navigate to={`/auth/login?next=${encodeURIComponent(loc.pathname)}`} replace />;
  }

  return children;
}
