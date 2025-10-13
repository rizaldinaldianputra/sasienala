import { useEffect, useState } from 'react';
import { FiFilter, FiGrid, FiHeart, FiList, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { useProducts } from '../hook/useProduct';
import { productService } from '../service/product_service';

const Product = () => {
  const [searchKey, setSearchKey] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [localProducts, setLocalProducts] = useState([]);

  const {
    data,
    loading,
    error,
    searchProduct,
    refetch,
    fetchProductsByCategory: fetchByCategory,
  } = useProducts();

  // ambil kategori produk
  useEffect(() => {
    productService
      .getProductCategory()
      .then((res) => setCategories(res))
      .catch((err) => console.error(err));
  }, []);

  // handle search submit
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const key = searchKey.trim();

    if (key === '') {
      await refetch();
      setSelectedCategory(null);
      setLocalProducts([]);
    } else {
      await searchProduct(key);
      if (!searchHistory.includes(key)) {
        setSearchHistory([key, ...searchHistory]);
      }
      setSelectedCategory(null);
      setLocalProducts([]);
    }
  };

  const handleRemoveHistory = (key) => {
    setSearchHistory(searchHistory.filter((item) => item !== key));
  };

  const handleCategorySelect = async (categoryId) => {
    if (categoryId === selectedCategory) {
      setSelectedCategory(null);
      setLocalProducts([]);
      await refetch();
    } else {
      setSelectedCategory(categoryId);
      const res = await fetchByCategory(categoryId); // harus mengembalikan object
      const productList = res?.products ?? []; // ambil array products
      setLocalProducts(productList);
    }
  };
  console.log('selectedCategory', selectedCategory);
  console.log('localProducts', localProducts);

  // normalisasi productList
  const productList = selectedCategory ? localProducts : data?.data ?? [];

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
          {categories.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => handleCategorySelect(cat.category_id)}
              className={`px-4 py-2 text-sm rounded-full whitespace-nowrap ${
                selectedCategory === cat.category_id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {cat.display_category_name}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        )}

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
                  <p className="text-sm text-gray-700">{item.item_name}</p>
                  <p className="text-orange-600 font-semibold text-sm">
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
