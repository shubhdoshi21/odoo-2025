import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  users: [],
  currentUser: user || null,
  topRatedUsers: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (params, thunkAPI) => {
    try {
      const response = await userService.getAllUsers(params);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch users";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (params, thunkAPI) => {
    try {
      const response = await userService.searchUsers(params);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to search users";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTopRatedUsers = createAsyncThunk(
  "users/getTopRatedUsers",
  async (limit, thunkAPI) => {
    try {
      const response = await userService.getTopRatedUsers(limit);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch top rated users";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (userId, thunkAPI) => {
    try {
      const response = await userService.getUserById(userId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUsersBySkill = createAsyncThunk(
  "users/getUsersBySkill",
  async (params, thunkAPI) => {
    try {
      const response = await userService.getUsersBySkill(params);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch users by skill";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      };
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Top Rated Users
      .addCase(getTopRatedUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTopRatedUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topRatedUsers =
          action.payload.data?.users || action.payload.users || [];
      })
      .addCase(getTopRatedUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get User By ID
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Users By Skill
      .addCase(getUsersBySkill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsersBySkill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(getUsersBySkill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUsers, clearCurrentUser, clearError, setCurrentUser } =
  userSlice.actions;
export default userSlice.reducer;
