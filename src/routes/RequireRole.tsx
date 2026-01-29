import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export default function RequireRole({
  role,
  children,
}: {
  role: "admin" | "user";
  children: JSX.Element;
}) {
  const { user, ready } = useAuth();

  if (!ready) return null;

  if (!user) return <Navigate to="/auth/login" replace />;

  // user.role viene del enum Role, pero normalmente es "admin" o "user"
  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}