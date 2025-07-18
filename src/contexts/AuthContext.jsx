/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from './AuthContext';
import { fetchOwnProfile, logoutUser } from '../reducers/auth';

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const status = useSelector((state) => state.auth.status);
  const loading = status === 'loading';

  useEffect(() => {
    // Cek apakah user sudah login dengan melihat token
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(fetchOwnProfile());
    }
  }, [dispatch]);

  const login = (email, password) => {
    return dispatch(loginUser({ email, password })).unwrap();
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}