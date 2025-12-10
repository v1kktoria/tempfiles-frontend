export interface UserDto {
  id: string;
  email: string;
  name?: string;
  role?: string;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  name?: string;
  role?: string;
}

export interface UsersState {
  users: UserDto[];
  currentUser: UserDto | null;
  loading: boolean;
  error: string | null;
}
