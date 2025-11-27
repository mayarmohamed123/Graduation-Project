import { User } from "./user";

// Re-export User for backward compatibility
export type { User };

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  phonenumber: string;
  address: string;
  password: string;
  confirmpassword: string;
  role: string;
}
