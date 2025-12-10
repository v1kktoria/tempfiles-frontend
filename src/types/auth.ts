import { UserDto } from "./user";

export interface LoginResponse {
  accessToken: string;
}

export interface AuthState {
  accessToken: string | null;
  user: UserDto | null;
  loading: boolean;
  error: string | null;
}
