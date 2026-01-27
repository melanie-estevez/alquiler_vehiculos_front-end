import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";
import { Role } from "../utils/roles";

interface Props {
  role: Role;
  children: ReactNode;
}

export default function RequireRole({ role, children }: Props) {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
