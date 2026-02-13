import { createSlice } from '@reduxjs/toolkit';
const storedUser = JSON.parse(localStorage.getItem('blood-app-user'));

const initialState = {
  isAuthenticated: !!storedUser,
  user: storedUser?.user || null,
  token: storedUser?.token || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token
      localStorage.setItem('blood-app-user', JSON.stringify(action.payload));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('blood-app-user');
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;