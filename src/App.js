import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import Book from './pages/Book';
import Table from './pages/Table';
import History from './pages/History';
import DetailHistory from './pages/DetailHistory';
import Navbar from './components/Navbar';

function App() {
  // Cek role dari localStorage untuk menentukan apakah pengguna sudah login
  const role = localStorage.getItem('role'); 
  // Mengambil lokasi atau URL saat ini
  const location = useLocation(); 

  // Navbar hanya ditampilkan jika sudah login dan bukan di halaman login
  const showNavbar = role && location.pathname !== '/';

  return (
    <div className="App">
      {showNavbar && <Navbar />} {/* Menampilkan Navbar hanya jika sudah login */}
      
      <Routes>
        {/* Halaman Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rute setelah login */}
        {role ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/book" element={<Book />} />
            <Route path="/table" element={<Table />} />
            <Route path="/history" element={<History />} />
            <Route path="/detailhistory" element={<DetailHistory />} />
          </>
        ) : (
          // Jika pengguna belum login, arahkan ke halaman login
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
