// src/components/BottomNavSearch.jsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getToken } from '../session/session';

export default function BottomNavSearch({ onSubmit }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState('');

  const navItems = [
    { to: '/', label: 'Chat', icon: '/icons/chat.svg', iconActive: '/icons/chat-active.svg' },
    {
      to: '/product',
      label: 'Produk',
      icon: '/icons/product.svg',
      iconActive: '/icons/product-active.svg',
    },
    {
      to: '/promo',
      label: 'Promo',
      icon: '/icons/promo.svg',
      iconActive: '/icons/promo-active.svg',
    },
    {
      to: '/transaksi',
      label: 'Transaksi',
      icon: '/icons/transaksi.svg',
      iconActive: '/icons/transaksi-active.svg',
    },
    {
      to: '/account',
      label: 'Akun',
      icon: '/icons/account.svg',
      iconActive: '/icons/account-active.svg',
    },
  ];

  const handleNavClick = (to) => {
    if ((to === '/transaksi' || to === '/promo') && !getToken()) {
      navigate('/login');
    } else {
      navigate(to);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && onSubmit) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-0 left-1 right-1 flex flex-col items-center z-50">
      {/* Form input chat */}
      <form
        className="flex w-full max-w-sm bg-white rounded-full border border-gray-300 overflow-hidden mx-3 m-1 shadow-md"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 text-sm focus:outline-none mr-2"
          placeholder="Tulis pesan kamu.."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="mr-1 flex-none w-10 h-10 px-3 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center ml-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-black"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>

      {/* Bottom Nav */}
      <nav className="w-full max-w-sm border-t border-gray-200 bg-white flex justify-around py-2 shadow-lg">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <div
              key={item.to}
              className="flex flex-col items-center text-xs cursor-pointer"
              onClick={() => handleNavClick(item.to)}
            >
              <img
                src={isActive ? item.iconActive : item.icon}
                alt={item.label}
                className="h-6 w-6 mb-0.5"
              />
              <span className={isActive ? 'text-orange-500' : 'text-gray-500'}>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
