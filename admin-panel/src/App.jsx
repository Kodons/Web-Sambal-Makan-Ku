import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import TestimoniList from './pages/TestimoniList';
import TestimoniForm from './pages/TestimoniForm';
import BannerList from './pages/BannerList';
import BannerForm from './pages/BannerForm';
import SettingsPage from './pages/SettingsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OrderManagement from './pages/OrderManagement';
import Meta from './components/Meta';

// Komponen untuk melindungi rute
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Meta />
      <Routes>
        {/* Rute Publik (tidak perlu login) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Semua rute admin sekarang bersarang di dalam Layout dan diproteksi */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Rute default akan dialihkan ke /produk */}
          <Route index element={<Navigate to="/produk" replace />} />

          <Route path="produk" element={<ProductList />} />
          <Route path="produk/baru" element={<ProductForm />} />
          <Route path="produk/edit/:id" element={<ProductForm />} />

          <Route path="testimoni" element={<TestimoniList />} />
          <Route path="testimoni/baru" element={<TestimoniForm />} />
          <Route path="testimoni/edit/:id" element={<TestimoniForm />} />

          <Route path="banners" element={<BannerList />} />
          <Route path="banners/baru" element={<BannerForm />} />
          <Route path="banners/edit/:id" element={<BannerForm />} />

          <Route path="pesanan" element={<OrderManagement />} />

          <Route path="pengaturan" element={<SettingsPage />} />
        </Route>

        {/* Rute 'catch-all' untuk halaman yang tidak ditemukan */}
        <Route path="*" element={<h1>404: Halaman Tidak Ditemukan</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;