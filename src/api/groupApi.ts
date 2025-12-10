import { api } from "../shared/api/axiosInstance";
import { AddUserToGroupDto, CreateGroupDto, GroupDto, UpdateGroupDto } from "../types/group";

export const getMyGroupsApi = async (): Promise<GroupDto[]> => {
  const res = await api.get("/groups/my");
  return res.data;
};

export const getMyRoleInGroupApi = async (groupId: string): Promise<{ role: string }> => {
  const res = await api.get(`/groups/${groupId}/me`);
  return res.data;
};

export const createGroupApi = async (dto: CreateGroupDto): Promise<GroupDto> => {
  const res = await api.post("/groups", dto);
  return res.data;
};

export const updateGroupApi = async (id: string, dto: UpdateGroupDto): Promise<GroupDto> => {
  const res = await api.put(`/groups/${id}`, dto);
  return res.data;
};

export const deleteGroupApi = async (id: string): Promise<void> => {
  await api.delete(`/groups/${id}`);
};

export const getGroupMembersApi = async (groupId: string): Promise<any[]> => {
  const res = await api.get(`/groups/${groupId}/members`);
  return res.data;
};

export const addUserToGroupApi = async (groupId: string, dto: AddUserToGroupDto): Promise<void> => {
  await api.post(`/groups/${groupId}/members`, dto);
};

export const removeUserFromGroupApi = async (groupId: string, userId: string): Promise<void> => {
  await api.delete(`/groups/${groupId}/members/${userId}`);
};

export const getGroupByIdApi = async (id: string): Promise<GroupDto> => {
  const res = await api.get(`/groups/${id}`);
  return res.data;
};

export const leaveGroupApi = async (groupId: string): Promise<void> => {
  await api.delete(`/groups/${groupId}/leave`);
};
