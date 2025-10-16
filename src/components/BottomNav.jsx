// src/components/BottomNav.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { getToken } from '../session/session'; // pastikan path benar

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      label: 'Chat',
      icon: '/icons/chat.svg',
      iconActive: '/icons/chat-active.svg',
    },
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
    if (to === '/account' && !getToken()) {
      navigate('/login');
    } else {
      navigate(to);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white flex justify-around py-2 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <div
            key={item.to}
            className="flex flex-col items-center text-sm cursor-pointer"
            onClick={() => handleNavClick(item.to)}
          >
            <img
              src={isActive ? item.iconActive : item.icon}
              alt={item.label}
              className="h-6 w-6 mb-1"
            />
            <span className={isActive ? 'text-orange-500' : 'text-gray-500'}>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
