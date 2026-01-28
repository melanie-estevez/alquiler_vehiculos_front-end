import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "../services/api";

type User = {
  email: string;
  role: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

// ✅ AHORA SÍ SE EXPORTA (para que no rompa imports viejos)
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const res = await api.post("/auth/login", data);

    // tu backend responde { success, message, data: { access_token } }
    const token = res.data.data.access_token;

    localStorage.setItem("auth_token", token);

    // decodificar payload JWT: { sub, email, role }
    const payload = JSON.parse(atob(token.split(".")[1]));

    const userData: User = {
      email: payload.email,
      role: payload.role,
    };

    localStorage.setItem("auth_user", JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (data: { email: string; password: string }) => {
    await api.post("/auth/register", data);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
