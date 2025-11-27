export interface User {
  id: string;
  email: string;
  userName: string;
  roles?: string[];
  phoneNumber?: string;
  profileImage?: string;
  address?: string;
}

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
