import { configureStore } from '@reduxjs/toolkit';
import userSlice from './Slice/userSlice';
import loadingSlice from './Slice/loadingSlice';

export const store = configureStore({
  reducer: { userSlice, loadingSlice },
});
