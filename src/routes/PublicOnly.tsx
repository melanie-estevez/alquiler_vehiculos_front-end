import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export default function PublicOnly({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, token } = useAuth();

  
  if (user && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
