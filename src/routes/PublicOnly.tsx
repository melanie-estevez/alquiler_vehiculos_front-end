import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export default function PublicOnly({ children }: { children: JSX.Element }) {
  const { user, token, ready } = useAuth();

  if (!ready) return null;

  if (user && token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
