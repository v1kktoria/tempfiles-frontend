import { api } from "../shared/api/axiosInstance";
import { CreateLinkDto, LinkDto } from "../types/link";

export const createLinkApi = async (data: CreateLinkDto): Promise<LinkDto> => {
  const res = await api.post<LinkDto>("/links", data);
  return res.data;
};

export const getUserLinksApi = async (): Promise<LinkDto[]> => {
  const res = await api.get<LinkDto[]>("/links");
  return res.data;
};

export const getLinkDetailsApi = async (token: string): Promise<LinkDto> => {
  const res = await api.get<LinkDto>(`/links/${token}`);
  return res.data;
};

export const getDownloadUrlApi = async (token: string): Promise<string> => {
  const res = await api.get<string>(`/links/${token}/download`);
  return res.data;
};

export const deactivateLinkApi = async (token: string): Promise<void> => {
  await api.delete(`/links/${token}`);
};

export const activateLinkApi = async (token: string): Promise<LinkDto> => {
  const res = await api.put<LinkDto>(`/links/${token}`);
  return res.data;
};
