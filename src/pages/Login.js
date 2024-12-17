import React, { useState } from 'react'; // Mengimpor React dan useState untuk mengelola state
import { useNavigate } from 'react-router-dom'; // Mengimpor useNavigate untuk mengarahkan pengguna setelah login

function Login() {
  // State untuk mengelola inputan pengguna
  const [username, setUsername] = useState(''); // Menyimpan input username
  const [password, setPassword] = useState(''); // Menyimpan input password
  const [isRegistering, setIsRegistering] = useState(false); // Mengatur apakah dalam mode pendaftaran atau login
  const [newUsername, setNewUsername] = useState(''); // Menyimpan input username saat pendaftaran
  const [newPassword, setNewPassword] = useState(''); // Menyimpan input password saat pendaftaran
  const [newRole, setNewRole] = useState('user'); // Menyimpan role (admin/user) saat pendaftaran
  const navigate = useNavigate(); // Hook untuk navigasi halaman

  // Ambil data pengguna dari localStorage, atau set default pengguna jika belum ada data
  const users = JSON.parse(localStorage.getItem('users')) || [
    { username: 'admin', password: 'admin', role: 'admin' }, // Pengguna default admin
    { username: 'user', password: 'user', role: 'user' },   // Pengguna default user
  ];

  // Fungsi untuk menangani login
  const handleLogin = () => {
    const user = users.find(
      (u) => u.username === username && u.password === password // Mencocokkan username dan password
    );
  
    if (user) {
      // Jika login berhasil, simpan data user ke localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('role', user.role);
      navigate('/dashboard'); // Arahkan ke halaman dashboard
    } else {
      alert('Username atau password salah!'); // Jika login gagal
    }
  };
  
  // Fungsi untuk menangani pendaftaran akun baru
  const handleRegister = () => {
    // Validasi inputan agar username dan password tidak kosong
    if (!newUsername || !newPassword) {
      alert('Harap isi username dan password untuk mendaftar.');
      return;
    }

    // Cek apakah username sudah ada di daftar pengguna
    const existingUser = users.find((u) => u.username === newUsername);
    if (existingUser) {
      alert('Username sudah digunakan. Silakan pilih username lain.'); // Jika username sudah ada
      return;
    }

    // Menambahkan pengguna baru ke dalam daftar users
    const newUser = { username: newUsername, password: newPassword, role: newRole };
    const updatedUsers = [...users, newUser]; // Membuat array baru dengan user baru
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Simpan ke localStorage

    alert('Pendaftaran berhasil! Silakan login.'); // Menampilkan notifikasi berhasil
    setIsRegistering(false); // Kembali ke mode login setelah berhasil mendaftar
  };

  return (
    <section className="bg-white dark:bg-gray-900"> {/* Container utama dengan latar belakang */}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-gray-900 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
              {/* Judul halaman yang berubah tergantung mode (login/register) */}
              {isRegistering ? 'Create a new account' : 'Sign in to your account'}
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              {isRegistering ? (
                // Mode Pendaftaran Akun Baru
                <>
                  <div>
                    <label htmlFor="newUsername" className="block mb-2 text-sm font-medium text-white dark:text-white">
                      Username
                    </label>
                    <input
                      type="text"
                      name="newUsername"
                      id="newUsername"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)} // Mengubah state username
                      className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-white dark:text-white">
                      Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} // Mengubah state password
                      className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newRole" className="block mb-2 text-sm font-medium text-white dark:text-white">
                      Role
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)} // Mengubah state role
                      className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="user">User</option> {/* Pilihan role User */}
                      <option value="admin">Admin</option> {/* Pilihan role Admin */}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleRegister} // Menjalankan fungsi pendaftaran
                    className="w-full text-black bg-white hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)} // Mengubah mode kembali ke login
                    className="w-full text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                // Mode Login
                <>
                  <div>
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-white dark:text-white">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)} // Mengubah state username
                      className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-white dark:text-white">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} // Mengubah state password
                      className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleLogin} // Menjalankan fungsi login
                    className="w-full text-white bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-4 py-2 text-center dark:bg-transparent dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900"
                  >
                    Sign in
                  </button>

                  <p className="text-sm font-light text-white dark:text-white">
                    Don’t have an account yet?{' '}
                    <button
                      onClick={() => setIsRegistering(true)} // Mengubah mode ke pendaftaran
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Sign up
                    </button>
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
