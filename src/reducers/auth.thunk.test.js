/* eslint-disable no-undef */
// Pengujian untuk thunk function auth
// Skenario:
// 1. loginUser sukses mengubah state user
// 2. loginUser gagal mengubah state error

import { loginUser } from './auth';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import api from '../utils/api';
import { vi } from 'vitest';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('auth thunk', () => {
  it('should dispatch fulfilled action when loginUser succeeds', async () => {
    const fakeUser = { id: 1, name: 'Test User' };
    vi.spyOn(api, 'login').mockResolvedValue('fake-token');
    vi.spyOn(api, 'putAccessToken').mockImplementation(() => {});
    vi.spyOn(api, 'getOwnProfile').mockResolvedValue(fakeUser);

    const store = mockStore({ auth: { user: null, status: 'idle', error: null } });
    await store.dispatch(loginUser({ email: 'a@b.com', password: '1234' }));
    const actions = store.getActions();
    expect(actions.some((a) => a.type.endsWith('/fulfilled'))).toBe(true);
    expect(actions.find((a) => a.type.endsWith('/fulfilled')).payload).toEqual(fakeUser);
  });

  it('should dispatch rejected action when loginUser fails', async () => {
    vi.spyOn(api, 'login').mockRejectedValue(new Error('Login gagal'));
    const store = mockStore({ auth: { user: null, status: 'idle', error: null } });
    await store.dispatch(loginUser({ email: 'a@b.com', password: 'salah' }));
    const actions = store.getActions();
    expect(actions.some((a) => a.type.endsWith('/rejected'))).toBe(true);
  });
});
