import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const fetchDaily = createAsyncThunk(
  "weightlog/fetchDaily",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/weightlog/weight/${userId}/daily/`);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchList = createAsyncThunk(
  "weightlog/fetchList",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/weightlog/weight/${userId}/`);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createRecord = createAsyncThunk(
  "weightlog/createRecord",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/weightlog/weight/add/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const slice = createSlice({
  name: "weightlog",
  initialState: {
    daily: [],
    list: [],
    status: "idle",
    createStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDaily.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDaily.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.daily = action.payload;
      })
      .addCase(fetchDaily.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchList.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createRecord.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        // if API returns created record, optionally push to list
        if (action.payload) state.list = [action.payload, ...state.list];
      })
      .addCase(createRecord.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const selectDaily = (state) => state.weightlog.daily || [];
export const selectList = (state) => state.weightlog.list || [];
export default slice.reducer;
