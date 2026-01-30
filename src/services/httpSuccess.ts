import type { AxiosResponse } from "axios";

export type SuccessResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export function unwrapSuccess<T>(res: AxiosResponse<SuccessResponse<T>>): T {
  return res.data.data;
}
