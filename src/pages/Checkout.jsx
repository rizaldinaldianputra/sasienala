import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COLORS } from '../constants/colors';
import { useAddress } from '../hook/useAddress';
import { useCheckout } from '../hook/useCheckout';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product = [], subtotal = 0 } = location.state || {};
  const { address, fetchAddressById, loading, error } = useAddress(false);

  useEffect(() => {
    fetchAddressById();
  }, []);

  const [promoCode, setPromoCode] = useState('');
  const [selectedCourier, setSelectedCourier] = useState(null); // simpan objek kurir

  const subTotalPesanan = product.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const voucherPromo = 10000;
  const promoNewMember = 5000;

  // Total weight dummy untuk payload
  const totalWeight = product.reduce((acc, item) => acc + (item.weight || 0) * item.quantity, 0);

  const [payload, setPayload] = useState(null);
  const [payloadCheck, setPayloadCheck] = useState(null);
  const [payloadCheckout, setPayloadCheckout] = useState(null);

  useEffect(() => {
    if (address && product.length > 0) {
      setPayload({
        user_id: address.user_id,
        address_id: address.id,
        items: product.map((item) => ({
          item_id: item.product_id,
          model_id: item.model_id,
          quantity: item.quantity,
        })),
      });
      setPayloadCheck({
        user_id: address.user_id,
        address_id: address.id,
        items: product.map((item) => ({
          item_id: item.id,
          product_id: item.product_id,
          model_id: item.model_id,
          quantity: item.quantity,
        })),
      });
      setPayloadCheckout({
        user_id: address.user_id,
        address_id: address.id,
        items: product.map((item) => ({
          item_id: item.id,
          product_id: item.product_id,
          model_id: item.model_id,
          quantity: item.quantity,
          note: 'note',
        })),
        courier_name: selectedCourier ? selectedCourier.courier_name : '',
        courier_service: selectedCourier ? selectedCourier.courier_code : '',
        shipping_cost: selectedCourier ? selectedCourier.cost : 0,
        // vouchers: [],
      });
    }
  }, [address, product, totalWeight, selectedCourier]);

  const {
    couriers,
    checkoutValidate,
    validateMessage,
    checkoutFinal,
    loading: courierLoading,
  } = useCheckout(payload, payloadCheck, payloadCheckout);

  const subTotalPengiriman = selectedCourier ? selectedCourier.cost : 0;
  const totalPembayaran = subTotalPesanan + subTotalPengiriman - voucherPromo - promoNewMember;

  const handleAddShippingAddress = () => alert('Fungsi untuk menambahkan alamat pengiriman');
  const handleApplyPromoCode = () => alert(`Kode promo ${promoCode} diterapkan!`);

  return (
    <div className="font-sans max-w-md mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white pb-20 relative">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button className="text-2xl cursor-pointer mr-4 text-gray-700">←</button>
        <h1 className="text-lg font-bold text-center flex-grow mr-10">CHECKOUT</h1>
      </header>

      {/* Product List */}
      {product.length > 0 ? (
        product.map((item) => (
          <div key={item.id} className="flex p-4 border-b border-gray-100 items-center">
            <img
              src={item.product_image}
              alt={item.product_name}
              className="w-20 h-20 object-cover rounded-lg mr-4"
            />
            <div className="flex-grow">
              <p className="text-sm mb-1 text-gray-800">{item.product_name}</p>
              <p className="text-sm font-bold text-gray-800">Rp {item.price}</p>
              <div className="flex items-center mt-2">
                <button className="bg-gray-100 border border-gray-300 w-7 h-7 rounded-md text-base cursor-pointer text-gray-700">
                  -
                </button>
                <span className="mx-3 text-sm font-bold text-gray-800">{item.quantity}</span>
                <button className="bg-gray-100 border border-gray-300 w-7 h-7 rounded-md text-base cursor-pointer text-gray-700">
                  +
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-6">Keranjang kamu masih kosong.</p>
      )}

      {/* Shipping Address */}
      <section className="p-4 border-b border-gray-100">
        <h2 className="text-xs text-gray-500 mb-2 uppercase">SHIPPING ADDRESS</h2>
        {loading ? (
          <p className="text-center text-gray-500 py-4">Memuat alamat...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-4">{error}</p>
        ) : address ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 relative">
            <p className="font-bold text-sm text-gray-700">{address.receiver_name}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{address.full_address}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{address.postal_code}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{address.phone}</p>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">
              →
            </span>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">Belum ada alamat pengiriman.</p>
        )}
        <button
          className="w-full bg-white border border-dashed border-gray-300 rounded-lg p-3 text-sm text-gray-600 flex justify-center items-center"
          onClick={handleAddShippingAddress}
        >
          Add shipping address <span className="text-lg ml-1">+</span>
        </button>
      </section>

      {/* Shipping Method */}
      <section className="p-4 border-b border-gray-100">
        <h2 className="text-xs text-gray-500 mb-2 uppercase">SHIPPING METHOD</h2>
        {courierLoading ? (
          <p className="text-center text-gray-500 py-2">Memuat kurir...</p>
        ) : (
          <select
            className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none"
            value={selectedCourier?.service || ''}
            onChange={(e) => {
              const courier = couriers.find((c) => c.service === e.target.value);
              console.log('ini courier', +e);

              setSelectedCourier(courier || null);
            }}
            disabled={!payload}
          >
            <option value="">Pickup at store (FREE)</option>
            {couriers.map((c) => (
              <option key={c.service} value={c.service}>
                {c.courier_name} - {c.service} ({c.etd}) Rp {c.cost.toLocaleString('id-ID')}
              </option>
            ))}
          </select>
        )}
      </section>

      {/* Promo & Total */}
      <section className="p-4 border-b border-gray-100">
        <div className="flex mb-3 mt-3">
          <input
            type="text"
            placeholder="Kode Promo..."
            className="flex-grow border border-gray-300 rounded-lg p-2 text-sm outline-none"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button
            className="bg-orange-500 text-white rounded-lg px-4 py-2 ml-3 text-sm"
            onClick={handleApplyPromoCode}
          >
            Apply
          </button>
        </div>

        <div className="flex justify-between mb-2 text-sm text-gray-700">
          <span>Sub Total Pesanan</span>
          <span className="font-bold">Rp {subTotalPesanan.toLocaleString('id-ID')},-</span>
        </div>
        <div className="flex justify-between mb-2 text-sm text-gray-700">
          <span>Sub Total Pengiriman</span>
          <span className="font-bold">Rp {subTotalPengiriman.toLocaleString('id-ID')},-</span>
        </div>
        <div className="flex justify-between mb-2 text-sm text-red-500">
          <span>Voucher Promo</span>
          <span className="font-bold">- Rp {voucherPromo.toLocaleString('id-ID')},-</span>
        </div>
        <div className="flex justify-between mb-2 text-sm text-red-500">
          <span>Promo Gratis Ongkir</span>
          <span className="font-bold">- Rp {promoNewMember.toLocaleString('id-ID')},-</span>
        </div>
        <div className="flex justify-between mt-5 pt-4 border-t border-gray-100 text-base font-bold text-gray-800">
          <span>TOTAL PEMBAYARAN</span>
          <span className="text-orange-500">IDR {totalPembayaran.toLocaleString('id-ID')},-</span>
        </div>
      </section>

      {/* Checkout Button */}
      <footer className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-4 bg-white border-t border-gray-100 shadow-lg">
        <button
          onClick={async () => {
            try {
              const res = await checkoutValidate();
              if (res?.success === false && res?.message) {
                alert(res.message);
                return;
              }

              const finalRes = await checkoutFinal();
              console.log('ini response', finalRes);
              if (finalRes?.success) {
                // Ambil snap token dari response
                const snapToken = finalRes.snap_token;

                console.log(snapToken);
                if (!snapToken) {
                  alert('Snap token tidak tersedia!');
                  return;
                }

                // Panggil Snap Midtrans
                window.snap.pay(snapToken, {
                  onSuccess: function (result) {
                    console.log('Pembayaran berhasil:', result);
                  },
                  onPending: function (result) {
                    console.log('Pembayaran pending:', result);
                  },
                  onError: function (result) {
                    console.log('Pembayaran gagal:', result);
                  },
                  onClose: function () {
                    alert('Anda menutup popup pembayaran.');
                  },
                });
              } else {
                alert('Checkout gagal, silakan coba lagi.');
              }
            } catch (err) {
              console.error(err);
              alert('Terjadi kesalahan pada proses checkout.');
            }
          }}
          style={{ backgroundColor: COLORS.primary }}
          className="w-full flex items-center justify-center px-4 py-2 text-white rounded hover:opacity-90"
        >
          <img src="/bagcheckout.svg" alt="Bag" className="w-6 h-6 mr-2" />
          CHECKOUT SEKARANG
        </button>
      </footer>
    </div>
  );
};

export default Checkout;
