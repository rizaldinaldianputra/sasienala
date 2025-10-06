// src/pages/TransactionHistoryPage.jsx
import React, { useState } from 'react';
import Header from '../components/Header'; // Asumsi Anda memiliki komponen Header
import BottomNav from '../components/BottomNav'; // Asumsi Anda memiliki komponen BottomNav

const Transaksi = () => {
  const [activeTab, setActiveTab] = useState('Semua Status');

  // Data dummy untuk demonstrasi
  const transactions = [
    {
      id: 1,
      status: 'Sedang Dikirim',
      date: '12 Sep 2025',
      items: [{ name: 'Recycle Boucle Knit Cardigan..', qty: 1, image: 'https://picsum.photos/seed/picsum/200/300' }],
      total: 'Rp. 120.000',
      actionButton: 'Lacak'
    },
    {
      id: 2,
      status: 'Selesai',
      date: '12 Sep 2025',
      items: [{ name: 'Recycle Boucle Knit Cardigan..', qty: 1, image: 'https://picsum.photos/seed/picsum/200/300' }],
      total: 'Rp. 120.000',
      actionButton: 'Beli Lagi'
    }
  ];

  // Filter transaksi berdasarkan tab aktif (untuk contoh sederhana)
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'Semua Status') return true;
    return tx.status === activeTab; // Ini perlu disesempurnakan jika ada banyak status
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20"> {/* pb-20 untuk BottomNav */}
      <Header />

      {/* --- BAGIAN BODY TRANSAKSI DIMULAI DI SINI --- */}
      <div className="flex-grow"> {/* flex-grow agar konten mengisi ruang */}
        {/* Tab Navigation */}
        <div className="bg-white shadow-sm overflow-x-auto flex border-b border-gray-200">
          {[
            'Semua Status', 
            'Sedang Diproses', 
            'Sedang Dikirim', 
            'Selesai', 
            'Dibatalkan' // Contoh status lain
          ].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium ${
                activeTab === tab
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
          {/* Untuk panah kanan jika diperlukan, Anda bisa menambahkannya di sini */}
        </div>

        {/* Transaction List */}
        <div className="p-4 sm:p-6 space-y-4">
          {filteredTransactions.map(transaction => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}

          {/* Jika tidak ada transaksi */}
          {filteredTransactions.length === 0 && (
            <div className="text-center text-gray-500 mt-8">Tidak ada transaksi di status ini.</div>
          )}
        </div>
      </div>
      {/* --- BAGIAN BODY TRANSAKSI BERAKHIR DI SINI --- */}

      <BottomNav />
    </div>
  );
};

// Komponen Pembantu untuk Kartu Transaksi
const TransactionCard = ({ transaction }) => {
  const { status, date, items, total, actionButton } = transaction;

  const getActionButtonClass = (buttonText) => {
    if (buttonText === 'Lacak') {
      return 'bg-orange-500 text-white hover:bg-orange-600';
    } else if (buttonText === 'Beli Lagi') {
      return 'bg-orange-500 text-white hover:bg-orange-600';
    }
    return 'bg-gray-200 text-gray-800 hover:bg-gray-300'; // Default
  };

  const getStatusColor = (statusText) => {
    if (statusText === 'Sedang Dikirim') {
      return 'text-orange-600';
    } else if (statusText === 'Selesai') {
      return 'text-green-600';
    }
    return 'text-gray-600'; // Default
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header Kartu Transaksi */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-sm font-semibold text-gray-700">Belanja</span>
          <span className="text-xs text-gray-500 ml-2">{date}</span>
        </div>
        <span className={`text-sm font-semibold ${getStatusColor(status)}`}>{status}</span>
      </div>

      {/* Item Transaksi */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center mb-3">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-16 h-16 object-cover rounded-md mr-3" 
          />
          <div>
            <p className="text-sm font-medium text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-500">{item.qty} barang</p>
          </div>
        </div>
      ))}

      {/* Footer Kartu Transaksi */}
      <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500">Total Belanja</p>
          <p className="text-base font-semibold text-gray-800">{total}</p>
        </div>
        <button className={`py-2 px-4 rounded-md text-sm font-medium ${getActionButtonClass(actionButton)}`}>
          {actionButton}
        </button>
      </div>

      {/* Rating dan Point (hanya untuk status 'Selesai') */}
      {status === 'Selesai' && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex flex-col sm:flex-row items-center justify-between text-sm">
          <span className="text-yellow-800 mb-2 sm:mb-0">Ulas dan Dapatkan Points</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 fill-current ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaksi;