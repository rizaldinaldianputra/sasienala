// src/pages/Account.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { COLORS } from '../constants/colors';
import { useUser } from '../hook/useUser';
import { clearSession, getToken } from '../session/session';

const Account = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = useUser();

  useEffect(() => {
    fetchUser();
  }, []);

  const handleClick = (callback) => {
    const token = getToken('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    if (callback) callback();
  };

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen " style={{ fontFamily: "'Tenor Sans', sans-serif" }}>
      <Header />
      <div className="p-4 sm:p-6 flex justify-center flex-grow">
        <div className="bg-white rounded-lg  p-5 w-full max-w-md">
          {/* User Info */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={user?.profile?.profile_picture || 'https://picsum.photos/seed/picsum/200/300'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-gray-200"
            />
            <h2 className="text-lg font-semibold text-gray-800">{user?.username || 'User'}</h2>
            <p className="text-sm text-gray-600">{user?.email || '-'}</p>
          </div>

          {/* PROFILE */}
          <div className="mb-6">
            <h3
              style={{
                borderBottomColor: COLORS.primary, // border-bottom warna primary
              }}
              className="text-sm font-semibold text-gray-600 mb-3 border-b pb-2"
            >
              PROFILE
            </h3>

            <ProfileMenuItem
              onClick={() => handleClick(() => navigate('/profile'))}
              icon={iconUser}
              text="Ubah Profile"
            />
            <ProfileMenuItem
              onClick={() => handleClick(() => navigate('/address'))}
              icon={iconAddress}
              text="Alamat"
            />
            <ProfileMenuItem
              onClick={() => handleClick(() => navigate('/wishlist'))}
              icon={iconHeart}
              text="Wishlist"
            />
          </div>

          {/* MEMBERSHIP */}
          <div className="mb-6">
            <h3
              style={{
                borderBottomColor: COLORS.primary, // border-bottom warna primary
              }}
              className="text-sm font-semibold text-gray-600 mb-3 border-b border-gray-300 pb-2"
            >
              MEMBERSHIP & LOYALTY
            </h3>
            <ProfileMenuItem
              onClick={() => handleClick(() => navigate('/membership'))}
              icon={iconCard}
              text="Lihat Status dan Point Loyalty"
            />
            <ProfileMenuItem
              onClick={() => handleClick(() => navigate('/point'))}
              icon={iconWallet}
              text="Tukar Point"
            />
            <ProfileMenuItem
              onClick={() => handleClick(() => navigate('/voucher'))}
              icon={iconVoucher}
              text="Voucher Saya"
            />
          </div>

          {/* BANTUAN */}
          <div className="mb-6">
            <h3
              style={{
                borderBottomColor: COLORS.primary, // border-bottom warna primary
              }}
              className="text-sm font-semibold text-gray-600 mb-3 border-b border-gray-300 pb-2"
            >
              BANTUAN
            </h3>
            <ProfileMenuItem
              onClick={() => handleClick(() => navigate('/faq'))}
              icon={iconFAQ}
              text="FAQ"
            />
            <ProfileMenuItem
              onClick={() => handleClick(() => navigate('/support'))}
              icon={iconHelp}
              text="Dukungan Pelanggan"
            />
            <ProfileMenuItem
              onClick={() => handleClick(() => navigate('/about'))}
              icon={iconInfo}
              text="Tentang Aplikasi"
            />
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => handleClick(handleLogout)}
            className="w-full bg-white text-orange-600 border border-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-50 hover:text-white transition-colors duration-200"
          >
            Keluar
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

// ITEM
const ProfileMenuItem = ({ icon, text, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-colors duration-150 text-sm"
  >
    {icon}
    <span>{text}</span>
  </div>
);

// ICONS
const iconUser = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const iconAddress = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const iconHeart = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const iconCard = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
    />
  </svg>
);

const iconWallet = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

const iconVoucher = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 5v2m0 4v2m0 4v2M3 12l2-2m0 0l7-7 7 7"
    />
  </svg>
);

const iconFAQ = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.228 9.247a8.672 8.672 0 00-1.658.591L3 10.662A2 2 0 001 12.484V15a2 2 0 002 2h2.242a2 2 0 001.052.119"
    />
  </svg>
);

const iconHelp = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const iconInfo = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default Account;
