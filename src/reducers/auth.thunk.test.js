/* eslint-disable no-undef */
// Pengujian untuk thunk function auth
// Skenario:
// 1. loginUser sukses mengubah state user
// 2. loginUser gagal mengubah state error

import { loginUser } from './auth';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as api from '../utils/api';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('auth thunk', () => {
  it('should dispatch fulfilled action when loginUser succeeds', async () => {
    const fakeUser = { id: 1, name: 'Test User' };
    jest.spyOn(api, 'login').mockResolvedValue('fake-token');
    jest.spyOn(api, 'putAccessToken').mockImplementation(() => {});
    jest.spyOn(api, 'getOwnProfile').mockResolvedValue(fakeUser);

    const store = mockStore({ auth: { user: null, status: 'idle', error: null } });
    await store.dispatch(loginUser({ email: 'a@b.com', password: '1234' }));
    const actions = store.getActions();
    expect(actions.some((a) => a.type.endsWith('/fulfilled'))).toBe(true);
    expect(actions.find((a) => a.type.endsWith('/fulfilled')).payload).toEqual(fakeUser);
  });

  it('should dispatch rejected action when loginUser fails', async () => {
    jest.spyOn(api, 'login').mockRejectedValue(new Error('Login gagal'));
    const store = mockStore({ auth: { user: null, status: 'idle', error: null } });
    await store.dispatch(loginUser({ email: 'a@b.com', password: 'salah' }));
    const actions = store.getActions();
    expect(actions.some((a) => a.type.endsWith('/rejected'))).toBe(true);
  });
});
