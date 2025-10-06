// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header'; // Asumsi Anda memiliki komponen Header
import BottomNav from '../components/BottomNav'; // Asumsi Anda memiliki komponen BottomNav

// Dummy data untuk produk
const dummyProduct = {
  id: '123',
  name: 'OVERSIZED KEMEJA WANITA COTTON SLUB',
  brand: 'BRAND SAYA', // Asumsi ada nama brand
  price: 'Rp. 189.000',
  discountPrice: 'Rp. 170.100', // Contoh diskon 10%
  rating: 4.8,
  reviewsCount: 16,
  images: [
    'https://picsum.photos/seed/picsum/200/300',
    'https://picsum.photos/seed/picsum/200/300',
    'https://picsum.photos/seed/picsum/200/300',
    'https://picsum.photos/seed/picsum/200/300',
  ],
  colors: [
    { name: 'Peach', hex: '#FFDAB9' },
    { name: 'Brown', hex: '#A52A2A' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
  ],
  sizes: ['S', 'M', 'L', 'XL'],
  material: 'Premium Cotton Slub',
  care: 'Machine washable, do not bleach, tumble dry low.',
  description: `Detail produk: Desain kemeja wanita oversized dengan bahan katun slub premium yang nyaman dan adem. Cocok untuk tampilan kasual maupun semi-formal.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.`,
  shippingInfo: [
    'Gratis ongkir min. belanja 500rb',
    'Estimasi pengiriman 2-5 hari kerja',
    'Garansi pengembalian produk 7 hari',
  ],
  reviews: [
    { id: 1, user: 'User A', rating: 5, comment: 'Bajunya bagus banget, sesuai deskripsi dan nyaman dipakai!', date: '10/08/2024', images: ['https://picsum.photos/200/300', 'https://picsum.photos/200/300'] },
    { id: 2, user: 'User B', rating: 4, comment: 'Pengiriman cepat, kualitas lumayan tapi agak tipis.', date: '08/08/2024', images: ['https://picsum.photos/200/300'] },
  ],
  relatedProducts: [
    { id: '456', name: 'Hoodie Oversized Pria', price: 'Rp. 250.000', image: 'https://picsum.photos/200/300' },
    { id: '789', name: 'Sweater Rajut Wanita', price: 'Rp. 220.000', image: 'https://picsum.photos/200/300' },
    { id: '101', name: 'Kemeja Casual Pria', price: 'Rp. 199.000', image: 'https://picsum.photos/200/300' },
    { id: '112', name: 'Celana Panjang Cargo', price: 'Rp. 300.000', image: 'https://picsum.photos/200/300' },
  ]
};

const ProductDetail = () => {
  const { id } = useParams(); // Mengambil ID dari URL
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    // Di sini Anda akan mengambil data produk dari API berdasarkan 'id'
    // Untuk saat ini, kita gunakan dummy data
    setProduct(dummyProduct); 
    if (dummyProduct.colors && dummyProduct.colors.length > 0) {
      setSelectedColor(dummyProduct.colors[0].name);
    }
    if (dummyProduct.sizes && dummyProduct.sizes.length > 0) {
      setSelectedSize(dummyProduct.sizes[0]);
    }
  }, [id]); // id sebagai dependency agar data di-fetch ulang jika ID berubah

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Loading product...
      </div>
    );
  }

  const averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20"> {/* pb-20 untuk BottomNav */}
      <Header />

      {/* --- BAGIAN BODY DETAIL PRODUK DIMULAI DI SINI --- */}
      <div className="flex-grow">
        {/* Product Image Gallery */}
        <div className="relative bg-white">
          <img 
            src={product.images[selectedImage]} 
            alt={product.name} 
            className="w-full h-80 object-cover" 
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {product.images.map((img, index) => (
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

        {/* Product Details Section */}
        <div className="p-4 sm:p-6 bg-white shadow-md mb-4">
          <h1 className="text-xl font-semibold text-gray-800 mb-1">{product.name}</h1>
          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
          
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`h-4 w-4 ${i < Math.floor(averageRating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
            <span className="text-sm text-gray-600 ml-2">({product.reviewsCount} Ulasan)</span>
          </div>

          <div className="flex items-baseline mb-4">
            <p className="text-2xl font-bold text-orange-600 mr-2">{product.discountPrice}</p>
            <p className="text-base text-gray-500 line-through">{product.price}</p>
          </div>
          
          <div className="flex justify-between items-center mb-4 text-sm">
            <span className="text-gray-700">Tersedia 100 stok</span>
            <span className="text-gray-700">Terjual 50</span>
          </div>
        </div>

        {/* Color Selection */}
        <div className="p-4 sm:p-6 bg-white shadow-md mb-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Warna</h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map(color => (
              <button
                key={color.name}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === color.name ? 'border-orange-500' : 'border-gray-300'
                } flex items-center justify-center`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color.name)}
                title={color.name}
              >
                {selectedColor === color.name && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white drop-shadow-sm" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="p-4 sm:p-6 bg-white shadow-md mb-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Ukuran</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(size => (
              <button
                key={size}
                className={`px-4 py-2 rounded-md border-2 text-sm font-medium ${
                  selectedSize === size
                    ? 'border-orange-500 bg-orange-500 text-white'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-100'
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Material & Detail */}
        <div className="p-4 sm:p-6 bg-white shadow-md mb-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">MATERIAL & DETAIL</h3>
          <p className="text-sm text-gray-700 mb-2 whitespace-pre-line">{product.description}</p>
          <div className="text-sm text-gray-700 mt-4">
            <p><span className="font-semibold">Material:</span> {product.material}</p>
            <p><span className="font-semibold">Cara Perawatan:</span> {product.care}</p>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="p-4 sm:p-6 bg-white shadow-md mb-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">INFORMASI PENGIRIMAN</h3>
          <div className="space-y-2 text-sm text-gray-700">
            {product.shippingInfo.map((info, index) => (
              <div key={index} className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{info}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Reviews */}
        <div className="p-4 sm:p-6 bg-white shadow-md mb-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
            ULASAN PELANGGAN ({product.reviews.length})
            <span className="text-yellow-500 ml-2 flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`h-4 w-4 ${i < Math.floor(averageRating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
            <span className="text-sm text-gray-600 ml-1">({averageRating.toFixed(1)})</span>
          </h3>
          
          {product.reviews.map(review => (
            <div key={review.id} className="border-t border-gray-200 pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0">
              <div className="flex items-center mb-2">
                <p className="font-semibold text-gray-800 text-sm">{review.user}</p>
                <span className="text-yellow-500 ml-2 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </span>
                <span className="text-xs text-gray-500 ml-2">{review.date}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
              {review.images.length > 0 && (
                <div className="flex space-x-2 mt-2">
                  {review.images.map((img, i) => (
                    <img key={i} src={img} alt={`Review ${review.id} img ${i}`} className="w-16 h-16 object-cover rounded-md" />
                  ))}
                </div>
              )}
            </div>
          ))}
          <button className="w-full mt-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium">
            Lihat Semua Ulasan
          </button>
        </div>

        {/* You May Also Like Section */}
        <div className="p-4 sm:p-6 bg-white shadow-md mb-4">
          <h3 className="text-base font-semibold text-gray-800 mb-4">YOU MAY ALSO LIKE</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {product.relatedProducts.map(related => (
              <div key={related.id} className="flex flex-col items-center text-center">
                <img src={related.image} alt={related.name} className="w-full h-32 object-cover rounded-md mb-2" />
                <p className="text-sm text-gray-700 leading-tight">{related.name}</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{related.price}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
      {/* --- BAGIAN BODY DETAIL PRODUK BERAKHIR DI SINI --- */}

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 flex items-center justify-between z-20">
        <button className="p-3 border border-gray-300 rounded-md mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button className="flex-1 bg-orange-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-orange-700 transition-colors duration-200">
          Tambah ke Keranjang
        </button>
      </div>
      
      {/* BottomNav (jika ada, pastikan tidak tumpang tindih dengan action bar) */}
      {/* Jika BottomNav Anda fixed, Anda mungkin perlu menyesuaikan margin atau hanya menampilkan salah satunya */}
      {/* <BottomNav /> */} 
      {/* Saya sengaja mengkomentari BottomNav di sini karena seringkali halaman detail produk memiliki action bar sendiri */}
    </div>
  );
};

export default ProductDetail;