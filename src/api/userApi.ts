import { api } from "../shared/api/axiosInstance";
import { UserDto, UpdateUserDto } from "../types/user";

export const getUsersApi = async (): Promise<UserDto[]> => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserByIdApi = async (id: string): Promise<UserDto> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUserApi = async (id: string, userData: UpdateUserDto): Promise<UserDto> => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUserApi = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const banUserApi = async (id: string): Promise<UserDto> => {
  const response = await api.put(`/users/${id}/ban`);
  return response.data;
};

export const unbanUserApi = async (id: string): Promise<UserDto> => {
  const response = await api.put(`/users/${id}/unban`);
  return response.data;
};
