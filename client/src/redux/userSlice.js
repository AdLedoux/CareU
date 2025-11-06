import { createSlice } from '@reduxjs/toolkit';

const savedUser = JSON.parse(localStorage.getItem('user')) || {
  username: '',
  age: null,
  gender: '',
  height: null,
  weight: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: savedUser,
  reducers: {
    setUserInfo: (state, action) => {
      const { username, age, gender, height, weight } = action.payload;
      state.username = username;
      state.age = age;
      state.gender = gender;
      state.height = height;
      state.weight = weight;

      localStorage.setItem('user', JSON.stringify(state));
    },
    clearUserInfo: (state) => {
      state.username = '';
      state.age = null;
      state.gender = '';
      state.height = null;
      state.weight = null;

      localStorage.removeItem('user');
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
