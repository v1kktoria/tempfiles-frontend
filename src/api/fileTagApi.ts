import { api } from "../shared/api/axiosInstance";
import { TagDto, FileTagDto } from "../types/tag";

export const assignTagToFileApi = async (fileId: string, tagId: string): Promise<FileTagDto> => {
  const res = await api.post<FileTagDto>(`/file-tags/${fileId}/${tagId}`);
  return res.data;
};

export const getFileTagsApi = async (fileId: string): Promise<TagDto[]> => {
  const res = await api.get<TagDto[]>(`/file-tags/${fileId}`);
  return res.data;
};

export const removeTagFromFileApi = async (fileId: string, tagId: string): Promise<void> => {
  await api.delete(`/file-tags/${fileId}/${tagId}`);
};
