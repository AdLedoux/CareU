import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: '',
  age: null,
  height: null,
  weight: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.username = action.payload.username;
      state.age = action.payload.age;
      state.height = action.payload.height;
      state.weight = action.payload.weight;
    }
  },
})

export const { setUserInfo } = userSlice.actions

export default userSlice.reducer