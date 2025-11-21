import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const fetchMoods = createAsyncThunk(
  "mood/fetchMoods",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/mood/moods/${userId}/`);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createMood = createAsyncThunk(
  "mood/createMood",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/mood/moods/add/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const moodSlice = createSlice({
  name: "mood",
  initialState: {
    items: [],
    status: "idle",
    createStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoods.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMoods.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMoods.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(createMood.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createMood.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        // prepend new record so UI shows latest first
        state.items = [action.payload, ...state.items];
      })
      .addCase(createMood.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const selectMoods = (state) => state.mood.items || [];
export const selectMoodStatus = (state) => state.mood.status;
export default moodSlice.reducer;
