import { User, UserSliceState } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService, LoginCredentials, RegisterCredentials } from "@/Services/authService";
import toast from "react-hot-toast";

const initialState: UserSliceState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start true to check auth on load
  error: null,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- Async Thunks ---

// Fetch User Data - Defined first as it's used by other thunks
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (token: string, { rejectWithValue }) => {
    try {
      if (!API_BASE_URL) {
        throw new Error("API base URL is not configured");
      }

      const response = await fetch(`${API_BASE_URL}/User/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to fetch user profile information"
        );
      }

      const userData: User = await response.json();
      return userData;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to fetch user profile information";
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      authService.setToken(response.token);
      
      // Fetch full user profile immediately
      await dispatch(fetchUserData(response.token));

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (data: RegisterCredentials, { dispatch, rejectWithValue }) => {
    try {
      await authService.register(data);
      // Auto login after registration
      const loginResponse = await dispatch(loginUser({ 
        email: data.email, 
        password: data.password 
      })).unwrap();
      return loginResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return;
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = authService.getToken();
      if (!token) {
        return null;
      }
      // Ideally verify token here or fetch user profile
      const user = await dispatch(fetchUserData(token)).unwrap();
      return { token, user };
    } catch (error: any) {
      // If fetching user fails (e.g. token expired), we should probably logout
      // But for now let's just return null or let the error propagate if strictly needed
      // authService.logout(); 
      return rejectWithValue(error.message || "Session expired");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        // User data should be updated by fetchUserData since we dispatched it
        // But if fetchUserData fails or hasn't finished (shouldn't happen with await), 
        // we might have partial data.
        // However, since we await fetchUserData in the thunk, fetchUserData.fulfilled 
        // action should have already run (or failed) before loginUser.fulfilled runs!
        // Wait, no. Thunk execution: dispatch(fetchUserData) -> await -> done.
        // fetchUserData.fulfilled reduces FIRST. 
        // Then loginUser returns -> loginUser.fulfilled reduces.
        // So state.user IS ALREADY SET by fetchUserData fulfilled reducer!
        // We don't need to overwrite it with partial data here.
        // Only if state.user is null (fetch failed?)
        if (!state.user) {
             const authUser = action.payload.user;
             // fallback partial user
             const roles = Array.isArray(authUser.roles) 
                ? authUser.roles 
                : (typeof authUser.roles === 'string' ? [authUser.roles] : []);
             state.user = {
                id: "",
                email: authUser.email,
                userName: authUser.userName,
                roles: roles,
             };
        }
        
        toast.success("Login successful!");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || "Login failed");
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        // Login handles the rest
        toast.success("Registration successful!");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || "Registration failed");
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        toast.success("Logged out successfully");
      })

      // Fetch User Data
      .addCase(fetchUserData.pending, (state) => {
         // Optionally set loading here
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        // If we have user data, we are authenticated (if called separatedly)
        // But checkAuth handles the main flag
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser, setLoading, setAuthError } = userSlice.actions;
export default userSlice.reducer;
