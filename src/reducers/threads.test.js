/* eslint-disable no-undef */
// Pengujian untuk threads reducer
// Skenario:
// 1. State berubah saat addThread
// 2. State berubah saat setThreads

import threadsReducer, { addThread, setThreads } from './threads';

describe('threads reducer', () => {
  it('should handle addThread action', () => {
    const initialState = { threads: [], status: 'idle', error: null };
    const thread = { id: '1', title: 'Test Thread' };
    const nextState = threadsReducer(initialState, addThread(thread));
    expect(nextState.threads).toContainEqual(thread);
  });

  it('should handle setThreads action', () => {
    const initialState = { threads: [], status: 'idle', error: null };
    const threads = [
      { id: '1', title: 'Thread 1' },
      { id: '2', title: 'Thread 2' }
    ];
    const nextState = threadsReducer(initialState, setThreads(threads));
    expect(nextState.threads).toEqual(threads);
  });
});
