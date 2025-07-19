/* eslint-disable no-undef */
// Pengujian untuk auth reducer
// Skenario:
// 1. State berubah saat login sukses
// 2. State kembali ke awal saat logout

import authReducer, { setUser, logout } from './auth';

describe('auth reducer', () => {
  it('should handle setUser action', () => {
    const initialState = { user: null, status: 'idle', error: null };
    const user = { id: 1, name: 'Test User' };
    const nextState = authReducer(initialState, setUser(user));
    expect(nextState.user).toEqual(user);
  });

  it('should handle logout action', () => {
    const state = { user: { id: 1, name: 'Test User' }, status: 'idle', error: null };
    const nextState = authReducer(state, logout());
    expect(nextState.user).toBeNull();
  });
});
