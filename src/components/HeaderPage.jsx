/* eslint-disable linebreak-style */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

function Header() {
  const { user, logout } = useAuth();
  return (
    <div className="bg-white shadow-sm border-bottom">
      <div className="container py-3">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="h3 mb-0 fw-bold text-dark">Forum Discussion</h1>
            <p className="text-muted mb-0 small">
              Komunitas Developer Nusantara Raya
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-flex align-items-center justify-content-md-end gap-2">
              {user ? (
                <>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="rounded-circle"
                    style={{ width: '32px', height: '32px' }}
                  />
                  <span className="text-dark fw-semibold">{user.name}</span>
                  <button
                    className="btn btn-outline-dark btn-sm ms-2"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-dark btn-sm me-2">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-outline-dark btn-sm">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
