import { ApiResponse } from "@/type/api";
import http from "@/utils/request";
export interface LoginParams {
  mobile: string;
  code: string;
}

export interface LoginData {
  token: string;
  refresh_token: string;
}

export const getLogin = (
  params: LoginParams,
): Promise<ApiResponse<LoginData>> => {
  return http.post<LoginData>("/authorizations", params);
};
