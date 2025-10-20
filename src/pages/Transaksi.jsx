// src/pages/TransactionHistoryPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    if (activeTab === 'Proses') return !['completed', 'confirmed'].includes(tx.status);
    if (activeTab === 'Selesai') return ['completed', 'confirmed'].includes(tx.status);
    if (activeTab === 'Dibatalkan') return ['canceled', 'cancelled'].includes(tx.status);
    return tx.status === activeTab;
  });

  const tabs = ['Semua Status', 'Proses', 'Selesai', 'Dibatalkan'];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 relative">
      <Header />

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm overflow-x-auto flex border-b border-gray-200">
        {tabs.map((tab) => (
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

      <BottomNav />

      {/* Loading Spinner Overlay */}
      {showLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20 z-50">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

// Komponen Pembantu untuk Kartu Transaksi
const TransactionCard = ({ transaction, refetch, setShowLoading }) => {
  const navigate = useNavigate();
  const { confirmPayment } = useCheckout();

  const {
    status,
    payment_status,
    shipping_status,
    created_at,
    items,
    final_total,
    snap_token,
    shipping_tracking_number,
    id: order_id,
  } = transaction;

  // Mapping status utama
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return payment_status === 'unpaid' ? 'Menunggu Pembayaran' : 'Menunggu Konfirmasi';
      case 'confirmed':
        return 'Pesanan Dikonfirmasi';
      case 'shipped':
        if (shipping_status) {
          switch (shipping_status) {
            case 'pending':
              return 'Menunggu Pickup';
            case 'shipped':
              return 'Sedang Dikirim';
            case 'delivered':
              return 'Sudah Sampai';
            default:
              return 'Dalam Perjalanan';
          }
        }
        return 'Pesanan Dikirim';
      case 'completed':
        return 'Pesanan Selesai';
      case 'canceled':
      case 'cancelled':
        return 'Pesanan Dibatalkan';
      default:
        return status;
    }
  };

  const getSubStatusText = () => {
    switch (status) {
      case 'pending':
        return payment_status === 'unpaid' ? 'Belum Dibayar' : 'Pembayaran Berhasil';
      case 'confirmed':
        return 'Sedang Diproses';
      case 'shipped':
        switch (shipping_status) {
          case 'pending':
            return 'Menunggu Pickup';
          case 'shipped':
            return 'Pesanan sedang dalam perjalanan';
          case 'delivered':
            return 'Cek pesanan sebelum konfirmasi';
          default:
            return 'Dalam Perjalanan';
        }
      case 'completed':
        return 'Sudah Diterima';
      case 'canceled':
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    if (status === 'pending') return 'text-orange-600';
    if (status === 'shipped') return 'text-orange-600';
    if (status === 'confirmed' || status === 'completed' || payment_status === 'paid')
      return 'text-green-600';
    if (status === 'canceled' || status === 'cancelled') return 'text-red-500';
    return 'text-gray-600';
  };

  // Tombol aksi
  const actionButtonsForTransaction = () => {
    if (status === 'pending' && payment_status === 'unpaid' && shipping_status === 'pending') {
      return (
        <>
          <button
            onClick={() => handleBayarSekarang()}
            className="py-2 px-4 rounded-md bg-orange-500 text-white text-sm font-medium hover:bg-orange-600"
          >
            Lanjutkan Pembayaran
          </button>
          <button
            onClick={() => navigate(`/transaksidetail/${order_id}`)}
            className="py-2 px-4 rounded-md bg-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-400"
          >
            Detail
          </button>
        </>
      );
    }

    if (payment_status === 'paid' && (status === 'pending' || status === 'confirmed')) {
      return (
        <button
          onClick={() => navigate(`/transaksidetail/${order_id}`)}
          className="py-2 px-4 rounded-md bg-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-400"
        >
          Detail
        </button>
      );
    }

    if (status === 'shipped' && shipping_status !== 'delivered') {
      return (
        <>
          <button
            onClick={() => navigate(`/tracking/${order_id}`)}
            className="py-2 px-4 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
          >
            Lacak
          </button>
          <button
            onClick={() => navigate(`/transaksidetail/${order_id}`)}
            className="py-2 px-4 rounded-md bg-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-400"
          >
            Detail
          </button>
        </>
      );
    }

    if (shipping_status === 'delivered' && status !== 'completed') {
      return (
        <>
          <button
            onClick={() => navigate(`/terimapesanan/${order_id}`)}
            className="py-2 px-4 rounded-md bg-green-500 text-white text-sm font-medium hover:bg-green-600"
          >
            Terima Pesanan
          </button>
          <button
            onClick={() => navigate(`/transaksidetail/${order_id}`)}
            className="py-2 px-4 rounded-md bg-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-400"
          >
            Detail
          </button>
        </>
      );
    }

    if (status === 'completed') {
      return (
        <>
          <button
            onClick={() => navigate(`/produk`)}
            className="py-2 px-4 rounded-md bg-green-500 text-white text-sm font-medium hover:bg-green-600"
          >
            Beli Lagi
          </button>
          <button
            onClick={() => navigate(`/transaksidetail/${order_id}`)}
            className="py-2 px-4 rounded-md bg-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-400"
          >
            Detail
          </button>
        </>
      );
    }

    return (
      <button
        onClick={() => navigate(`/transaksidetail/${order_id}`)}
        className="py-2 px-4 rounded-md bg-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-400"
      >
        Detail
      </button>
    );
  };

  const handleBayarSekarang = () => {
    if (!snap_token) return alert('Snap token tidak tersedia!');
    window.snap.pay(snap_token, {
      onSuccess: async (result) => {
        setShowLoading(true);
        try {
          const confirmRes = await confirmPayment({ order_id, snap_response: result });
          alert(confirmRes?.message || 'Pembayaran berhasil!');
          if (refetch) await refetch();
        } catch (err) {
          console.error(err);
          alert('Terjadi kesalahan saat konfirmasi pembayaran.');
        } finally {
          setShowLoading(false);
        }
      },
      onPending: () => {},
      onError: () => alert('Pembayaran gagal, silakan coba lagi.'),
      onClose: () => alert('Anda menutup popup pembayaran.'),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-sm font-semibold">{getStatusText()}</span>
          <p className="text-xs text-gray-500">{getSubStatusText()}</p>
        </div>
        <span className={`text-sm font-semibold ${getStatusColor()}`}>{status}</span>
      </div>

      {/* Item */}
      {items.map((item, idx) => (
        <div
          key={idx}
          onClick={() => navigate(`/transaksidetail/${order_id}`)}
          className="flex items-center mb-3 cursor-pointer"
        >
          <img src={item.image_url} className="w-16 h-16 object-cover rounded-md mr-3" />
          <div>
            <p className="text-sm font-medium">{item.product_name}</p>
            <p className="text-xs text-gray-500">{item.quantity} barang</p>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500">Total Belanja</p>
          <p className="text-base font-semibold">Rp.{final_total?.toLocaleString('id-ID')}</p>
        </div>
        <div className="flex space-x-2">{actionButtonsForTransaction()}</div>
      </div>
    </div>
  );
};

export default Transaksi;
