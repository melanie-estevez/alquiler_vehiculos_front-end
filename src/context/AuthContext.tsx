import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { loginApi, registerApi } from "../services/auth.service";
import { decodeJwt } from "../utils/jwt";
import { Role } from "../utils/roles";

type User = {
  email: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("auth_token")
  );

  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  });

  const saveFromToken = (token: string) => {
    const payload = decodeJwt(token);
    if (!payload) return;

    const newUser: User = {
      email: payload.email,
      role: payload.role as Role, // ✔ ahora sí coincide
    };

    setUser(newUser);
    setToken(token);

    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const login = async (payload: { email: string; password: string }) => {
    const token = await loginApi(payload);
    saveFromToken(token);
  };

  const register = async (payload: { email: string; password: string }) => {
    await registerApi(payload);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      isAdmin: user?.role === Role.ADMIN,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
