import { api } from "../shared/api/axiosInstance";
import { LoginResponse } from "../types/auth";
import { UserDto } from "../types/user";

export const refreshTokensApi = async (): Promise<LoginResponse> => {
  const res = await api.post("/auth/refresh");
  return res.data;
};

export const getCurrentUserApi = async (): Promise<UserDto> => {
  const res = await api.get<UserDto>("/auth/me");
  return res.data;
};
