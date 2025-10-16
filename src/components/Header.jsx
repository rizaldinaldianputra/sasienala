// src/components/Header.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('WOMEN');
  const navigate = useNavigate();

  const menuItems = {
    WOMEN: ['New', 'Apparel', 'Bag', 'Shoes', 'Beauty'],
    MAN: ['New', 'Apparel', 'Bag', 'Shoes', 'Accessories'],
    KIDS: ['New', 'Apparel', 'Toys', 'Shoes', 'School Supplies'],
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleCartSearch = () => {
    navigate('/product');
  };

  return (
    <>
      {/* Header sticky di atas */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <button className="text-gray-700" onClick={() => setIsOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <img src="/logo.png" alt="SASIENALA" className="h-10" />
        </div>

        <div className="flex items-center space-x-4">
          <div onClick={handleCartSearch} className="cursor-pointer">
            <img src="/search.svg" alt="Search" className="h-8 cursor-pointer" />
          </div>

          <div onClick={handleCartClick} className="cursor-pointer">
            <img src="/bag.svg" alt="Bag" className="h-8" />
          </div>
        </div>
      </header>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-30" onClick={() => setIsOpen(false)}></div>
          <div className="relative w-72 bg-white h-full shadow-xl p-4 overflow-y-auto">
            <button className="mb-4 text-gray-700" onClick={() => setIsOpen(false)}>
              ✕
            </button>

            <div className="flex space-x-4 mb-4 border-b">
              {['WOMEN', 'MAN', 'KIDS'].map((tab) => (
                <button
                  key={tab}
                  className={`pb-1 font-semibold ${
                    activeTab === tab
                      ? 'border-b-2 border-orange-400 text-orange-400'
                      : 'text-gray-400'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <ul className="space-y-2 text-gray-700 text-sm">
              {menuItems[activeTab].map((item) => (
                <li key={item} className="flex justify-between items-center">
                  {item} <span>⌄</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2 text-orange-400 text-sm">
              <div>Campaign</div>
              <div>Event and Blog</div>
            </div>

            <div className="mt-6 flex items-center space-x-2 text-gray-500 text-sm">
              <span>📞</span>
              <span>8122338033</span>
            </div>

            <div className="mt-4 flex space-x-2">
              <img src="/tiktok.svg" alt="TikTok" className="h-8" />
              <img src="/instagram.svg" alt="Instagram" className="h-8" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
