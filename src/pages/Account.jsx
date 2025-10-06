// src/pages/Account.jsx
import React from 'react';
import Header from '../components/Header'; // Asumsi Anda memiliki komponen Header
import BottomNav from '../components/BottomNav'; // Asumsi Anda memiliki komponen BottomNav

const Account = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20"> {/* pb-20 untuk BottomNav */}
      <Header />

      {/* --- BAGIAN BODY PROFIL DIMULAI DI SINI --- */}
      <div className="p-4 sm:p-6 flex justify-center flex-grow">
        <div className="bg-white rounded-lg shadow-md p-5 w-full max-w-md">

          {/* User Info Section */}
          <div className="flex flex-col items-center mb-8">
            <img 
              src="https://picsum.photos/seed/picsum/200/300" // Ganti dengan URL gambar profil Anda
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-gray-200"
            />
            <h2 className="text-lg font-semibold text-gray-800">Anata Setyarini</h2>
            <p className="text-sm text-gray-600">anatasyrini@gmail.com</p>
          </div>

          {/* PROFILE Menu */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 border-b border-gray-300 pb-2">
              PROFILE
            </h3>
            <ProfileMenuItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              text="Ubah Profile"
            />
            <ProfileMenuItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              text="Alamat"
            />
            <ProfileMenuItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
              text="Wishlist"
            />
          </div>

          {/* MEMBERSHIP & LOYALTY Menu */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 border-b border-gray-300 pb-2">
              MEMBERSHIP & LOYALTY
            </h3>
            <ProfileMenuItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
              text="Lihat Status dan Point Loyalty"
            />
            <ProfileMenuItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
              text="Tukar Point"
            />
            <ProfileMenuItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
              text="Voucher Saya"
            />
          </div>

          {/* BANTUAN Menu */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 border-b border-gray-300 pb-2">
              BANTUAN
            </h3>
            <ProfileMenuItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9.247a8.672 8.672 0 00-1.658.591 1.05 1.05 0 01-1.05-.119L3 10.662A2 2 0 001 12.484V15a2 2 0 002 2h2.242a2 2 0 001.052.119 8.672 8.672 0 001.658-.591m4.34-9.247a8.672 8.672 0 01-1.658-.591 1.05 1.05 0 00-1.05-.119L11 2.516A2 2 0 009 4.338V7a2 2 0 002 2h2.242a2 2 0 001.052.119M19.34 9.247a8.672 8.672 0 01-1.658.591 1.05 1.05 0 00-1.05-.119L15 10.662A2 2 0 0013 12.484V15a2 2 0 002 2h2.242a2 2 0 001.052.119M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              text="FAQ"
            />
            <ProfileMenuItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              text="Dukungan Pelanggan"
            />
            <ProfileMenuItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              text="Tentang Aplikasi"
            />
          </div>

          {/* Logout Button */}
          <button className="w-full bg-white text-orange-600 border border-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-50 hover:text-white transition-colors duration-200">
            Keluar
          </button>

        </div>
      </div>
      {/* --- BAGIAN BODY PROFIL BERAKHIR DI SINI --- */}

      <BottomNav />
    </div>
  );
};

// Komponen Pembantu untuk Item Menu Profil
const ProfileMenuItem = ({ icon, text }) => (
  <div className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-colors duration-150 text-sm">
    {icon}
    <span>{text}</span>
  </div>
);

export default Account;