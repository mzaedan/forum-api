import React, { useState } from 'react';
import Header from '../components/HeaderPage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../reducers/threads';

function AddThreadPage() {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { status, error: threadError } = useSelector((state) => state.threads);

  const isLoading = status === 'loading';

  const categories = [
    'General',
    'Technology',
    'Programming',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'AI/ML',
    'DevOps',
    'Database',
    'Security',
    'UI/UX',
    'Career',
    'News',
    'Discussion',
    'Question',
    'Tutorial',
    'Review',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Judul thread wajib diisi';
    } else if (formData.title.length < 3) {
      errors.title = 'Judul thread minimal 3 karakter';
    } else if (formData.title.length > 100) {
      errors.title = 'Judul thread maksimal 100 karakter';
    }

    if (!formData.body.trim()) {
      errors.body = 'Isi thread wajib diisi';
    } else if (formData.body.length < 10) {
      errors.body = 'Isi thread minimal 10 karakter';
    } else if (formData.body.length > 5000) {
      errors.body = 'Isi thread maksimal 5000 karakter';
    }

    if (formData.category && formData.category.length > 50) {
      errors.category = 'Kategori maksimal 50 karakter';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setLocalError('Anda harus login untuk membuat thread.');
      return;
    }

    if (!validateForm()) return;

    setLocalError(null);
    setLocalSuccess(false);

    const threadData = {
      title: formData.title.trim(),
      body: formData.body.trim(),
      ...(formData.category && { category: formData.category.trim() }),
    };

    try {
      await dispatch(createThread(threadData)).unwrap();
      setLocalSuccess(true);
      setFormData({ title: '', body: '', category: '' });

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setLocalError(err || 'Terjadi kesalahan saat membuat thread');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const titleCharCount = formData.title.length;
  const bodyCharCount = formData.body.length;

  return (
    <div className="container py-4">
      <Header />

      {!user && (
        <div className="alert alert-warning mt-4">
          Anda harus login untuk membuat thread.
        </div>
      )}

      {localError && <div className="alert alert-danger">{localError}</div>}
      {threadError && <div className="alert alert-danger">{threadError}</div>}
      {localSuccess && (
        <div className="alert alert-success">
          Thread berhasil dibuat! Mengalihkan ke beranda...
        </div>
      )}

      <div className="row justify-content-center mt-4">
        <div className="col-md-8">
          <div className="d-flex align-items-center mb-4">
            <button
              type="button"
              className="btn btn-outline-dark me-3"
              onClick={handleCancel}
              disabled={isLoading}
              style={{ textDecoration: 'none' }}
            >
              ← Kembali
            </button>
            <h2 className="mb-0">Buat Thread Baru</h2>
          </div>

          {localSuccess && (
            <div className="alert alert-success fade-in mb-4">
              <div className="d-flex align-items-center">
                <span className="me-2">✅</span>
                <div>
                  <strong>Thread berhasil dibuat!</strong>
                  <br />
                  <small>
                    Anda akan diarahkan ke halaman thread dalam beberapa
                    detik...
                  </small>
                </div>
              </div>
            </div>
          )}

          {localError && (
            <div className="alert alert-danger fade-in mb-4">
              <div className="d-flex align-items-center">
                <span className="me-2">❌</span>
                <div>
                  <strong>Gagal membuat thread</strong>
                  <br />
                  <small>{localError}</small>
                </div>
              </div>
            </div>
          )}

          <div className="card shadow-lg">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-4">
                  <label htmlFor="title" className="form-label">
                    Judul Thread <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validationErrors.title ? 'is-invalid' : ''
                    }`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Masukkan judul thread yang menarik..."
                    disabled={isLoading}
                    maxLength={100}
                  />
                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <div>
                      {validationErrors.title && (
                        <div className="invalid-feedback">
                          {validationErrors.title}
                        </div>
                      )}
                    </div>
                    <small
                      className={`text-muted ${
                        titleCharCount > 90 ? 'text-warning' : ''
                      }`}
                    >
                      {titleCharCount}/100
                    </small>
                  </div>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label htmlFor="category" className="form-label">
                    Kategori
                  </label>
                  <select
                    className={`form-select ${
                      validationErrors.category ? 'is-invalid' : ''
                    }`}
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">Pilih kategori (opsional)</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {validationErrors.category && (
                    <div className="invalid-feedback">
                      {validationErrors.category}
                    </div>
                  )}
                  <div className="form-text">
                    Pilih kategori yang sesuai untuk memudahkan pencarian thread
                    Anda
                  </div>
                </div>

                {/* Body */}
                <div className="mb-4">
                  <label htmlFor="body" className="form-label">
                    Isi Thread <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${
                      validationErrors.body ? 'is-invalid' : ''
                    }`}
                    id="body"
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    placeholder="Tulis isi thread Anda di sini..."
                    disabled={isLoading}
                    rows={8}
                    maxLength={5000}
                  />
                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <div>
                      {validationErrors.body && (
                        <div className="invalid-feedback">
                          {validationErrors.body}
                        </div>
                      )}
                    </div>
                    <small
                      className={`text-muted ${
                        bodyCharCount > 4500 ? 'text-warning' : ''
                      }`}
                    >
                      {bodyCharCount}/5000
                    </small>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted">
                    <small>
                      <span className="text-danger">*</span> Wajib diisi
                    </small>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-outline-secondary me-3"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-dark"
                      disabled={
                        isLoading ||
                        !formData.title.trim() ||
                        !formData.body.trim()
                      }
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Membuat Thread...
                        </>
                      ) : (
                        <>
                          <span className="me-2">✨</span>
                          Buat Thread
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Tips */}
          <div className="card mt-4">
            <div className="card-body">
              <h6 className="card-title">💡 Tips untuk Thread yang Baik</h6>
              <ul className="mb-0 text-muted">
                <li>Gunakan judul yang jelas dan deskriptif</li>
                <li>Jelaskan konteks dan latar belakang masalah</li>
                <li>Sertakan detail yang relevan dalam isi thread</li>
                <li>Pilih kategori yang sesuai agar mudah ditemukan</li>
                <li>Gunakan bahasa yang sopan dan mudah dipahami</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddThreadPage;