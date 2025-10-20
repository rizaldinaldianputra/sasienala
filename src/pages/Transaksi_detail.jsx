// src/pages/Transaksi_detail.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { useOrders } from '../hook/useOrder';

const TransaksiDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchOrderById, confirmPayment } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetchOrderById(id);
        setOrder(res);
      } catch (err) {
        console.error('Gagal mengambil detail transaksi:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Memuat detail transaksi...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Detail transaksi tidak ditemukan.
      </div>
    );
  }

  const handleConfirmOrder = async () => {
    if (!order || processing) return;
    setProcessing(true);
    try {
      const res = await confirmPayment(order.id);
      if (res?.message) {
        alert(res.message);
      } else {
        alert('Pesanan berhasil dikonfirmasi.');
      }
      navigate('/transaksi');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat konfirmasi pesanan.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans relative">
      <Header title="Rincian Pesanan" />

      {/* Status Pesanan */}
      <div className="bg-[#D6C3A5] text-white text-center py-3 text-sm font-medium">
        {order.status === 'completed' ? 'Pesanan telah diterima' : 'Pesanan dalam perjalanan'}
      </div>

      {/* Info Pengiriman */}
      <div className="bg-white p-4 mt-3 border-b border-gray-200">
        <p className="text-sm text-gray-700 font-medium mb-2">INFO PENGIRIMAN</p>
        <div className="items-center text-sm mb-2">
          <span className="text-gray-600">COD :</span>
          <span className="font-semibold ml-1">{order.payment_ref || '-'}</span>
        </div>
        <div className="flex items-start mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-orange-500 mt-1 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h18l-2 13H5L3 3z"
            />
          </svg>
          <div>
            <p className="text-sm text-orange-600 font-medium">
              {order.status === 'completed'
                ? 'Pesanan diterima oleh pelanggan'
                : 'Pesanan sedang dalam perjalanan'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(order.arrived_at || order.updated_at).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}{' '}
              {new Date(order.arrived_at || order.updated_at).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Alamat Pengiriman */}
      <div className="bg-white p-4 mt-3 border-b border-gray-200">
        <p className="text-sm text-gray-700 font-medium mb-2">ALAMAT PENGIRIMAN</p>
        <p className="text-base font-semibold text-gray-800">{order.customer_name}</p>
        <p className="text-sm text-gray-600 mb-1">{order.customer_phone}</p>
        <p className="text-sm text-gray-600">{order.shipping_address}</p>
      </div>

      {/* Produk */}
      <div className="bg-white p-4 mt-3">
        {order.items.map((item, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 mb-4">
            <div className="flex gap-3">
              <img
                src={item.image_url}
                alt={item.product_name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <p className="text-gray-800 font-medium leading-tight line-clamp-2">
                  {item.product_name}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span>{item.variant || '-'}</span>
                  <span className="ml-2">Rp{item.price.toLocaleString('id-ID')}</span>
                  <span className="ml-auto">x {item.quantity}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Total Belanja */}
        <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between items-center">
          <p className="text-base font-semibold text-gray-800">Total Belanja</p>
          <p className="text-base font-semibold text-orange-600">
            Rp{order.final_total?.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="bg-white p-4 mt-3 flex space-x-3">
        {/* Ajukan Pengembalian hanya jika completed */}
        {order.status === 'completed' && (
          <button
            className="flex-1 border border-gray-400 py-2 rounded-md text-gray-700 text-sm font-medium"
            onClick={() => alert('Pengembalian diajukan')}
          >
            Ajukan Pengembalian
          </button>
        )}

        {/* Konfirmasi Pesanan hanya jika delivered tapi belum completed */}
        {order.status === 'shipped' && order.shipping_status === 'delivered' && (
          <button
            className="flex-1 bg-[#D6C3A5] text-white py-2 rounded-md text-sm font-medium"
            onClick={handleConfirmOrder}
            disabled={processing}
          >
            {processing ? 'Memproses...' : 'Pesanan Selesai'}
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default TransaksiDetail;
