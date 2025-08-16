import React from 'react';
// PERUBAHAN 1: Impor 'Navigate'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import TestimoniList from './pages/TestimoniList';
import TestimoniForm from './pages/TestimoniForm';
import BannerList from './pages/BannerList';
import BannerForm from './pages/BannerForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PERUBAHAN 2: Tambahkan rute untuk halaman utama (root) */}
        {/* Ini akan me-redirect dari "/" ke "/produk" */}
        <Route path="/" element={<Navigate to="/produk" replace />} />

        <Route element={<Layout />}>
          {/* Rute untuk Produk */}
          <Route path="/produk" element={<ProductList />} />
          <Route path="/produk/baru" element={<ProductForm />} />
          <Route path="/produk/edit/:id" element={<ProductForm />} />
          
          {/* Rute untuk Testimoni */}
          <Route path="/testimoni" element={<TestimoniList />} />
          <Route path="/testimoni/baru" element={<TestimoniForm />} />
          <Route path="/testimoni/edit/:id" element={<TestimoniForm />} />
          
          {/* Rute untuk Banner */}
          <Route path="/banners" element={<BannerList />} />
          <Route path="/banners/baru" element={<BannerForm />} />
          <Route path="/banners/edit/:id" element={<BannerForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;