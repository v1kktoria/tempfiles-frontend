export interface TagDto {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagDto {
  name: string;
  color?: string;
}

export interface FileTagDto {
  id: string;
  fileId: string;
  tagId: string;
  tag: TagDto;
}

export interface TagState {
  tags: TagDto[];
  loading: boolean;
  error: string | null;
}
