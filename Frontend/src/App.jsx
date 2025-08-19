import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import KeunggulanSection from './components/KeunggulanSection.jsx';
import ProdukSection from './components/ProdukSection.jsx';
import HowToOrder from './components/HowToOrder.jsx';
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
          setIsPopupVisible(true);
        }
      } catch (error) {
        console.error("Gagal mengambil data pop-up:", error);
      }
    }

    const hasBeenShown = localStorage.getItem('popupHasBeenShown');
    if (!hasBeenShown) {
      fetchPopupData();
    }
  }, []);

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (

    <div className='page-wrapper'>
      {isPopupVisible && popupImageUrl && <WelcomePopup onClose={handleClosePopup} imageUrl={popupImageUrl} />}

      <div className="content-wrap">
        <Navbar />
        <HeroSection />
        <KeunggulanSection />
        <ProdukSection />
        <HowToOrder />
        <TestimoniSection />
        <KontakSection />
      </div>
      <Footer />
    </div>
  );
}

export default App;