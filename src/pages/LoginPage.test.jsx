/* eslint-disable no-undef */
// Pengujian LoginPage
// Skenario:
// 1. Input email & password, klik login, dispatch loginUser
// 2. Jika login gagal, tampilkan pesan error

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import LoginPage from './LoginPage';
import * as auth from '../reducers/auth';
import { BrowserRouter } from 'react-router-dom';

const mockStore = configureStore([thunk]);

describe('LoginPage', () => {
  it('should dispatch loginUser on submit', async () => {
    const store = mockStore({ auth: { status: 'idle' } });
    jest.spyOn(auth, 'loginUser').mockReturnValue(() => Promise.resolve({ type: 'auth/login/fulfilled', payload: { id: 1 } }));
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some((a) => a.type.startsWith('auth/login'))).toBe(true);
    });
  });

  it('should show error message on login failure', async () => {
    const store = mockStore({ auth: { status: 'idle' } });
    jest.spyOn(auth, 'loginUser').mockReturnValue(() => Promise.reject(new Error('Login gagal')));
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'fail@b.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'salah' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText(/login gagal/i)).toBeInTheDocument();
    });
  });
});
