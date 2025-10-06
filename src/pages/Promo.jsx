// src/pages/Home.jsx (atau di mana pun Anda ingin meletakkannya)
import React from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const Promo = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <Header />

      {/* --- BAGIAN BODY LENGKAP DIMULAI DI SINI --- */}
      <div className="p-4 sm:p-6 flex justify-center flex-grow">
        <div className="bg-white rounded-lg shadow-md p-5 w-full max-w-md">

          {/* PROMO PRODUK */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
              PROMO PRODUK <span className="ml-2 text-xl">🔥</span>
            </h2>
            <div className="bg-orange-100 p-3 rounded-lg mb-2 flex justify-between items-center text-sm">
              <span className="text-gray-800">Promo Beli 2 kemeja basic diskon 10%...</span>
              <a href="#" className="text-orange-600 font-medium hover:underline">Lihat produk</a>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg mb-2 flex justify-between items-center text-sm">
              <span className="text-gray-800">Promo Beli 2 kemeja basic diskon 10%...</span>
              <a href="#" className="text-orange-600 font-medium hover:underline">Lihat produk</a>
            </div>
          </div>

          {/* VOUCHER */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-3 border-b border-gray-300 pb-2">
              VOUCHER
            </h2>
            {/* Voucher Item 1 */}
            <div className="bg-orange-100 p-3 rounded-lg mb-2 flex justify-between items-center text-sm">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-md mr-3 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L10.414 11H13a1 1 0 100-2h-3V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">HEMAT50</p>
                  <p className="text-gray-600">Diskon 50rb minimal belanja 200rb</p>
                </div>
              </div>
              <button className="bg-white text-orange-600 font-medium py-1 px-3 rounded-md shadow-sm hover:bg-gray-50">
                Klaim
              </button>
            </div>
            {/* Voucher Item 2 */}
            <div className="bg-orange-100 p-3 rounded-lg mb-2 flex justify-between items-center text-sm">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-md mr-3 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L10.414 11H13a1 1 0 100-2h-3V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">GRATISONGKIR</p>
                  <p className="text-gray-600">Gratis Ongkir maksimal 15rb</p>
                </div>
              </div>
              <button className="bg-white text-orange-600 font-medium py-1 px-3 rounded-md shadow-sm hover:bg-gray-50">
                Klaim
              </button>
            </div>
          </div>

          {/* LOYALTY POINT */}
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-3 border-b border-gray-300 pb-2">
              LOYALTY POINT
            </h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 text-sm">
              <li>Kumpulkan points setiap transaksi langsung</li>
              <li>Siap naik level : Circle --&gt; Silver --&gt; Gold --&gt; Platinum
                <p className="ml-5 text-gray-600">Dapatkan berbagai benefit di tiap levelnya.</p>
              </li>
              <li>Tukarkan point dengan diskon dan hadiah</li>
            </ol>
          </div>

        </div>
      </div>
      {/* --- BAGIAN BODY LENGKAP BERAKHIR DI SINI --- */}

      <BottomNav />
    </div>
  );
};

export default Promo;