import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  authChecked: false, // Add a new flag to track if auth check has completed
};

const baseURL = process.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

// Create an axios instance with defaults
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  },
});

export const registerUser = createAsyncThunk(
  "/auth/register",
  async ({ email, username, fullName, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", {
        email,
        username,
        fullName,
        password,
      });
      
      if (response.status !== 201) {
        throw new Error(response.data.error || "Failed to create account");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/check-auth");
      return response.data;
    } catch (error) {
      // For auth check, we treat 401/403 as expected outcomes, not errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        return { success: false };
      }
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Even if logout fails, we clear auth state on client
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Check auth cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.authChecked = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.authChecked = true; // Mark auth check as completed
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true; // Mark auth check as completed even if it failed
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;