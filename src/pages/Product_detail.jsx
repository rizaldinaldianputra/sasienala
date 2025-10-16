// src/pages/ProductDetail.jsx
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../hook/useCart';
import { useProducts } from '../hook/useProduct';
import { getUserId } from '../session/session';

const ProductDetail = () => {
  const { id } = useParams();

  // Gunakan hook dengan autoFetchAll = false supaya tidak hit get-products
  const { product, loading, error, fetchProductById } = useProducts(false);
  const { addCartItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);

  // Ref untuk memastikan fetch cuma sekali
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!id || fetchedRef.current) return;
    fetchProductById(Number(id));
    fetchedRef.current = true;
  }, [id]);

  // Set default color, size, image saat product berubah
  useEffect(() => {
    if (product) {
      if (product.model_list && product.model_list.length > 0) {
        const defaultColor = product.model_list[0].color_code || product.model_list[0].color;
        setSelectedColor(defaultColor);

        if (product.model_list[0].size_list.length > 0) {
          const defaultSize = product.model_list[0].size_list[0].size;
          setSelectedSize(defaultSize);

          // Set stock & price default
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

  // Update imageList saat color berubah
  useEffect(() => {
    if (selectedColor && product?.model_list) {
      const colorModel = product.model_list.find(
        (m) => (m.color_code || m.color) === selectedColor,
      );
      if (colorModel && colorModel.image) {
        setImageList([
          colorModel.image,
          ...product.image_list.filter((img) => img !== colorModel.image),
        ]);
        setSelectedImage(0);

        // Set default size, stock & price saat color berubah
        if (colorModel.size_list.length > 0) {
          setSelectedSize(colorModel.size_list[0].size);
          setStock(colorModel.size_list[0].stock || 0);
          setPrice(colorModel.size_list[0].price || 0);
        }
      }
    }
  }, [selectedColor, product]);

  // Update stock & price saat size berubah
  useEffect(() => {
    if (selectedColor && selectedSize && product?.model_list) {
      const colorModel = product.model_list.find(
        (m) => (m.color_code || m.color) === selectedColor,
      );
      if (!colorModel) return;
      const sizeModel = colorModel.size_list.find((s) => s.size === selectedSize);
      if (!sizeModel) return;

      setStock(sizeModel.stock || 0);
      setPrice(sizeModel.price || 0);
    }
  }, [selectedSize, selectedColor, product]);

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

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) return;

    const colorModel = product.model_list.find((m) => (m.color_code || m.color) === selectedColor);
    if (!colorModel) return;

    const sizeModel = colorModel.size_list.find((s) => s.size === selectedSize);
    if (!sizeModel || sizeModel.stock <= 0) {
      alert('Stok tidak tersedia');
      return;
    }

    const userId = getUserId();
    if (!userId) return;

    const result = await addCartItem(userId, product.item_id, sizeModel.model_id, 1);
    alert(result.message);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <Header />

      {/* Product Image Gallery */}
      {imageList.length > 0 && (
        <div className="relative bg-white">
          <img
            src={imageList[selectedImage]}
            alt={product.item_name}
            className="w-full h-80 object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {imageList.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${
                  selectedImage === index ? 'border-orange-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Product Details */}
      <div className="p-4 sm:p-6 bg-white shadow-md mb-4">
        <h1 className="text-xl font-semibold text-gray-800 mb-1">{product.item_name}</h1>
        {product.brand && <p className="text-sm text-gray-600 mb-2">{product.brand}</p>}
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
        {/* Price & Stock */}
        {selectedColor && selectedSize && (
          <div className="flex items-baseline mb-4">
            <p className="text-2xl font-bold text-orange-600 mr-2">
              Rp {price.toLocaleString('id-ID')}
            </p>
            <span className="text-sm text-gray-500 ml-3">Stok: {stock}</span>
          </div>
        )}
      </div>

      {/* Color Selection */}
      {product.model_list && product.model_list.length > 0 && (
        <div className="p-4 sm:p-6 bg-white shadow-md mb-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Warna</h3>
          <div className="flex flex-wrap gap-2">
            {product.model_list.map((color) => {
              const colorKey = color.color_code || color.color;
              return (
                <button
                  key={colorKey}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-[10px] font-medium p-1 text-center ${
                    selectedColor === colorKey ? 'border-orange-500' : 'border-gray-300'
                  }`}
                  style={{
                    backgroundColor: color.color_code || '#fff',
                    color: color.color_code ? 'transparent' : '#000',
                  }}
                  onClick={() => setSelectedColor(colorKey)}
                  title={color.color}
                >
                  {!color.color_code && color.color.length > 6 ? (
                    <span className="truncate">{color.color}</span>
                  ) : (
                    !color.color_code && color.color
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {selectedColor && product.model_list && (
        <div className="p-4 sm:p-6 bg-white shadow-md mb-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Ukuran</h3>
          <div className="flex flex-wrap gap-2">
            {product.model_list
              .find((m) => (m.color_code || m.color) === selectedColor)
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
      )}

      {/* Product Description */}
      <div className="p-4 sm:p-6 bg-white shadow-md mb-4">
        <h1 className="text-xl font-semibold text-gray-800 mb-1">{product.item_name}</h1>
        {product.brand && <p className="text-sm text-gray-600 mb-2">{product.brand}</p>}

        {product.description && <p className="text-sm text-gray-700 mb-3">{product.description}</p>}

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

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 flex items-center justify-between z-20">
        <button className="p-3 border border-gray-300 rounded-md mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
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
        </button>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-orange-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-orange-700 transition-colors duration-200"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
