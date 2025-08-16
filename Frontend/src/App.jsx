import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import KeunggulanSection from './components/KeunggulanSection.jsx';
import ProdukSection from './components/ProdukSection.jsx';
import TestimoniSection from './components/TestimoniSection.jsx';
import KontakSection from './components/KontakSection.jsx';
import Footer from './components/Footer.jsx';
import WelcomePopup from './components/WelcomePopup.jsx';

function App() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupImageUrl, setPopupImageUrl] = useState('');

  useEffect(() => {
    async function fetchPopupData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/popup-banner`);
        const data = await response.json();
        
        if (data && data.imageUrl) {
          const fullImageUrl = `${import.meta.env.VITE_BACKEND_URL}${data.imageUrl}`;
          setPopupImageUrl(fullImageUrl);
          setIsPopupVisible(true);
        }
      } catch (error) {
        console.error("Gagal mengambil data pop-up:", error);
      }
    }

    // Kita gunakan versi sederhana tanpa localStorage untuk sementara
    fetchPopupData(); 
    
    // PERUBAHAN 2: setTimeout dihapus
    
  }, []);

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <>
      {/* PERUBAHAN 3: Video dihapus dari sini */}
    
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