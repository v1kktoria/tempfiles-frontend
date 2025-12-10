import { api } from "../shared/api/axiosInstance";
import { TagDto, CreateTagDto } from "../types/tag";

export const createTagApi = async (data: CreateTagDto): Promise<TagDto> => {
  const res = await api.post<TagDto>("/tags", data);
  return res.data;
};

export const getAllTagsApi = async (): Promise<TagDto[]> => {
  const res = await api.get<TagDto[]>("/tags");
  return res.data;
};

export const deleteTagApi = async (id: string): Promise<void> => {
  await api.delete(`/tags/${id}`);
};
