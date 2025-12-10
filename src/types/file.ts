import { TagDto } from "./tag";

export interface FileDto {
  id: string;
  filename: string;
  mimeType: string;
  size: string;
  description?: string;
  groupId?: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  tags: TagDto[];
}

export interface CreateFileDto {
  description?: string;
  expiresAt?: string;
  groupId?: string;
}

export interface UpdateFileDto {
  fileName?: string;
  description?: string;
}

export interface FileState {
  files: FileDto[];
  filesByTag: Record<string, FileDto[]>;
  filesByGroup: Record<string, FileDto[]>;
  loading: boolean;
  error: string | null;
}

export interface FileTagState {
  fileTags: Record<string, TagDto[]>;
  loading: boolean;
  error: string | null;
}
