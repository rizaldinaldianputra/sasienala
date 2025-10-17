import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COLORS } from '../constants/colors';
import { useAddress } from '../hook/useAddress';
import { useCheckout } from '../hook/useCheckout';
import useVoucher from '../hook/useVoucher';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product = [], subtotal = 0 } = location.state || {};
  const { address, fetchAddressById, loading, error } = useAddress(false);

  useEffect(() => {
    fetchAddressById();
  }, []);

  const [promoCode, setPromoCode] = useState('');
  const [voucherPromo, setVoucherPromo] = useState(0); // sekarang jadi state
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [payload, setPayload] = useState(null);
  const [payloadCheck, setPayloadCheck] = useState(null);
  const [payloadCheckout, setPayloadCheckout] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // dialog state

  const handleSelectVoucher = (voucher) => {
    setVoucherPromo(voucher.value); // ambil value dari voucher
    setPromoCode(voucher.code);
    setIsDialogOpen(false);
  };

  const subTotalPesanan = product.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const promoNewMember = 5000;
  const totalWeight = product.reduce((acc, item) => acc + (item.weight || 0) * item.quantity, 0);
  const subTotalPengiriman = selectedCourier ? selectedCourier.cost : 0;
  const totalPembayaran = subTotalPesanan + subTotalPengiriman - voucherPromo - promoNewMember;
  const { vouchers } = useVoucher();

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
      });
    }
  }, [address, product, totalWeight, selectedCourier]);

  const {
    couriers,
    checkoutValidate,
    checkoutFinal,
    confirmPayment,
    loading: courierLoading,
  } = useCheckout(payload, payloadCheck, payloadCheckout);

  const handleAddShippingAddress = () => alert('Fungsi untuk menambahkan alamat pengiriman');
  const handleApplyPromoCode = () => alert(`Kode promo ${promoCode} diterapkan!`);

  const handleCheckout = async () => {
    try {
      const res = await checkoutValidate();
      if (res?.success === false && res?.message) {
        alert(res.message);
        return;
      }

      const finalRes = await checkoutFinal();
      if (!finalRes?.success) {
        alert('Checkout gagal, silakan coba lagi.');
        return;
      }

      const snapToken = finalRes.snap_token;
      if (!snapToken) {
        alert('Snap token tidak tersedia!');
        return;
      }

      setLoadingPayment(true);

      window.snap.pay(snapToken, {
        onSuccess: async (result) => {
          console.log('Pembayaran berhasil:', result);
          try {
            const payloadConfirm = {
              order_id: finalRes.order.id,
              snap_response: result,
            };
            const confirmRes = await confirmPayment(payloadConfirm);
            alert(confirmRes?.message || 'Pembayaran berhasil!');
            navigate('/transaksi');
          } catch (err) {
            console.error('Error confirm payment:', err);
            alert('Terjadi kesalahan saat konfirmasi pembayaran.');
          } finally {
            setLoadingPayment(false);
          }
        },
        onPending: (result) => {
          console.log('Pembayaran pending:', result);
          setLoadingPayment(false);
        },
        onError: (result) => {
          console.log('Pembayaran gagal:', result);
          setLoadingPayment(false);
        },
        onClose: () => {
          alert('Anda menutup popup pembayaran.');
          setLoadingPayment(false);
        },
      });
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan pada proses checkout.');
    }
  };

  return (
    <div className="font-sans max-w-md mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white pb-20 relative">
      <header className="flex items-center p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button className="text-2xl cursor-pointer mr-4 text-gray-700">←</button>
        <h1 className="text-lg font-bold text-center flex-grow mr-10">CHECKOUT</h1>
      </header>

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
            onClick={() => setIsDialogOpen(true)}
            readOnly={true}
            type="text"
            placeholder="Kode Promo..."
            className="flex-grow border border-gray-300 rounded-lg p-2 text-sm outline-none cursor-pointer"
            value={promoCode}
          />

          <button
            style={{ backgroundColor: COLORS.secondary }}
            className=" text-black rounded-lg px-4 py-2 ml-3 text-sm"
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

      {/* Dialog Voucher */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg p-5 w-96 shadow-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Pilih Voucher</h2>

            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="bg-orange-100 p-3 rounded-lg mb-2 flex justify-between items-center text-sm"
              >
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-md mr-3 shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-orange-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L10.414 11H13a1 1 0 100-2h-3V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{voucher.voucher.code}</p>
                    <p className="text-gray-600">{voucher.voucher.desc}</p>
                  </div>
                </div>
                <button
                  className="bg-white text-orange-600 font-medium py-1 px-3 rounded-md shadow-sm hover:bg-gray-50"
                  onClick={() => handleSelectVoucher(voucher.voucher)}
                >
                  Use
                </button>
              </div>
            ))}

            <button
              className="mt-4 w-full bg-gray-300 text-gray-700 rounded-lg py-2"
              onClick={() => setIsDialogOpen(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {loadingPayment && (
        <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
          <div className="loader border-4 border-gray-300 border-t-orange-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-4 bg-white border-t border-gray-100 shadow-lg">
        <button
          onClick={handleCheckout}
          style={{ backgroundColor: COLORS.primary }}
          className="w-full flex items-center justify-center px-4 py-2 text-white rounded hover:opacity-90"
          disabled={loadingPayment}
        >
          <img src="/bagcheckout.svg" alt="Bag" className="w-6 h-6 mr-2" />
          CHECKOUT SEKARANG
        </button>
      </footer>
    </div>
  );
};

export default Checkout;
