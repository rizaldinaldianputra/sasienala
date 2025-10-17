// src/pages/TransactionHistoryPage.jsx
import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { useCheckout } from '../hook/useCheckout';
import { useOrders } from '../hook/useOrder';

const Transaksi = () => {
  const [activeTab, setActiveTab] = useState('Semua Status');
  const [showLoading, setShowLoading] = useState(false);
  const { orders, loading, error, refetch } = useOrders();

  // Filter transaksi berdasarkan tab aktif
  const filteredTransactions = orders.filter((tx) => {
    if (activeTab === 'Semua Status') return true;
    return tx.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 relative">
      <Header />

      <div className="flex-grow">
        {/* Tab Navigation */}
        <div className="bg-white shadow-sm overflow-x-auto flex border-b border-gray-200">
          {['Semua Status', 'pending', 'shipped', 'completed', 'canceled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium ${
                activeTab === tab
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'pending'
                ? 'Sedang Diproses'
                : tab === 'shipped'
                ? 'Sedang Dikirim'
                : tab === 'completed'
                ? 'Selesai'
                : tab === 'canceled'
                ? 'Dibatalkan'
                : 'Semua Status'}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="p-4 sm:p-6 space-y-4">
          {loading && <div className="text-center text-gray-500">Loading...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          {!loading && !error && filteredTransactions.length === 0 && (
            <div className="text-center text-gray-500 mt-8">Tidak ada transaksi di status ini.</div>
          )}
          {!loading &&
            !error &&
            filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                refetch={refetch}
                setShowLoading={setShowLoading}
              />
            ))}
        </div>
      </div>

      <BottomNav />

      {/* Loading Spinner Overlay */}
      {showLoading && (
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      )}
    </div>
  );
};

// Komponen Pembantu untuk Kartu Transaksi
const TransactionCard = ({ transaction, refetch, setShowLoading }) => {
  const { confirmPayment } = useCheckout();
  const {
    status,
    payment_status,
    created_at,
    items,
    final_total,
    snap_token,
    id: order_id,
  } = transaction;

  const getStatusColor = (statusText) => {
    if (statusText === 'pending') return 'text-orange-600';
    if (statusText === 'shipped') return 'text-orange-600';
    if (statusText === 'completed' || statusText === 'paid') return 'text-green-600';
    if (statusText === 'canceled') return 'text-red-500';
    return 'text-gray-600';
  };

  const handleBayarSekarang = () => {
    if (!snap_token) {
      alert('Snap token tidak tersedia!');
      return;
    }

    window.snap.pay(snap_token, {
      onSuccess: async (result) => {
        setShowLoading(true); // tampilkan spinner
        console.log('Pembayaran berhasil:', result);
        const payloadConfirm = {
          order_id: order_id,
          snap_response: result,
        };
        try {
          const confirmRes = await confirmPayment(payloadConfirm);
          alert(confirmRes?.message || 'Pembayaran berhasil!');

          // REFRESH LIST TRANSAKSI
          if (refetch) await refetch();
        } catch (err) {
          console.error('Error confirm payment:', err);
          alert('Terjadi kesalahan saat konfirmasi pembayaran.');
        } finally {
          setShowLoading(false); // sembunyikan spinner
        }
      },
      onPending: (result) => {
        console.log('Pembayaran pending:', result);
      },
      onError: (result) => {
        console.log('Pembayaran gagal:', result);
        alert('Pembayaran gagal, silakan coba lagi.');
      },
      onClose: () => {
        alert('Anda menutup popup pembayaran.');
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header Kartu Transaksi */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span className="text-sm font-semibold text-gray-700">Belanja</span>
          <span className="text-xs text-gray-500 ml-2">
            {new Date(created_at).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <span className={`text-sm font-semibold ${getStatusColor(status)}`}>{status}</span>
      </div>

      {/* Item Transaksi */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center mb-3">
          <img
            src={item.image_url}
            alt={item.product_name}
            className="w-16 h-16 object-cover rounded-md mr-3"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">{item.product_name}</p>
            <p className="text-xs text-gray-500">{item.quantity} barang</p>
          </div>
        </div>
      ))}

      {/* Footer Kartu Transaksi */}
      <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500">Total Belanja</p>
          <p className="text-base font-semibold text-gray-800">
            Rp.{final_total?.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="flex space-x-2">
          {/* Tombol Bayar Sekarang hanya untuk unpaid dan status pending */}
          {payment_status === 'unpaid' && status === 'pending' && (
            <button
              onClick={handleBayarSekarang}
              className="py-2 px-4 rounded-md bg-orange-500 text-white text-sm font-medium hover:bg-orange-600"
            >
              Bayar Sekarang
            </button>
          )}

          {/* Tombol Rating hanya untuk completed */}
          {status === 'completed' && (
            <button className="py-2 px-4 rounded-md bg-green-500 text-white text-sm font-medium hover:bg-green-600">
              Rating
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaksi;
