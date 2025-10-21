import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COLORS } from '../constants/colors';
import { useAddress } from '../hook/useAddress';
import { useCheckout } from '../hook/useCheckout';
import useVoucher from '../hook/useVoucher';
import { addressService } from '../service/address_service';
import { getUserId } from '../session/session';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product = [] } = location.state || {};
  const {
    address,
    fetchAddressById,
    loading: loadingAddress,
    error: errorAddress,
  } = useAddress(false);
  const { vouchers, fetchVouchers } = useVoucher();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(address || null);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);

  const [promoCode, setPromoCode] = useState('');
  const [voucherPromo, setVoucherPromo] = useState(0);
  const [selectedCourier, setSelectedCourier] = useState(null);

  const [payload, setPayload] = useState(null);
  const [payloadCheck, setPayloadCheck] = useState(null);
  const [payloadCheckout, setPayloadCheckout] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const subTotalPesanan = product.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const promoNewMember = 5000;
  const totalWeight = product.reduce((acc, item) => acc + (item.weight || 0) * item.quantity, 0);
  const subTotalPengiriman = selectedCourier ? selectedCourier.cost : 0;
  const totalPembayaran = subTotalPesanan + subTotalPengiriman - voucherPromo - promoNewMember;

  const fetchAddresses = async () => {
    try {
      const userId = getUserId();
      const res = await addressService.getAllAddress(userId || 0);
      setAddresses(res.data || res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchVouchers();
    fetchAddressById();
  }, []);

  useEffect(() => {
    if (address) setSelectedAddress(address);
  }, [address]);

  useEffect(() => {
    const addr = selectedAddress || address;
    if (addr && product.length > 0) {
      setPayload({
        user_id: addr.user_id,
        address_id: addr.id,
        items: product.map((item) => ({
          item_id: item.product_id,
          model_id: item.model_id,
          quantity: item.quantity,
        })),
      });
      setPayloadCheck({
        user_id: addr.user_id,
        address_id: addr.id,
        items: product.map((item) => ({
          item_id: item.id,
          product_id: item.product_id,
          model_id: item.model_id,
          quantity: item.quantity,
        })),
      });
      setPayloadCheckout({
        user_id: addr.user_id,
        address_id: addr.id,
        items: product.map((item) => ({
          item_id: item.id,
          product_id: item.product_id,
          model_id: item.model_id,
          quantity: item.quantity,
          note: 'note',
        })),
        courier_name: selectedCourier?.courier_name || '',
        courier_service: selectedCourier?.courier_code || '',
        shipping_cost: selectedCourier?.cost || 0,
      });
    }
  }, [selectedAddress, address, product, totalWeight, selectedCourier, voucherPromo]);

  const {
    couriers,
    checkoutValidate,
    checkoutFinal,
    confirmPayment,
    loading: courierLoading,
  } = useCheckout(payload, payloadCheck, payloadCheckout);

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    setIsAddressDialogOpen(false);
  };

  const handleSelectVoucher = (voucher) => {
    setVoucherPromo(voucher.value);
    setPromoCode(voucher.code);
    setIsVoucherDialogOpen(false);
  };

  const handleApplyPromoCode = () => {
    alert(`Kode promo ${promoCode} diterapkan!`);
  };

  const handleCheckout = async () => {
    try {
      const res = await checkoutValidate();
      if (!res.success) return alert(res.message || 'Checkout gagal');

      const finalRes = await checkoutFinal();
      if (!finalRes.success) return alert('Checkout gagal, silakan coba lagi.');

      const snapToken = finalRes.snap_token;
      if (!snapToken) return alert('Snap token tidak tersedia!');

      setLoadingPayment(true);

      window.snap.pay(snapToken, {
        onSuccess: async (result) => {
          try {
            const payloadConfirm = { order_id: finalRes.order.id, snap_response: result };
            const confirmRes = await confirmPayment(payloadConfirm);
            alert(confirmRes?.message || 'Pembayaran berhasil!');
            navigate('/transaksi');
          } catch {
            alert('Terjadi kesalahan saat konfirmasi pembayaran.');
          } finally {
            setLoadingPayment(false);
          }
        },
        onPending: () => setLoadingPayment(false),
        onError: () => setLoadingPayment(false),
        onClose: () => setLoadingPayment(false),
      });
    } catch {
      alert('Terjadi kesalahan pada proses checkout.');
    }
  };

  return (
    <div className="font-sans max-w-md mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white pb-20 relative">
      <header className="flex items-center p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button className="text-2xl cursor-pointer mr-4 text-gray-700" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="text-lg font-bold text-center flex-grow mr-10">CHECKOUT</h1>
      </header>

      {/* Produk */}
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
              <p className="text-sm font-bold text-gray-800">
                Rp {item.price.toLocaleString('id-ID')}
              </p>
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
        {selectedAddress ? (
          <div
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 relative cursor-pointer hover:border-orange-400"
            onClick={() => setIsAddressDialogOpen(true)}
          >
            <p className="font-bold text-sm text-gray-700">{selectedAddress.receiver_name}</p>
            <p className="text-sm text-gray-600">{selectedAddress.full_address}</p>
            <p className="text-sm text-gray-600">{selectedAddress.postal_code}</p>
            <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">Belum ada alamat pengiriman.</p>
        )}
        <button
          className="w-full bg-white border border-dashed border-gray-300 rounded-lg p-3 text-sm text-gray-600 flex justify-center items-center"
          onClick={async () => {
            navigate('/address');
          }}
        >
          Add shipping address <span className="text-lg ml-1">+</span>
        </button>
      </section>

      {/* Address Dialog */}
      {isAddressDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-5 w-96 max-h-[80vh] overflow-y-auto shadow-2xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Pilih Alamat</h2>
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 cursor-pointer hover:border-orange-400"
                onClick={() => handleSelectAddress(addr)}
              >
                <p className="font-bold text-sm text-gray-700">{addr.receiver_name}</p>
                <p className="text-sm text-gray-600">{addr.full_address}</p>
                <p className="text-sm text-gray-600">{addr.postal_code}</p>
                <p className="text-sm text-gray-600">{addr.phone}</p>
              </div>
            ))}
            <button
              className="mt-3 w-full bg-gray-300 text-gray-700 py-2 rounded-lg"
              onClick={() => setIsAddressDialogOpen(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

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
            onClick={() => setIsVoucherDialogOpen(true)}
            readOnly
            type="text"
            placeholder="Kode Promo..."
            className="flex-grow border border-gray-300 rounded-lg p-2 text-sm outline-none cursor-pointer"
            value={promoCode}
          />
          <button
            style={{ backgroundColor: COLORS.secondary }}
            className="text-black rounded-lg px-4 py-2 ml-3 text-sm"
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

      {/* Voucher Dialog */}
      {isVoucherDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-5 w-96 max-h-[80vh] overflow-y-auto shadow-2xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Pilih Voucher</h2>
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="bg-orange-100 p-3 rounded-lg mb-2 flex justify-between items-center text-sm"
              >
                <div>
                  <p className="font-semibold text-gray-800">{voucher.voucher.code}</p>
                  <p className="text-gray-600">{voucher.voucher.desc}</p>
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
              className="mt-3 w-full bg-gray-300 text-gray-700 py-2 rounded-lg"
              onClick={() => setIsVoucherDialogOpen(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Loading Payment */}
      {loadingPayment && (
        <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
          <div className="loader border-4 border-gray-300 border-t-orange-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

      {/* Footer Checkout */}
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
