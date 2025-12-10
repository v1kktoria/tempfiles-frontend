import { api } from "../shared/api/axiosInstance";
import { FileDto, CreateFileDto, UpdateFileDto } from "../types/file";

export const uploadFileApi = async (file: File, data?: CreateFileDto): Promise<FileDto> => {
  const formData = new FormData();
  formData.append("file", file);
  if (data?.description) formData.append("description", data.description);
  if (data?.expiresAt) formData.append("expiresAt", data.expiresAt);
  if (data?.groupId) formData.append("groupId", data.groupId);

  const res = await api.post("/files", formData, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
};

export const getUserFilesApi = async (): Promise<FileDto[]> => {
  const res = await api.get("/files");
  return res.data;
};

export const getFilesByTagApi = async (tagId: string): Promise<FileDto[]> => {
  const res = await api.get<FileDto[]>(`/files/tag/${tagId}`);
  return res.data;
};

export const getFilesByGroupApi = async (groupId: string): Promise<FileDto[]> => {
  const res = await api.get<FileDto[]>(`/files/group/${groupId}`);
  return res.data;
};

export const getFileDownloadUrlApi = async (fileId: string): Promise<string> => {
  const res = await api.get<string>(`/files/${fileId}/download-url`);
  return res.data;
};

export const updateFileApi = async (id: string, data: UpdateFileDto): Promise<FileDto> => {
  const res = await api.put(`/files/${id}`, data);
  return res.data;
};

export const deleteFileApi = async (id: string): Promise<void> => {
  await api.delete(`/files/${id}`);
};
