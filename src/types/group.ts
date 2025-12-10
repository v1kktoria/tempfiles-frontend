export interface GroupDto {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupDto {
  name: string;
  description?: string;
}

export interface UpdateGroupDto {
  name?: string;
  description?: string;
}

export interface AddUserToGroupDto {
  email: string;
}

export interface GroupState {
  groups: GroupDto[];
  currentGroup: GroupDto | null;
  members: Record<string, any[]>;
  userRoles: Record<string, string>;
  loading: boolean;
  error: string | null;
}
