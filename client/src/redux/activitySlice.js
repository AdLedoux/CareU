import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api"; // 你的 axios 实例

export const fetchDailyActivity = createAsyncThunk(
  "activity/fetchDaily",
  async (username) => {
    const response = await api.get(`/activity/user/${username}/activity/`);
    return response.data;
  }
);
export const fetchWeeklyActivity = createAsyncThunk(
  "activity/fetchWeekly",
  async ({ username, year, week }) => {
    const response = await api.get(
      `/activity/user/${username}/activity/weekly/`,
      { params: { year, week } }
    );
    return response.data;
  }
);

export const fetchWeeklyCalories = createAsyncThunk(
  "activity/fetchWeeklyCalories",
  async ({ username, year, week }) => {
    const response = await api.get(
      `/activity/user/${username}/activity/weekly/calories/`,
      { params: { year, week } }
    );
    return response.data;
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    daily: [],
    weekly: {},
    weeklyCalories: {},
    status: "idle",
    error: null,
  },
  reducers: {
    clearActivity: (state) => {
      state.daily = [];
      state.weekly = {};
      state.weeklyCalories = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyActivity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDailyActivity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.daily = action.payload;
      })
      .addCase(fetchDailyActivity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchWeeklyActivity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWeeklyActivity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.weekly = action.payload;
      })
      .addCase(fetchWeeklyActivity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchWeeklyCalories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWeeklyCalories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.weeklyCalories = action.payload;
      })
      .addCase(fetchWeeklyCalories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearActivity } = activitySlice.actions;
export default activitySlice.reducer;
