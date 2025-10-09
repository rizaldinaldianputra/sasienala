// src/components/BottomNav.jsx
import { useNavigate } from 'react-router-dom';
import { getToken } from '../session/session'; // pastikan path benar

export default function BottomNav() {
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Chat', icon: '/icons/chat.svg' },
    { to: '/product', label: 'Produk', icon: '/icons/product.svg' },
    { to: '/promo', label: 'Promo', icon: '/icons/promo.svg' },
    { to: '/transaksi', label: 'Transaksi', icon: '/icons/product.svg' },
    { to: '/account', label: 'Akun', icon: '/icons/product.svg' },
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
      {navItems.map((item) => (
        <div
          key={item.to}
          className="flex flex-col items-center text-sm cursor-pointer"
          onClick={() => handleNavClick(item.to)}
        >
          <img src={item.icon} alt={item.label} className="h-6 w-6 mb-1" />
          <span>{item.label}</span>
        </div>
      ))}
    </nav>
  );
}
