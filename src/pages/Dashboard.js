import React from 'react';
import dashboardImage from '../image/91af8c8a9a178dce3b3c4842e073dd91.jpg'; // Impor gambar dari folder src/images

function Dashboard() {
  const role = localStorage.getItem('role'); // Ambil role dari localStorage

  return (
    <div className="dashboard-container flex h-screen overflow-hidden">
      {/* Gambar Penuh di Kiri */}
      <div 
        className="dashboard-image w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${dashboardImage})` }} // Menggunakan gambar yang diimpor
      >
      </div>

      {/* Konten di Kanan */}
      <div className="dashboard-content w-1/2 flex flex-col justify-center items-center text-white bg-white overflow-y-auto">
        <h1 className="text-4xl font-bold mb-15 text-center text-gray-900">
          Welcome, {role === 'admin' ? 'Admin' : 'User'}
        </h1>
        <p className="text-20 mb-20 text-center text-gray-900">
          {role === 'admin'
            ? 'As an Admin, you have full access to manage the system and users.'
            : 'As a User, you can view your data and interact with available resources.'}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
