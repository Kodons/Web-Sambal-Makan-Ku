import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

// Impor semua komponen dan halaman
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import KeunggulanSection from './components/KeunggulanSection.jsx';
import ProdukSection from './components/ProdukSection.jsx';
import HowToOrder from './components/HowToOrder.jsx';
import TestimoniSection from './components/TestimoniSection.jsx';
import KontakSection from './components/KontakSection.jsx';
import Footer from './components/Footer.jsx';
import WelcomePopup from './components/WelcomePopup.jsx';
import FloatingCartButton from './components/FloatingCartButton.jsx';
import CartSidebar from './components/CartSidebar.jsx';
import Checkout from './components/Checkout.jsx';
import DetailOrder from './components/DetailOrder.jsx';
import TrackOrderPage from './components/TrackOrderPage.jsx';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Komponen untuk mengelompokkan semua section di halaman utama
const LandingPage = () => (
  <>
    <HeroSection />
    <KeunggulanSection />
    <ProdukSection />
    <HowToOrder />
    <TestimoniSection />
    <KontakSection />
  </>
);

function App() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupImageUrl, setPopupImageUrl] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    async function fetchPopupData() {
      try {
        const response = await fetch(`${BACKEND_URL}/api/popup-banner`);
        const data = await response.json();
        if (data && data.imageUrl) {
          setPopupImageUrl(`${BACKEND_URL}${data.imageUrl}`);
          setIsPopupVisible(true);
        }
      } catch (error) {
        console.error("Gagal mengambil data pop-up:", error);
      }
    }

    const hasBeenShown = sessionStorage.getItem('popupHasBeenShown');
    if (!hasBeenShown) {
      fetchPopupData();
    }
  }, []);

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    sessionStorage.setItem('popupHasBeenShown', 'true');
  };

  return (
    <CartProvider>
      {/* 1. Bungkus semua dengan Router */}
      <Router>
        <div className='page-wrapper'>
          <Toaster position="bottom-center" />

          {isPopupVisible && popupImageUrl && <WelcomePopup onClose={handleClosePopup} imageUrl={popupImageUrl} />}

          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

          <div className="content-wrap">
            {/* Navbar & Footer di luar Routes agar selalu tampil */}
            <Navbar />

            {/* 2. Gunakan Routes untuk mendefinisikan halaman */}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pesanan-berhasil" element={<DetailOrder />} />
              <Route path="/lacak-pesanan" element={<TrackOrderPage />} />
            </Routes>
          </div>

          <Footer />
          <FloatingCartButton onCartClick={() => setIsCartOpen(true)} />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;