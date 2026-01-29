import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export default function PublicOnly({
  children,
}: {
  children: JSX.Element;
}) {
  const { user } = useAuth();
  const token = localStorage.getItem("auth_token");

  if (user && token) {
    return <Navigate to="/" replace />;
  }

  return children;
}