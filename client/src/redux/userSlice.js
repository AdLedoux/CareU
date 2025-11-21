import { createSlice } from '@reduxjs/toolkit';

const savedUser = JSON.parse(localStorage.getItem('user')) || {
  user_id: "",
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
      const { user_id, username, age, gender, height, weight } = action.payload;
      state.user_id = user_id;
      state.username = username;
      state.age = age;
      state.gender = gender;
      state.height = height;
      state.weight = weight;

      localStorage.setItem('user', JSON.stringify(state));
    },
    clearUserInfo: (state) => {
      state.user_id = "";
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
