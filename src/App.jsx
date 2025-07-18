import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ThreadListPage from './pages/ThreadsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddThreadPage from './pages/AddThreadsPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ThreadListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/add-thread" element={<AddThreadPage />} />
          <Route path="/thread/:id" element={<ThreadDetailPage />} />
          {/* Tambahkan route lain di sini jika diperlukan */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
