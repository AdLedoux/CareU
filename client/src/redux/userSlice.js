// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  age: null,
  gender: '',
  height: null,
  weight: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      const { username, age, gender, height, weight } = action.payload;
      state.username = username;
      state.age = age;
      state.gender = gender;
      state.height = height;
      state.weight = weight;
    },
    clearUserInfo: (state) => {
      state.username = '';
      state.age = null;
      state.gender = '';
      state.height = null;
      state.weight = null;
    }
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
