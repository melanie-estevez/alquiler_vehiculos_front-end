import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { loginApi, registerApi } from "../services/auth.service";
import { decodeJwt } from "../utils/jwt";
import { Role } from "../utils/roles";
import { clientesService } from "../services/clientes.service";

type User = {
  email: string;
  role: Role;
  id_cliente?: string | null;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  ready: boolean;

  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;

  isAdmin: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("auth_token")
  );

  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("auth_user");
    return raw ? (JSON.parse(raw) as User) : null;
  });

  const [ready, setReady] = useState(false);

  const saveFromToken = (jwtToken: string) => {
    setToken(jwtToken);
    localStorage.setItem("auth_token", jwtToken);

    const payload = decodeJwt<{ email: string; role: Role }>(jwtToken);

    if (!payload?.email || !payload?.role) {
      setToken(null);
      setUser(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      throw new Error("Token inválido: no se pudo leer email/role");
    }

    const nextUser: User = {
      email: payload.email,
      role: payload.role,
      id_cliente: null,
    };

    setUser(nextUser);
    localStorage.setItem("auth_user", JSON.stringify(nextUser));
  };

  const tryLoadCliente = async (jwtToken: string) => {
    const payload = decodeJwt<{ email: string; role: Role }>(jwtToken);
    if (!payload?.role) return;

    if (payload.role === Role.ADMIN) return;

    const me = await clientesService.getCliente(); 
    if (!me?.id_cliente) return;

    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, id_cliente: me.id_cliente };
      localStorage.setItem("auth_user", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const boot = async () => {
      const savedToken = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("auth_user");

      if (savedToken && !savedUser) {
        try {
          saveFromToken(savedToken);
        } catch {
          setReady(true);
          return;
        }
      }

      if (savedToken) {
        try {
          await tryLoadCliente(savedToken);
        } catch {
        }
      }

      setReady(true);
    };

    boot();
  }, []);

  const login = async (payload: { email: string; password: string }) => {
    const jwtToken = await loginApi(payload);
    saveFromToken(jwtToken);

    try {
      await tryLoadCliente(jwtToken);
    } catch {
    }
  };

  const register = async (payload: { email: string; password: string }) => {
    await registerApi(payload);

    const jwtToken = await loginApi(payload);
    saveFromToken(jwtToken);

    try {
      await tryLoadCliente(jwtToken);
    } catch {
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  const isAdmin = user?.role === Role.ADMIN;

  const value = useMemo(
    () => ({ user, token, ready, login, register, logout, isAdmin }),
    [user, token, ready, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}