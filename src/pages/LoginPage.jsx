/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../reducers/auth';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);
  const isLoading = status === 'loading';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await dispatch(loginUser({
        email: formData.email,
        password: formData.password
      })).unwrap();

      setSuccess('Login berhasil!');
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      setError((err && err.message) ? err.message : (typeof err === 'string' ? err : 'Login gagal'));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await dispatch(registerUser({
        name: formData.username,
        email: formData.email,
        password: formData.password,
      })).unwrap();

      setSuccess('Registrasi berhasil! Silakan login.');
      setShowRegister(false);
      setFormData({ email: '', password: '', username: '' });
    } catch (err) {
      setError((err && err.message) ? err.message : (typeof err === 'string' ? err : 'Registrasi gagal'));
    }
  };

  return (
    <div className="login-container">
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="row w-100">
          <div className="col-md-6 col-lg-4 mx-auto">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h1 className="display-6 fw-bold text-dark mb-2">
                    Forum Discussion
                  </h1>
                  <p className="text-muted">
                    {showRegister ? 'Buat akun baru' : 'Masuk ke akun Anda'}
                  </p>
                </div>
                {/* Loading Bar */}
                {isLoading && (
                  <div className="mb-4">
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-dark"
                        role="progressbar"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                )}
                {/* Error/Success Message */}
                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success py-2" role="alert">
                    {success}
                  </div>
                )}
                <form
                  onSubmit={showRegister ? handleRegisterSubmit : handleSubmit}
                >
                  {showRegister && (
                    <div className="mb-3">
                      <label
                        htmlFor="username"
                        className="form-label text-dark fw-semibold"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg border-2 rounded-3"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Masukkan username"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label text-dark fw-semibold"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg border-2 rounded-3"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Masukkan email"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="form-label text-dark fw-semibold"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg border-2 rounded-3"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Masukkan password"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="d-grid gap-2 mb-4">
                    <button
                      type="submit"
                      className="btn btn-dark btn-lg rounded-3 fw-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {showRegister ? 'Mendaftar...' : 'Masuk...'}
                        </>
                      ) : showRegister ? (
                        'Daftar'
                      ) : (
                        'Masuk'
                      )}
                    </button>
                  </div>
                </form>
                <div className="text-center">
                  <p className="text-muted mb-0">
                    {showRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}
                    <button
                      type="button"
                      className="btn btn-link text-dark fw-semibold p-0 ms-1"
                      onClick={() => {
                        setShowRegister(!showRegister);
                        setFormData({ email: '', password: '', username: '' });
                        setError('');
                        setSuccess('');
                      }}
                      disabled={isLoading}
                    >
                      {showRegister ? 'Masuk di sini' : 'Daftar di sini'}
                    </button>
                  </p>
                </div>
                {!showRegister && (
                  <div className="text-center mt-3">
                    <a
                      href="#"
                      className="text-muted text-decoration-none small"
                    >
                      Lupa password?
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-muted small">
                © 2025 Forum Discussion. Semua hak dilindungi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;