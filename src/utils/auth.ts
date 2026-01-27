import { decodeJwt } from "./jwt";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;
  return decodeJwt(token);
}
