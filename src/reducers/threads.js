import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Thunk untuk handle voting thread
export const voteThread = createAsyncThunk(
  'threads/voteThread',
  async ({ threadId, voteType }, { rejectWithValue, dispatch }) => {
    try {
      await api.voteThread(threadId, voteType);
      // Setelah vote berhasil, refresh data threads
      dispatch(fetchThreadsAndUsers());
      return { threadId, voteType };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk untuk menetralkan vote thread
export const neutralizeThreadVote = createAsyncThunk(
  'threads/neutralizeThreadVote',
  async (threadId, { rejectWithValue, dispatch }) => {
    try {
      await api.neutralizeThreadVote(threadId);
      // Setelah netralkan vote berhasil, refresh data threads
      dispatch(fetchThreadsAndUsers());
      return threadId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk untuk fetch threads dan users
export const fetchThreadDetail = createAsyncThunk(
  'threads/fetchThreadDetail',
  async (threadId, { rejectWithValue }) => {
    try {
      const data = await api.getThreadDetail(threadId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const fetchThreadsAndUsers = createAsyncThunk(
  'threads/fetchThreadsAndUsers',
  async (_, { rejectWithValue }) => {
    try {
      const [threads, users] = await Promise.all([
        api.getAllThreads(),
        api.getAllUsers(),
      ]);
      return { threads, users };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk untuk membuat thread baru
export const createThread = createAsyncThunk(
  'threads/createThread',
  async (threadData, { rejectWithValue }) => {
    try {
      const newThread = await api.createThread(threadData);
      return newThread;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk untuk membuat komentar
export const createComment = createAsyncThunk(
  'threads/createComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      const newComment = await api.createComment({ threadId, content });
      return newComment;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  threads: [],
  users: [],
  status: 'idle',
  error: null,
  threadDetail: null,
  threadDetailStatus: 'idle',
  threadDetailError: null,
};

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setThreads(state, action) {
      state.threads = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    addThread(state, action) {
      state.threads.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadsAndUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchThreadsAndUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.threads = action.payload.threads;
        state.users = action.payload.users;
      })
      .addCase(fetchThreadsAndUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch threads/users';
      })
      .addCase(createThread.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Tambahkan thread baru ke daftar
        state.threads.unshift(action.payload);
      })
      .addCase(createThread.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create thread';
      })
      .addCase(createComment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Refresh thread detail untuk menampilkan komentar baru
        if (state.threadDetail) {
          state.threadDetail.comments = [
            action.payload,
            ...state.threadDetail.comments
          ];
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create comment';
      });
    builder
      .addCase(fetchThreadDetail.pending, (state) => {
        state.threadDetailStatus = 'loading';
        state.threadDetailError = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.threadDetailStatus = 'succeeded';
        state.threadDetail = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.threadDetailStatus = 'failed';
        state.threadDetailError = action.payload || 'Failed to fetch thread detail';
      });
  },
});

export const { setThreads, setStatus, addThread } = threadsSlice.actions;
export default threadsSlice.reducer;
