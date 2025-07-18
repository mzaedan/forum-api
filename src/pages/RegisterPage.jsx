import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../reducers/auth';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');

  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);
  const isLoading = status === 'loading';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    setApiError('');
    setSuccess('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username wajib diisi';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        'Username hanya boleh mengandung huruf, angka, dan underscore';
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Nama lengkap minimal 2 karakter';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        'Password harus mengandung huruf besar, kecil, dan angka';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    // Terms validation
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'Anda harus menyetujui syarat dan ketentuan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setApiError('');
    setSuccess('');

    try {
      await dispatch(registerUser({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        username: formData.username,
      })).unwrap();

      setSuccess('Registrasi berhasil! Silakan login.');
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        agreedToTerms: false,
      });
    } catch (err) {
      setApiError(err || 'Terjadi kesalahan saat mendaftar');
    }
  };

  return (
    <div className="register-container">
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="row w-100">
          <div className="col-md-8 col-lg-6 col-xl-5 mx-auto">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h1 className="display-6 fw-bold text-dark mb-2">
                    Buat Akun Baru
                  </h1>
                  <p className="text-muted">
                    Bergabunglah dengan komunitas Forum Discussion
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
                    <div className="text-center mt-2">
                      <small className="text-muted">
                        Sedang memproses registrasi...
                      </small>
                    </div>
                  </div>
                )}

                {/* API Error/Success Message */}
                {apiError && (
                  <div className="alert alert-danger py-2" role="alert">
                    {apiError}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success py-2" role="alert">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label
                      htmlFor="fullName"
                      className="form-label text-dark fw-semibold"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg border-2 rounded-3 ${
                        errors.fullName ? 'is-invalid' : ''
                      }`}
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap"
                      disabled={isLoading}
                    />
                    {errors.fullName && (
                      <div className="invalid-feedback">{errors.fullName}</div>
                    )}
                  </div>

                  {/* Username */}
                  <div className="mb-3">
                    <label
                      htmlFor="username"
                      className="form-label text-dark fw-semibold"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg border-2 rounded-3 ${
                        errors.username ? 'is-invalid' : ''
                      }`}
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Masukkan username"
                      disabled={isLoading}
                    />
                    {errors.username && (
                      <div className="invalid-feedback">{errors.username}</div>
                    )}
                    <div className="form-text">
                      Username akan digunakan untuk identifikasi di forum
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label text-dark fw-semibold"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control form-control-lg border-2 rounded-3 ${
                        errors.email ? 'is-invalid' : ''
                      }`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Masukkan email"
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label text-dark fw-semibold"
                    >
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control form-control-lg border-2 rounded-3 ${
                          errors.password ? 'is-invalid' : ''
                        }`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Masukkan password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary position-absolute end-0 top-50 translate-middle-y me-2"
                        style={{ border: 'none', background: 'none' }}
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                    <div className="form-text">
                      Minimal 6 karakter, harus mengandung huruf besar, kecil,
                      dan angka
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label text-dark fw-semibold"
                    >
                      Konfirmasi Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-control form-control-lg border-2 rounded-3 ${
                          errors.confirmPassword ? 'is-invalid' : ''
                        }`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Ulangi password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary position-absolute end-0 top-50 translate-middle-y me-2"
                        style={{ border: 'none', background: 'none' }}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className={`form-check-input ${
                          errors.agreedToTerms ? 'is-invalid' : ''
                        }`}
                        type="checkbox"
                        id="agreedToTerms"
                        name="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <label
                        className="form-check-label text-dark"
                        htmlFor="agreedToTerms"
                      >
                        Saya menyetujui{' '}
                        <a href="#" className="text-dark fw-semibold">
                          Syarat dan Ketentuan
                        </a>{' '}
                        serta{' '}
                        <a href="#" className="text-dark fw-semibold">
                          Kebijakan Privasi
                        </a>
                      </label>
                      {errors.agreedToTerms && (
                        <div className="invalid-feedback">
                          {errors.agreedToTerms}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
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
                          Membuat Akun...
                        </>
                      ) : (
                        'Buat Akun'
                      )}
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Sudah punya akun?{' '}
                      <button
                        type="button"
                        className="btn btn-link text-dark fw-semibold p-0"
                        disabled={isLoading}
                        onClick={() => {
                          console.log('Navigate to login page');
                        }}
                      >
                        Masuk di sini
                      </button>
                    </p>
                  </div>
                </form>
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

export default RegisterPage;
