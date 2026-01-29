import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  const token = localStorage.getItem("auth_token");

  return {
    user: ctx.user,
    token,                 
    login: ctx.login,
    register: ctx.register,
    logout: ctx.logout,
    isAdmin: ctx.isAdmin,
  };
}