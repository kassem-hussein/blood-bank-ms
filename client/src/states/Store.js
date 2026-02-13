import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../states/slices/UserSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

