
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  role: "admin" | "user";
  children: ReactNode;
};

export default function RequireRole({ role, children }: Props) {
  const { user, ready } = useAuth();

  if (!ready) return null;
  if (!user) return <Navigate to="/auth/login" replace />;

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
