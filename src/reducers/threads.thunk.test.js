/* eslint-disable no-undef */
// Pengujian untuk thunk function threads
// Skenario:
// 1. fetchThreadsAndUsers sukses mengubah state
// 2. fetchThreadsAndUsers gagal mengubah state error

import { fetchThreadsAndUsers } from './threads';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as api from '../utils/api';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('threads thunk', () => {
  it('should dispatch fulfilled action when fetchThreadsAndUsers succeeds', async () => {
    const fakeThreads = [{ id: '1', title: 'Test Thread' }];
    const fakeUsers = [{ id: 'u1', name: 'User 1' }];
    jest.spyOn(api, 'getAllThreads').mockResolvedValue(fakeThreads);
    jest.spyOn(api, 'getAllUsers').mockResolvedValue(fakeUsers);

    const store = mockStore({ threads: { threads: [], users: [], status: 'idle', error: null } });
    await store.dispatch(fetchThreadsAndUsers());
    const actions = store.getActions();
    expect(actions.some((a) => a.type.endsWith('/fulfilled'))).toBe(true);
    expect(actions.find((a) => a.type.endsWith('/fulfilled')).payload).toEqual({ threads: fakeThreads, users: fakeUsers });
  });

  it('should dispatch rejected action when fetchThreadsAndUsers fails', async () => {
    jest.spyOn(api, 'getAllThreads').mockRejectedValue(new Error('Failed'));
    jest.spyOn(api, 'getAllUsers').mockRejectedValue(new Error('Failed'));
    const store = mockStore({ threads: { threads: [], users: [], status: 'idle', error: null } });
    await store.dispatch(fetchThreadsAndUsers());
    const actions = store.getActions();
    expect(actions.some((a) => a.type.endsWith('/rejected'))).toBe(true);
  });
});
