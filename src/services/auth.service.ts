import { api } from "./api";

type SuccessResponseDto<T> = {
  success: boolean;
  message: string;
  data: T;
};

type AuthTokenData = {
  access_token: string;
};

export async function loginApi(payload: {
  email: string;
  password: string;
}): Promise<string> {
  const { data } = await api.post<SuccessResponseDto<AuthTokenData>>(
    "/auth/login",
    payload
  );

  return data.data.access_token;
}

export async function registerApi(payload: {
  email: string;
  password: string;
}): Promise<void> {
  await api.post("/auth/register", payload);
}
