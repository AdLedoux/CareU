import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const fetchFitness = createAsyncThunk(
  "fitness/fetchFitness",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/fitness/${userId}/`);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createFitness = createAsyncThunk(
  "fitness/createFitness",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/fitness/add/`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const slice = createSlice({
  name: "fitness",
  initialState: {
    items: [],
    status: "idle",
    createStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFitness.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFitness.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFitness.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(createFitness.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        if (action.payload) state.items = [action.payload, ...state.items];
      })
      .addCase(createFitness.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const selectFitness = (state) => state.fitness.items || [];
export default slice.reducer;
