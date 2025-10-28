import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hook/useProduct';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const { fetchCategories } = useProducts(false); // false biar tidak auto-fetch semua produk
  const navigate = useNavigate();

  const handleCartClick = () => navigate('/cart');
  const handleCartSearch = () => navigate('/product');

  const handleCategorySelect = (id) => {
    if (selectedCategory === id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(id);
    }
  };

  useEffect(() => {
    const cachedCategories = localStorage.getItem('categories');

    if (cachedCategories) {
      setCategories(JSON.parse(cachedCategories));
    } else {
      let isMounted = true;
      const getCategories = async () => {
        try {
          const cats = await fetchCategories();
          if (isMounted) {
            setCategories(cats || []);
            localStorage.setItem('categories', JSON.stringify(cats || []));
          }
        } catch (err) {
          console.error('Gagal ambil kategori', err);
          if (isMounted) setCategories([]);
        }
      };
      getCategories();
      return () => {
        isMounted = false;
      };
    }
  }, [fetchCategories]);

  return (
    <>
      {/* Header sticky di atas */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <button className="text-gray-700" onClick={() => setIsOpen(true)}>
            <img src="/menu.svg" alt="menu" className="w-6 h-6" />
          </button>
          <img src="/logo.svg" alt="SASIENALA" className="h-10" />
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
            <button
              className="mb-4 text-gray-700 text-lg font-bold"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {/* Categories list */}
            <ul className="space-y-2 mb-4">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li
                    key={cat?.category_id}
                    className={`flex justify-between items-center px-4 py-2 rounded cursor-pointer ${
                      selectedCategory === cat?.category_id
                        ? 'bg-orange-100 text-orange-500 font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleCategorySelect(cat?.category_id)}
                  >
                    {cat?.display_category_name} <span>⌄</span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-400">Loading categories...</li>
              )}
            </ul>

            {/* Lain-lain */}
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
