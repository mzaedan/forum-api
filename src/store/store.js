import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/auth';
import threadsReducer from '../reducers/threads';

const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
  },
});

export { store };
