import { createSlice } from '@reduxjs/toolkit';
import { getLocalStorage } from '../../utils/localStorage';

const initialState = {
  user: getLocalStorage('LOGIN_USER'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    handleGetValueUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { handleGetValueUser } = userSlice.actions;

export default userSlice.reducer;
