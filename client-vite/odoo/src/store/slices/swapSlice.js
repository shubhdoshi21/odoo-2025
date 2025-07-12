import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import swapService from "../../services/swapService";

const initialState = {
  swaps: [],
  currentSwap: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const getUserSwaps = createAsyncThunk(
  "swaps/getUserSwaps",
  async (params, thunkAPI) => {
    try {
      const response = await swapService.getUserSwaps(params);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to get swaps";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPendingSwaps = createAsyncThunk(
  "swaps/getPendingSwaps",
  async (_, thunkAPI) => {
    try {
      const response = await swapService.getPendingSwaps();
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to get pending swaps";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSwapById = createAsyncThunk(
  "swaps/getSwapById",
  async (swapId, thunkAPI) => {
    try {
      const response = await swapService.getSwapById(swapId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to get swap";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createSwap = createAsyncThunk(
  "swaps/createSwap",
  async (swapData, thunkAPI) => {
    try {
      const response = await swapService.createSwap(swapData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create swap";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateSwap = createAsyncThunk(
  "swaps/updateSwap",
  async ({ swapId, updateData }, thunkAPI) => {
    try {
      const response = await swapService.updateSwap(swapId, updateData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update swap";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const acceptSwap = createAsyncThunk(
  "swaps/acceptSwap",
  async (swapId, thunkAPI) => {
    try {
      const response = await swapService.acceptSwap(swapId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to accept swap";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const rejectSwap = createAsyncThunk(
  "swaps/rejectSwap",
  async ({ swapId, reason }, thunkAPI) => {
    try {
      const response = await swapService.rejectSwap(swapId, reason);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to reject swap";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cancelSwap = createAsyncThunk(
  "swaps/cancelSwap",
  async ({ swapId, reason }, thunkAPI) => {
    try {
      const response = await swapService.cancelSwap(swapId, reason);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to cancel swap";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const completeSwap = createAsyncThunk(
  "swaps/completeSwap",
  async (swapId, thunkAPI) => {
    try {
      const response = await swapService.completeSwap(swapId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to complete swap";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteSwap = createAsyncThunk(
  "swaps/deleteSwap",
  async (swapId, thunkAPI) => {
    try {
      const response = await swapService.deleteSwap(swapId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete swap";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const swapSlice = createSlice({
  name: "swaps",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSwap: (state) => {
      state.currentSwap = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Swaps
      .addCase(getUserSwaps.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserSwaps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.swaps = action.payload.data.swaps || [];
      })
      .addCase(getUserSwaps.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Pending Swaps
      .addCase(getPendingSwaps.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPendingSwaps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.swaps = action.payload.data.swaps || [];
      })
      .addCase(getPendingSwaps.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Swap By ID
      .addCase(getSwapById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSwapById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSwap = action.payload.data.swap;
      })
      .addCase(getSwapById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Swap
      .addCase(createSwap.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSwap.fulfilled, (state, action) => {
        state.isLoading = false;
        state.swaps.unshift(action.payload.data.swap);
      })
      .addCase(createSwap.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Swap
      .addCase(updateSwap.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSwap.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedSwap = action.payload.data.swap;
        const index = state.swaps.findIndex(
          (swap) => swap._id === updatedSwap._id
        );
        if (index !== -1) {
          state.swaps[index] = updatedSwap;
        }
        if (state.currentSwap && state.currentSwap._id === updatedSwap._id) {
          state.currentSwap = updatedSwap;
        }
      })
      .addCase(updateSwap.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Accept Swap
      .addCase(acceptSwap.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptSwap.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedSwap = action.payload.data.swap;
        const index = state.swaps.findIndex(
          (swap) => swap._id === updatedSwap._id
        );
        if (index !== -1) {
          state.swaps[index] = updatedSwap;
        }
        if (state.currentSwap && state.currentSwap._id === updatedSwap._id) {
          state.currentSwap = updatedSwap;
        }
      })
      .addCase(acceptSwap.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Reject Swap
      .addCase(rejectSwap.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectSwap.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedSwap = action.payload.data.swap;
        const index = state.swaps.findIndex(
          (swap) => swap._id === updatedSwap._id
        );
        if (index !== -1) {
          state.swaps[index] = updatedSwap;
        }
        if (state.currentSwap && state.currentSwap._id === updatedSwap._id) {
          state.currentSwap = updatedSwap;
        }
      })
      .addCase(rejectSwap.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel Swap
      .addCase(cancelSwap.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelSwap.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedSwap = action.payload.data.swap;
        const index = state.swaps.findIndex(
          (swap) => swap._id === updatedSwap._id
        );
        if (index !== -1) {
          state.swaps[index] = updatedSwap;
        }
        if (state.currentSwap && state.currentSwap._id === updatedSwap._id) {
          state.currentSwap = updatedSwap;
        }
      })
      .addCase(cancelSwap.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Complete Swap
      .addCase(completeSwap.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeSwap.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedSwap = action.payload.data.swap;
        const index = state.swaps.findIndex(
          (swap) => swap._id === updatedSwap._id
        );
        if (index !== -1) {
          state.swaps[index] = updatedSwap;
        }
        if (state.currentSwap && state.currentSwap._id === updatedSwap._id) {
          state.currentSwap = updatedSwap;
        }
      })
      .addCase(completeSwap.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Swap
      .addCase(deleteSwap.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSwap.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedSwapId = action.payload.data.swap._id;
        state.swaps = state.swaps.filter((swap) => swap._id !== deletedSwapId);
        if (state.currentSwap && state.currentSwap._id === deletedSwapId) {
          state.currentSwap = null;
        }
      })
      .addCase(deleteSwap.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentSwap } = swapSlice.actions;
export default swapSlice.reducer;
