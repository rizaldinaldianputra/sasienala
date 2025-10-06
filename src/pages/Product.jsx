// src/pages/Product.jsx
import React, { useState } from "react";
import { FiFilter, FiGrid, FiList, FiHeart } from "react-icons/fi";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { Link } from 'react-router-dom';

const Product = () => {
  const [search, setSearch] = useState("lamerei");

  const products = [
    {
      id: 1,
      name: "Kemeja Basic Formal Biru Muda",
      price: 120000,
      rating: 4.8,
      image: "https://picsum.photos/id/237/200/300",
    },
    {
      id: 2,
      name: "Kemeja Basic Formal Abu Muda",
      price: 120000,
      rating: 4.8,
      image: "https://picsum.photos/id/237/200/300",
    },
    {
      id: 3,
      name: "Sweater Rajut Coklat",
      price: 150000,
      rating: 4.9,
      image: "https://picsum.photos/id/237/200/300",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      {/* Header */}
      <Header />

      <div className="min-h-screen bg-white p-4">
        {/* Categories */}
        <div className="flex items-center space-x-4 overflow-x-auto mb-4 text-sm">
          <button className="border-b-2 border-orange-500 pb-1 text-orange-500 whitespace-nowrap">
            All Products
          </button>
          <button className="text-gray-500 whitespace-nowrap">New</button>
          <button className="text-gray-500 whitespace-nowrap">Apparel</button>
          <button className="text-gray-500 whitespace-nowrap">Bag</button>
          <button className="text-gray-500 whitespace-nowrap">Shoes</button>
        </div>

        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 mb-3">
          <FiFilter className="text-gray-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Produk"
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <div className="flex items-center space-x-2">
            <FiGrid className="text-gray-500" />
            <FiList className="text-gray-500" />
          </div>
        </div>

        {/* Filter Tag */}
        <div className="flex flex-wrap gap-2 mb-4">
          {search && (
            <div className="flex items-center bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {search}
              <button
                className="ml-2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearch("")}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Product Grid */}
       <div className="grid grid-cols-2 gap-4">
  {products.map((item) => (
    <Link
      key={item.id}
      to={`/product/${item.id}`}
      className="block relative group"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full rounded-xl object-cover"
      />
      <button className="absolute top-2 right-2 bg-white/70 rounded-full p-1">
        <FiHeart className="text-gray-500" />
      </button>
      <div className="mt-2">
        <p className="text-sm text-gray-700">{item.name}</p>
        <p className="text-orange-600 font-semibold text-sm">
          Rp.{item.price.toLocaleString("id-ID")}
        </p>
        <p className="text-xs text-gray-500">⭐ {item.rating} Ratings</p>
      </div>
    </Link>
  ))}
</div>

      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Product;
