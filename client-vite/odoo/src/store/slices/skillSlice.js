import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import skillService from "../../services/skillService";

const initialState = {
  skills: [],
  currentSkill: null,
  popularSkills: [],
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
export const getAllSkills = createAsyncThunk(
  "skills/getAllSkills",
  async (params, thunkAPI) => {
    try {
      const response = await skillService.getAllSkills(params);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch skills";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const searchSkills = createAsyncThunk(
  "skills/searchSkills",
  async (query, thunkAPI) => {
    try {
      const response = await skillService.searchSkills(query);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to search skills";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPopularSkills = createAsyncThunk(
  "skills/getPopularSkills",
  async (limit, thunkAPI) => {
    try {
      const response = await skillService.getPopularSkills(limit);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch popular skills";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSkillsByCategory = createAsyncThunk(
  "skills/getSkillsByCategory",
  async (params, thunkAPI) => {
    try {
      const response = await skillService.getSkillsByCategory(params);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch skills by category";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSkillById = createAsyncThunk(
  "skills/getSkillById",
  async (skillId, thunkAPI) => {
    try {
      const response = await skillService.getSkillById(skillId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch skill";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const skillSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    clearSkills: (state) => {
      state.skills = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      };
    },
    clearCurrentSkill: (state) => {
      state.currentSkill = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Skills
      .addCase(getAllSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.skills = action.payload.skills;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Search Skills
      .addCase(searchSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.skills = action.payload.skills;
      })
      .addCase(searchSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Popular Skills
      .addCase(getPopularSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPopularSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.popularSkills =
          action.payload.data?.skills || action.payload.skills || [];
      })
      .addCase(getPopularSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Skills By Category
      .addCase(getSkillsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSkillsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.skills = action.payload.skills;
        state.pagination = action.payload.pagination;
      })
      .addCase(getSkillsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Skill By ID
      .addCase(getSkillById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSkillById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSkill = action.payload.skill;
      })
      .addCase(getSkillById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSkills, clearCurrentSkill, clearError } =
  skillSlice.actions;
export default skillSlice.reducer;
