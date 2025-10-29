import { useEffect, useState } from 'react';
import { FiFilter, FiGrid, FiHeart, FiList, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { COLORS } from '../constants/colors';
import { useProducts } from '../hook/useProduct';
import { productService } from '../service/product_service';

const Product = () => {
  const [searchKey, setSearchKey] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [localProducts, setLocalProducts] = useState([]);

  const { data, loading, error, searchProduct, refetch, fetchProductsByCategory } = useProducts();

  // ambil kategori produk
  useEffect(() => {
    productService
      .getProductCategory()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  // update localProducts saat data hook berubah
  useEffect(() => {
    if (selectedCategory === 'all' && data) {
      const allProducts = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.data?.products)
        ? data.data.products
        : [];
      setLocalProducts(allProducts);
    }
  }, [data, selectedCategory]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const key = searchKey.trim();
    if (key === '') {
      await refetch();
      setSelectedCategory('all');
    } else {
      const res = await searchProduct(key); // panggil search
      if (!searchHistory.includes(key)) {
        setSearchHistory([key, ...searchHistory]);
      }
      setSelectedCategory(null);

      console.log(res);
      // ambil data dari res.data sesuai format respons
      const products = Array.isArray(res?.data) ? res.data : [];
      setLocalProducts(products);
    }
  };

  const handleRemoveHistory = (key) => {
    setSearchHistory(searchHistory.filter((item) => item !== key));
  };

  const handleCategorySelect = async (categoryId) => {
    if (categoryId === 'all') {
      setSelectedCategory('all');
      await refetch(); // refetch supaya data terbaru tersedia
    } else {
      setSelectedCategory(categoryId);
      const res = await fetchProductsByCategory(categoryId);
      setLocalProducts(Array.isArray(res?.data?.products) ? res.data.products : []);
    }
  };

  const productList = Array.isArray(localProducts) ? localProducts : [];

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <Header />

      <div className="min-h-screen bg-white p-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit}>
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 mb-3">
            <FiFilter className="text-gray-500 mr-2" />
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Cari Produk"
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <div className="flex items-center space-x-2">
              <FiGrid className="text-gray-500" />
              <FiList className="text-gray-500" />
            </div>
          </div>
        </form>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchHistory.map((item, i) => (
              <div key={i} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                <span className="mr-2">{item}</span>
                <FiX
                  className="cursor-pointer text-gray-500"
                  onClick={() => handleRemoveHistory(item)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex space-x-3 overflow-x-auto mb-4 pb-2 scrollbar-hide">
          <div
            onClick={() => handleCategorySelect('all')}
            className="cursor-pointer px-4 py-2 text-md whitespace-nowrap border-b-2"
            style={{
              color: selectedCategory === 'all' ? COLORS.primary : '#374151',
              borderBottom:
                selectedCategory === 'all'
                  ? `2px solid ${COLORS.primary}`
                  : '2px solid transparent',
            }}
          >
            All Categories
          </div>

          {categories.map((cat) => (
            <div
              key={cat.category_id}
              onClick={() => handleCategorySelect(cat.category_id)}
              className="cursor-pointer px-4 py-2 text-md whitespace-nowrap border-b-2"
              style={{
                color: selectedCategory === cat.category_id ? COLORS.primary : '#374151',
                borderBottom:
                  selectedCategory === cat.category_id
                    ? `2px solid ${COLORS.primary}`
                    : '2px solid transparent',
              }}
            >
              {cat.display_category_name}
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {!loading && error && <div className="text-center text-red-500 text-sm my-4">{error}</div>}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-4">
            {productList.map((item) => (
              <Link
                key={item.item_id}
                to={`/product/${item.item_id}`}
                className="block relative group"
              >
                <img
                  src={item.image || 'https://via.placeholder.com/200x300'}
                  alt={item.item_name}
                  className="w-full rounded-xl object-cover"
                />
                <button className="absolute top-2 right-2 bg-white/70 rounded-full p-1">
                  <FiHeart className="text-gray-500" />
                </button>
                <div className="mt-2">
                  <p
                    className="text-[12px] leading-tight line-clamp-2"
                    style={{
                      color: '#404040',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.item_name?.length > 36
                      ? item.item_name.substring(0, 36) + '…'
                      : item.item_name}
                  </p>
                  <p className="font-semibold text-sm" style={{ color: '#DD8560' }}>
                    Rp.{item.price?.toLocaleString('id-ID')}
                  </p>

                  <p className="text-xs text-gray-500">⭐ {item.rating ?? 0} Ratings</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Product;
