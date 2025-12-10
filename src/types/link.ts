import { FileDto } from "./file";

export interface LinkDto {
  id: string;
  token: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  file: FileDto;
}

export interface CreateLinkDto {
  fileId: string;
  expiresAt?: string;
}
