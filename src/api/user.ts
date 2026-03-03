import type { ApiResponse } from "@/type/api";
import http from "@/utils/request";

export interface UserResponse {
  id: string;
  birthday: string;
  gender: number;
  mobile: string;
  name: string;
  photo: string;
}

export const getUserInfo = async (): Promise<ApiResponse<UserResponse>> => {
  const res = await http.get<UserResponse>("/user/profile");
  return res;
};
