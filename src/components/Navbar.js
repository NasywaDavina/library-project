import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Membuat class ArrayList untuk menangani array
class ArrayList {
  constructor() {
    this.items = [];
  }

  // Menambah elemen ke dalam array
  add(item) {
    this.items.push(item);
  }

  // Menghapus elemen berdasarkan kondisi tertentu
  remove(item) {
    this.items = this.items.filter(i => i !== item);
  }

  // Menemukan elemen berdasarkan kondisi tertentu
  find(item) {
    return this.items.find(i => i === item);
  }

  // Menampilkan semua item
  getAll() {
    return this.items;
  }

  // Mengubah elemen berdasarkan kondisi tertentu
  update(oldItem, newItem) {
    this.items = this.items.map(i => (i === oldItem ? newItem : i));
  }

  // Filter elemen berdasarkan kondisi tertentu
  filter(callback) {
    return this.items.filter(callback);
  }
}

function Navbar() {
  // Ambil role dari localStorage
  const role = localStorage.getItem('role'); 
  const navigate = useNavigate();

  // Inisialisasi ArrayList
  const arrayList = new ArrayList();
  arrayList.add('Dashboard');
  arrayList.add('Book');
  arrayList.add('Table');

  // Menambahkan menu berdasarkan role
  if (role === 'user') {
    arrayList.add('Detail History');
  }
  if (role === 'admin') {
    arrayList.add('History');
  }

  // Fungsi untuk logout dan mengarahkan ke halaman login
  const handleLogout = () => {
    localStorage.removeItem('role'); // Hapus role dari localStorage
    navigate('/'); // Arahkan ke halaman login
  };

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          {/* Desktop Links */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {arrayList.getAll().map((item, index) => (
                  <Link
                    key={index}
                    to={`/${item.toLowerCase().replace(' ', '')}`} // Menyesuaikan URL
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {arrayList.getAll().map((item, index) => (
            <Link
              key={index}
              to={`/${item.toLowerCase().replace(' ', '')}`} // Menyesuaikan URL
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
