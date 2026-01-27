
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";  
export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }


  return {
    user: ctx.user,       
    token: ctx.token,     
    login: ctx.login,     
    register: ctx.register,  
    logout: ctx.logout,   
    isAdmin: ctx.isAdmin, 
  };
}
