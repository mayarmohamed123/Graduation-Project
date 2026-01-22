import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { userService } from "@/Services/userService";
import { adminService } from "@/Services/admin/adminService";
import { Notification } from "@/types";

interface NotificationState {
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  unreadCount: 0,
  isLoading: false,
  error: null,
};

interface NotificationResponse {
  notifications?: Notification[];
  appointmentRequests?: Notification[];
  orders?: Notification[];
  appointments?: Notification[];
}

export const fetchUnreadCount = createAsyncThunk(
  "notification/fetchUnreadCount",
  async (role: "admin" | "user" | "doctor" | "pharmacy", { rejectWithValue }) => {
    console.log(`[NotificationSlice] fetchUnreadCount called with role: ${role}`);
    try {
      let unreadCount = 0;
      let response: NotificationResponse;

      if (role === "admin") {
        response = await adminService.getAdminNotifications();
      } else {
        // All other roles call the user notifications endpoint
        response = await userService.getUserNotifications();
      }

      console.log(`[NotificationSlice] Raw response for ${role}:`, response);

      // Handle different response shapes safely
      const getUnreadCountHelper = (arr: Notification[] | undefined) => 
        (arr || []).filter((n: Notification) => !n.isRead).length;

      if (response.notifications) {
        // Admin and Pharmacy often use this
        unreadCount = getUnreadCountHelper(response.notifications);
      } else if (response.appointmentRequests) {
        // Doctor often uses this
        unreadCount = getUnreadCountHelper(response.appointmentRequests);
      } else if (response.orders || response.appointments) {
        // Regular user uses this
        unreadCount = getUnreadCountHelper(response.orders) + getUnreadCountHelper(response.appointments);
      }

      console.log(`[NotificationSlice] Calculated ${role} unread count: ${unreadCount}`);
      return unreadCount;
    } catch (error: unknown) {
      console.error(`[NotificationSlice] Error fetching unread count for ${role}:`, error);
      const message = error instanceof Error ? error.message : "Failed to fetch notification count";
      return rejectWithValue(message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    clearNotificationError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setUnreadCount, 
  incrementUnreadCount, 
  decrementUnreadCount, 
  clearNotificationError 
} = notificationSlice.actions;

export default notificationSlice.reducer;
