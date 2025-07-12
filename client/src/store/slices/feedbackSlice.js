import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import feedbackService from "../../services/feedbackService";

const initialState = {
  feedback: [],
  currentFeedback: null,
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
export const getUserFeedback = createAsyncThunk(
  "feedback/getUserFeedback",
  async (params, thunkAPI) => {
    try {
      const response = await feedbackService.getUserFeedback(params);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch feedback";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getFeedbackForUser = createAsyncThunk(
  "feedback/getFeedbackForUser",
  async (userId, thunkAPI) => {
    try {
      const response = await feedbackService.getFeedbackForUser(userId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user feedback";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getFeedbackForSwap = createAsyncThunk(
  "feedback/getFeedbackForSwap",
  async (swapId, thunkAPI) => {
    try {
      const response = await feedbackService.getFeedbackForSwap(swapId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch swap feedback";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getFeedbackById = createAsyncThunk(
  "feedback/getFeedbackById",
  async (feedbackId, thunkAPI) => {
    try {
      const response = await feedbackService.getFeedbackById(feedbackId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch feedback";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createFeedback = createAsyncThunk(
  "feedback/createFeedback",
  async (feedbackData, thunkAPI) => {
    try {
      const response = await feedbackService.createFeedback(feedbackData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create feedback";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateFeedback = createAsyncThunk(
  "feedback/updateFeedback",
  async ({ feedbackId, updateData }, thunkAPI) => {
    try {
      const response = await feedbackService.updateFeedback(
        feedbackId,
        updateData
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update feedback";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  "feedback/deleteFeedback",
  async (feedbackId, thunkAPI) => {
    try {
      const response = await feedbackService.deleteFeedback(feedbackId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete feedback";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    clearFeedback: (state) => {
      state.feedback = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      };
    },
    clearCurrentFeedback: (state) => {
      state.currentFeedback = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Feedback
      .addCase(getUserFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedback = action.payload.feedback;
        state.pagination = action.payload.pagination;
      })
      .addCase(getUserFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Feedback For User
      .addCase(getFeedbackForUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedbackForUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedback = action.payload.feedback;
        state.pagination = action.payload.pagination;
      })
      .addCase(getFeedbackForUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Feedback For Swap
      .addCase(getFeedbackForSwap.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedbackForSwap.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedback = action.payload.feedback;
        state.pagination = action.payload.pagination;
      })
      .addCase(getFeedbackForSwap.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Feedback By ID
      .addCase(getFeedbackById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedbackById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentFeedback = action.payload.feedback;
      })
      .addCase(getFeedbackById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Feedback
      .addCase(createFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedback.unshift(action.payload.feedback);
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Feedback
      .addCase(updateFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.feedback.findIndex(
          (feedback) => feedback._id === action.payload.feedback._id
        );
        if (index !== -1) {
          state.feedback[index] = action.payload.feedback;
        }
        if (
          state.currentFeedback &&
          state.currentFeedback._id === action.payload.feedback._id
        ) {
          state.currentFeedback = action.payload.feedback;
        }
      })
      .addCase(updateFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Feedback
      .addCase(deleteFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedback = state.feedback.filter(
          (feedback) => feedback._id !== action.payload.feedback._id
        );
        if (
          state.currentFeedback &&
          state.currentFeedback._id === action.payload.feedback._id
        ) {
          state.currentFeedback = null;
        }
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFeedback, clearCurrentFeedback, clearError } =
  feedbackSlice.actions;
export default feedbackSlice.reducer;
