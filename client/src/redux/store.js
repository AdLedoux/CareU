import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moodReducer from "./moodSlice";
import weightlogReducer from "./weightlogSlice";
import fitnessReducer from "./fitnessSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    mood: moodReducer,
    weightlog: weightlogReducer,
    fitness: fitnessReducer,
  },
});
