import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Thunk untuk mengambil profil user
export const fetchOwnProfile = createAsyncThunk(
  'auth/fetchOwnProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await api.getOwnProfile();
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk untuk login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const token = await api.login({ email, password });
      api.putAccessToken(token);
      const profile = await api.getOwnProfile();
      return profile;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk untuk register
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.register(userData);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk untuk logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      api.putAccessToken('');
      return null;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  user: null,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    logout(state) {
      state.user = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOwnProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchOwnProfile.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
      });
  },
});

export const { setUser, setStatus, logout } = authSlice.actions;
export default authSlice.reducer;
