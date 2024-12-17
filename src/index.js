import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Mengimpor styling global aplikasi
import App from './App';  // Mengimpor komponen utama aplikasi
import { BrowserRouter } from "react-router-dom";  // Mengimpor BrowserRouter untuk pengelolaan routing
import reportWebVitals from './reportWebVitals';  // Mengimpor fungsi untuk pengukuran kinerja aplikasi

// Membuat root untuk aplikasi dan merender ke dalam elemen dengan id 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));

// Merender aplikasi dengan menggunakan BrowserRouter untuk mengelola navigasi halaman tanpa reload
root.render(
  <BrowserRouter>
    <App />  {/* Komponen utama aplikasi yang berisi struktur dan logika routing */}
  </BrowserRouter>
);

// Fungsi reportWebVitals digunakan untuk mengukur kinerja aplikasi (misalnya waktu pemuatan halaman)
// Hasil pengukuran dapat dikirimkan ke alat analitik untuk dianalisis lebih lanjut
reportWebVitals();
