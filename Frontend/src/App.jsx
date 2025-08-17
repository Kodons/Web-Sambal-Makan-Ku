import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import KeunggulanSection from './components/KeunggulanSection.jsx';
import ProdukSection from './components/ProdukSection.jsx';
import TestimoniSection from './components/TestimoniSection.jsx';
import KontakSection from './components/KontakSection.jsx';
import Footer from './components/Footer.jsx';
import WelcomePopup from './components/WelcomePopup.jsx';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupImageUrl, setPopupImageUrl] = useState('');

  useEffect(() => {
    async function fetchPopupData() {
      try {
        const response = await fetch(`${BACKEND_URL}/api/popup-banner`);
        const data = await response.json();
        if (data && data.imageUrl) {
          setPopupImageUrl(`${BACKEND_URL}${data.imageUrl}`);
        }
      } catch (error) { console.error("Gagal mengambil data pop-up:", error); }
    }
    fetchPopupData();
    setIsPopupVisible(true);
  }, []);

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <>
      {isPopupVisible && popupImageUrl && <WelcomePopup onClose={handleClosePopup} imageUrl={popupImageUrl} />}
      <Navbar />
      <HeroSection />
      <KeunggulanSection />
      <ProdukSection />
      <TestimoniSection />
      <KontakSection />
      <Footer />
    </>
  );
}
export default App;