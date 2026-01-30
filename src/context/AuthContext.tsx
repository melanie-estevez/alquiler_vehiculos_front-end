// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { decodeJwt } from "../utils/jwt";
import { loginApi, registerApi } from "../services/auth.service";
import { clientesService } from "../services/clientes.service";

export type AuthUser = {
  id: string;
  email: string;
  role: "admin" | "user";
};

type Credentials = { email: string; password: string };

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  ready: boolean;
  isAdmin: boolean;

  login: (payload: Credentials) => Promise<void>;
  register: (payload: Credentials) => Promise<void>;
  logout: () => void;
  refreshFromToken: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LS_TOKEN = "auth_token";

// payload real del backend (AuthService): { sub, email, role, exp }
type JwtPayload = {
  sub: string;
  email: string;
  role: "admin" | "user";
  exp?: number; // seconds (JWT standard)
  iat?: number;
};

function isExpired(payload: JwtPayload) {
  if (!payload?.exp) return false; // si tu backend no manda exp, no bloqueamos
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSec;
}

function parseUserFromToken(token: string): AuthUser | null {
  const payload = decodeJwt<JwtPayload>(token);
  if (!payload?.sub || !payload?.email || !payload?.role) return null;
  if (isExpired(payload)) return null;

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const hardClearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(LS_TOKEN);

    // ✅ caches que NO deben quedar entre usuarios/sesiones
    clientesService.clearCache();
    localStorage.removeItem("factura_by_reserva");
  };

  const refreshFromToken = () => {
    const t = localStorage.getItem(LS_TOKEN);
    if (!t) {
      setToken(null);
      setUser(null);
      return;
    }

    const u = parseUserFromToken(t);

    // ✅ si token es inválido/expirado -> limpiamos
    if (!u) {
      hardClearAuth();
      return;
    }

    setToken(t);
    setUser(u);
  };

  useEffect(() => {
    refreshFromToken();
    setReady(true);

    // ✅ si abres otra pestaña y haces logout/login, sincroniza estado
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_TOKEN) refreshFromToken();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAdmin = useMemo(() => user?.role === "admin", [user?.role]);

  const login = async ({ email, password }: Credentials) => {
    const t = await loginApi({ email, password });

    localStorage.setItem(LS_TOKEN, t);

    const u = parseUserFromToken(t);
    if (!u) {
      // token inválido -> no dejamos sesión “a medias”
      hardClearAuth();
      throw new Error("Token inválido devuelto por el backend.");
    }

    setToken(t);
    setUser(u);

    // ✅ IMPORTANTÍSIMO: si antes cacheaste 404, borra cache al entrar
    clientesService.clearCache();
  };

  const register = async ({ email, password }: Credentials) => {
    const t = await registerApi({ email, password });

    localStorage.setItem(LS_TOKEN, t);

    const u = parseUserFromToken(t);
    if (!u) {
      hardClearAuth();
      throw new Error("Token inválido devuelto por el backend.");
    }

    setToken(t);
    setUser(u);
    clientesService.clearCache();
  };

  const logout = () => {
    hardClearAuth();
  };

  const value: AuthContextValue = {
    user,
    token,
    ready,
    isAdmin,
    login,
    register,
    logout,
    refreshFromToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
