import { api } from "./api";

type SuccessResponseDto<T> = {
  success: boolean;
  message: string;
  data: T;
};

type AuthTokenData = {
  access_token: string;
};

const TOKEN_KEY = "auth_token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginApi(payload: {
  email: string;
  password: string;
}): Promise<string> {
  const res = await api.post<SuccessResponseDto<AuthTokenData>>(
    "/auth/login",
    payload
  );

  const token = res.data?.data?.access_token;
  if (!token) throw new Error("No token in login response");

  saveToken(token);
  return token;
}

export async function registerApi(payload: {
  email: string;
  password: string;
}): Promise<string> {
  const res = await api.post<SuccessResponseDto<AuthTokenData> | any>(
    "/auth/register",
    payload
  );

  const token = res?.data?.data?.access_token;

  if (token) {
    saveToken(token);
    return token;
  }

  const loginToken = await loginApi(payload);
  return loginToken;
}