// Services/authService.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    userName: string;
    email: string;
    roles: string[];
  };
}

export interface ForgotPasswordResponse {
  message: string;
  token: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/User/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Login failed");
    }

    return response.json();
  }

  async register(
    credentials: RegisterCredentials
  ): Promise<{ message: string; role: string }> {
    const response = await fetch(`${API_BASE_URL}/User/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Registration failed");
    }

    return response.json();
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const response = await fetch(`${API_BASE_URL}/User/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Password reset failed");
    }

    return response.json();
  }

  async googleLogin(accessToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/User/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Google login failed");
    }

    return response.json();
  }

  async facebookLogin(accessToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/User/facebook-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Facebook login failed");
    }

    return response.json();
  }

  async logout(): Promise<void> {
    // Clear token from cookies
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  // Helper to get token from cookies
  getToken(): string | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token=")
    );
    return tokenCookie ? decodeURIComponent(tokenCookie.split("=")[1]) : null;
  }

  // Helper to set token in cookies
  setToken(token: string): void {
    if (typeof document === "undefined") return;

    // Set cookie with 30 days expiration
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    const secureFlag = process.env.NODE_ENV === "production" ? "secure; " : "";
    document.cookie = `token=${encodeURIComponent(
      token
    )}; expires=${expirationDate.toUTCString()}; path=/; ${secureFlag}samesite=lax`;
  }
}

export const authService = new AuthService();
