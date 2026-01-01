import { User, UserSliceState } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService, LoginCredentials, RegisterCredentials } from "@/Services/authService";
import toast from "react-hot-toast";

const initialState: UserSliceState = {
  user: null,
  isAuthenticated: false,
  isLoading: false, // No auto-check on load, ProtectedRoute handles auth
  error: null,
};



// --- Async Thunks ---

// Fetch User Data - Defined first as it's used by other thunks
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await authService.getProfile();
      return userData;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "Unauthorized") {
        return rejectWithValue("Unauthorized");
      }
      const message = error instanceof Error ? error.message : "Failed to fetch profile";
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      // Fetch full user profile - don't let this fail the login if it fails
      // as we already have basic user data in the response
      try {
        await dispatch(fetchUserData());
      } catch (profileError) {
        console.error("Failed to fetch full profile during login:", profileError);
      }

      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      return rejectWithValue(message);
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed";
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Logout failed";
      return rejectWithValue(message);
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
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        
        if (!state.user) {
             const authUser = action.payload.user;
             // fallback partial user
             const roles = Array.isArray(authUser.roles) 
                ? authUser.roles 
                : (typeof authUser.roles === 'string' ? [authUser.roles] : []);
             state.user = {
                id: authUser.id || "",
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
        state.isAuthenticated = false;
        state.error = null;
        toast.success("Logged out successfully");
      })

      // Fetch User Data
      .addCase(fetchUserData.pending, () => {
         // Optionally set loading here
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser, setLoading, setAuthError } = userSlice.actions;
export default userSlice.reducer;
