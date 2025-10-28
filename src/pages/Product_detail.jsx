// src/pages/ProductDetail.jsx
import { useEffect, useRef, useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { COLORS } from '../constants/colors';
import { useCart } from '../hook/useCart';
import { useProducts } from '../hook/useProduct';
import { productService } from '../service/product_service';
import { getToken, getUserId } from '../session/session';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ====== Hooks & State ======
  const [searchKey, setSearchKey] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [localProducts, setLocalProducts] = useState([]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const imageContainerRef = useRef();
  const fetchedRef = useRef(false);

  const { data, loading, error, searchProduct, refetch, fetchProductsByCategory } = useProducts();
  const { product, fetchProductById } = useProducts(false);
  const { addCartItem } = useCart();

  // ====== Fetch kategori produk ======
  useEffect(() => {
    productService
      .getProductCategory()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ====== Ambil product by id ======
  useEffect(() => {
    if (!id || fetchedRef.current) return;
    fetchProductById(Number(id));
    fetchedRef.current = true;
  }, [id]);

  // ====== Set default color, size, stock, price, image list ======
  useEffect(() => {
    if (product) {
      if (product.model_list && product.model_list.length > 0) {
        const defaultColor = product.model_list[0].color;
        setSelectedColor(defaultColor);

        if (product.model_list[0].size_list.length > 0) {
          const defaultSize = product.model_list[0].size_list[0].size;
          setSelectedSize(defaultSize);

          const defaultSizeModel = product.model_list[0].size_list[0];
          setStock(defaultSizeModel.stock || 0);
          setPrice(defaultSizeModel.price || 0);
        }
      }

      if (product.image_list && product.image_list.length > 0) {
        setImageList(product.image_list);
        setSelectedImage(0);
      }
    }
  }, [product]);

  // ====== Update imageList dan size saat color berubah ======
  useEffect(() => {
    if (selectedColor && product?.model_list) {
      const colorModel = product.model_list.find((m) => m.color === selectedColor);

      if (colorModel && colorModel.image) {
        setImageList([
          colorModel.image,
          ...product.image_list.filter((img) => img !== colorModel.image),
        ]);
        setSelectedImage(0);

        if (colorModel.size_list.length > 0) {
          setSelectedSize(colorModel.size_list[0].size);
          setStock(colorModel.size_list[0].stock || 0);
          setPrice(colorModel.size_list[0].price || 0);
        }
      }
    }
  }, [selectedColor, product]);

  // ====== Update stock & price saat size berubah ======
  useEffect(() => {
    if (selectedColor && selectedSize && product?.model_list) {
      const colorModel = product.model_list.find((m) => m.color === selectedColor);
      if (!colorModel) return;
      const sizeModel = colorModel.size_list.find((s) => s.size === selectedSize);
      if (!sizeModel) return;

      setStock(sizeModel.stock || 0);
      setPrice(sizeModel.price || 0);
    }
  }, [selectedSize, selectedColor, product]);

  // ====== Fungsi ambil product list sesuai kondisi ======
  const getProductList = async (options = {}) => {
    const { search = '', categoryId = null } = options;

    if (search) {
      await searchProduct(search);
      setSelectedCategory(null);
      setLocalProducts([]);
      if (!searchHistory.includes(search)) {
        setSearchHistory([search, ...searchHistory]);
      }
    } else if (categoryId) {
      setSelectedCategory(categoryId);
      const res = await fetchProductsByCategory(categoryId);
      setLocalProducts(res?.data.products ?? []);
    } else {
      setSelectedCategory(null);
      setLocalProducts([]);
      await refetch();
    }
  };

  // ====== Handler search submit ======
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const key = searchKey.trim();
    getProductList({ search: key });
  };

  const handleRemoveHistory = (key) => {
    setSearchHistory(searchHistory.filter((item) => item !== key));
  };

  const handleCategorySelect = (categoryId) => {
    if (categoryId === selectedCategory) {
      getProductList();
    } else {
      getProductList({ categoryId });
    }
  };

  const productList = selectedCategory ? localProducts : data?.data ?? [];

  // ====== Handle fullscreen image ======
  const handleFullscreen = () => {
    if (imageContainerRef.current) {
      if (imageContainerRef.current.requestFullscreen) {
        imageContainerRef.current.requestFullscreen();
      } else if (imageContainerRef.current.webkitRequestFullscreen) {
        imageContainerRef.current.webkitRequestFullscreen();
      } else if (imageContainerRef.current.msRequestFullscreen) {
        imageContainerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true); // <- ini penting
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullscreen(false);
  };

  // ====== Handle add to cart ======
  const handleAddToCart = async () => {
    const token = getToken();
    if (!token) {
      alert('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    if (!selectedColor) {
      alert('Silakan pilih warna');
      return;
    }
    if (!selectedSize) {
      alert('Silakan pilih ukuran');
      return;
    }

    const colorModel = product.model_list.find((m) => m.color === selectedColor);
    if (!colorModel) {
      alert('Pilihan warna tidak valid');
      return;
    }

    const sizeModel = colorModel.size_list.find((s) => s.size === selectedSize);
    if (!sizeModel) {
      alert('Pilihan ukuran tidak valid');
      return;
    }

    if (sizeModel.stock <= 0) {
      alert('Stok tidak tersedia');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      alert('User tidak ditemukan, silakan login');
      navigate('/login');
      return;
    }

    try {
      const result = await addCartItem(userId, product.item_id, sizeModel.model_id, quantity);
      setShowModal(false);

      if (result.success) {
        alert('Berhasil ditambahkan ke keranjang');
      } else {
        alert(result.message || 'Gagal menambahkan ke keranjang');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan, coba lagi nanti');
    }
  };

  // ====== Dummy reviews ======
  const dummyReviews = [
    {
      username: 'p******g',
      rating: 5,
      comment:
        'Kalo beli kemeja putih di olshop kadang suka pesimis, lah kok pas beli ini bagus banget?? Ga expect bakal bagus begini bahannya.',
      images: [
        'https://picsum.photos/200/300',
        'https://picsum.photos/200/300',
        'https://picsum.photos/200/300',
      ],
      time: '2 minggu lalu',
      helpful: 187,
    },
    {
      username: 'a******k',
      rating: 4,
      comment: 'Bahannya nyaman, tapi ukurannya agak besar untuk saya.',
      images: [
        'https://picsum.photos/200/300',
        'https://picsum.photos/200/300',
        'https://picsum.photos/200/300',
      ],
      time: '1 bulan lalu',
      helpful: 45,
    },
  ];

  // ====== Conditional render loading/error ======
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Loading product...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">
        {error}
      </div>
    );
  if (!product) return null;

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      : 0;
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <div className="flex items-center justify-between px-4 h-12 bg-white shadow-md">
        {/* Back Button */}
        <button onClick={() => navigate('/')} className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="font-['Tenor_Sans'] font-normal text-[18px] leading-[40px] tracking-[4px] text-gray-700">
          DETAIL
        </span>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Share Icon */}

          {/* Cart Icon */}
          <button className="flex items-center justify-center">
            <img
              src="/bag.svg"
              alt="Cart"
              onClick={() => navigate('/cart')}
              className="h-6 w-6 object-contain"
            />
          </button>
        </div>
      </div>
      {imageList.length > 0 && (
        <div className="relative bg-white" ref={imageContainerRef}>
          <img src={imageList[selectedImage]} alt={product.item_name} className="w-full h-auto" />

          {/* Tombol fullscreen hanya tampil saat belum fullscreen */}
          {!isFullscreen && (
            <button
              onClick={handleFullscreen}
              className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center rounded-full border border-black/50 bg-black/50 hover:bg-black/70"
            >
              <img src="/resize.png" alt="Fullscreen" className="w-5 h-5" />
            </button>
          )}

          {/* Tombol minimize/back hanya muncul saat fullscreen */}
          {isFullscreen && (
            <button
              onClick={exitFullscreen}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full border border-black/50 bg-black/50 hover:bg-black/70"
            >
              <img src="/resize.png" alt="Minimize" className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto py-2">
        <div className="flex gap-2 min-w-max px-2">
          {imageList.map((img, idx) => (
            <img
              key={idx}
              src={img}
              onClick={() => setSelectedImage(idx)}
              className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${
                selectedImage === idx ? 'border-orange-500' : 'border-transparent'
              }`}
              alt={`thumbnail-${idx}`}
            />
          ))}
        </div>
      </div>
      <div className="p-4 bg-white mb-4">
        <div className="flex items-start gap-2 mb-1">
          <h1 className="text-gray-600 mb-2 font-tenor text-[15px]">{product.item_name}</h1>
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
            <span className="font-tenor text-[12px] text-gray-600">4.8 Ratings</span>
          </div>
        </div>
        {selectedColor && selectedSize && (
          <div className="flex flex-col items-start">
            <p className="font-tenor text-[18px]" style={{ color: COLORS.primary }}>
              Rp {price.toLocaleString('id-ID')}
            </p>
          </div>
        )}

        {product.brand && (
          <p className="text-gray-600 mb-2 font-tenor text-[15px]">{product.brand}</p>
        )}
        {product.reviews && product.reviews.length > 0 && (
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(averageRating) ? 'fill-current' : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
            <span className="text-sm text-gray-600 ml-2">({product.reviews.length} Ulasan)</span>
          </div>
        )}
      </div>
      {selectedColor && selectedSize && (
        <div className="px-4 mb-4 flex flex-col gap-3 max-w-sm mx-auto font-tenor">
          {/* Klik Color */}
          <div
            className="flex justify-between items-center border rounded-md px-3 py-2 text-sm cursor-pointer min-h-[48px] hover:bg-gray-100 active:scale-95 transition"
            onClick={setShowModal}
          >
            <span className="font-medium">Color</span>
            <span className="flex items-center gap-1">
              {selectedColor}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          {/* Klik Size */}
          <div
            className="flex justify-between items-center border rounded-md px-3 py-2 text-sm cursor-pointer min-h-[48px] hover:bg-gray-100 active:scale-95 transition"
            onClick={setShowModal}
          >
            <span className="font-medium">Size</span>
            <span className="flex items-center gap-1">
              {selectedSize}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      )}

      <div className="bottom-16 left-0 right-0 flex justify-center items-center px-4 z-40 gap-3">
        {/* Container icon message */}
        <div
          className=" p-3 flex items-center justify-center shadow-md cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src="/chat_product.png" alt="Chat" className="w-6 h-6 object-contain" />
        </div>

        {/* Tombol tambah ke keranjang */}
        <button onClick={() => setShowModal(true)}>
          <img
            src="/cart.png" // ganti dengan path image kamu
            alt="Tambah ke Keranjang"
            className="w-full h-full object-cover rounded-md"
          />
        </button>
      </div>
      <p
        className="text-base leading-relaxed text-gray-600 m-3 mt-8 font-tenor whitespace-pre-line"
        style={{ fontFamily: "'Work Sans', sans-serif" }}
      >
        {product.description}
      </p>

      <div className="p-4 bg-white mb-4 rounded-md shadow-md font-sans">
        <h2 className="font-sans text-base tracking-wide text-gray-600 m-0 mb-2">
          ULASAN DI MARKETPLACE
        </h2>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${i < 5 ? 'fill-current' : 'text-gray-300'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
          </div>
          <div className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer">
            Lihat Semua Ulasan &rarr;
          </div>
        </div>

        <div className="text-lg font-semibold mb-2">4.9 /5.0</div>
        <span className="text-sm text-gray-600">6,9RB Penilaian</span>

        {dummyReviews.map((review, idx) => (
          <div key={idx} className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{review.username}</span>
              <span className="text-yellow-500 flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                ))}
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
            <div className="flex gap-2 mb-2">
              {review.images.map((img, i) => (
                <img key={i} src={img} className="w-12 h-12 object-cover rounded-md" alt="ulasan" />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{review.time}</span>
              <span>Membantu ({review.helpful})</span>
            </div>
          </div>
        ))}
      </div>
      <h1
        className="font-tenor text-[18px] text-gray-600 text-center mb-2"
        style={{ lineHeight: '40px', letterSpacing: '4px' }}
      >
        You may also like
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {productList.slice(0, 4).map((item) => (
          <Link key={item.item_id} to={`/product/${item.item_id}`} className="block relative group">
            <img src={item.image || 'https://via.placeholder.com/200x300'} alt={item.item_name} />
            <button className="absolute top-2 right-2 bg-white/70 rounded-full p-1">
              <FiHeart className="text-gray-500" />
            </button>
            <div className="mt-2">
              <p className="text-[12px] leading-[18px] tracking-[0px] text-gray-700 font-['Tenor_Sans'] font-normal">
                {item.item_name}
              </p>
              <p
                className="text-[14px] leading-[24px] font-normal font-['Tenor_Sans']"
                style={{ color: COLORS.primary }}
              >
                Rp.{item.price?.toLocaleString('id-ID')}
              </p>

              <p className="text-[12px] font-normal font-['Tenor_Sans'] text-gray-500">
                ⭐ {item.rating ?? 0} Ratings
              </p>
            </div>
          </Link>
        ))}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-t-2xl p-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>

            {selectedColor && (
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={
                    product.model_list.find((m) => m.color === selectedColor)?.image || imageList[0]
                  }
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border"
                />
                {selectedColor && selectedSize && (
                  <div className="flex flex-col items-start gap-1">
                    <p className="text-2xl font-bold text-orange-600">
                      Rp {price.toLocaleString('id-ID')}
                    </p>
                    <span className="text-sm text-gray-500">Stok: {stock}</span>
                    {/* TextField untuk warna dan size */}
                    <input
                      type="text"
                      readOnly
                      value={`Color - ${selectedColor}`}
                      className="border rounded-md px-2 py-1 text-sm w-full mt-2"
                    />
                    <input
                      type="text"
                      readOnly
                      value={`Size - ${selectedSize}`}
                      className="border rounded-md px-2 py-1 text-sm w-full mt-1"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Warna</h3>
              <div className="flex flex-wrap gap-2">
                {product.model_list.map((color) => {
                  const colorKey = color.color;
                  return (
                    <button
                      key={colorKey}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedColor === colorKey ? 'border-orange-500' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.color_code || '#fff' }}
                      onClick={() => setSelectedColor(colorKey)}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Ukuran</h3>
              <div className="flex flex-wrap gap-2">
                {product.model_list
                  .find((m) => m.color === selectedColor)
                  ?.size_list?.map((size) => (
                    <button
                      key={size.model_id}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 ${
                        selectedSize === size.size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedSize(size.size)}
                    >
                      {size.size}
                    </button>
                  ))}
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Jumlah</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-lg text-gray-600"
                >
                  −
                </button>
                <span className="px-4 text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 text-lg text-gray-600"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className=" p-3 flex items-center justify-center shadow-md cursor-pointer"
                onClick={() => navigate('/')}
              >
                <img src="/chat_product.png" alt="Chat" className="w-6 h-6 object-contain" />
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex justify-center items-center py-3 px-4 rounded-md hover:brightness-90 transition-shadow duration-200"
              >
                <img
                  src="/cart.png"
                  alt="Tambah ke Keranjang"
                  className="w-full h-12 object-cover"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
