// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Penting! Impor file CSS Bulma di sini
import 'bulma/css/bulma.min.css' 

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Impor file CSS kustom Anda (setelah Bulma)
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)