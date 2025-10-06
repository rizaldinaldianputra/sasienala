import { useState } from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../constants/colors';

const Checkout = () => {
  const [shippingAddress, setShippingAddress] = useState({
    name: 'Iris Watson',
    street: '686-3727 Ullamcorper. Street',
    cityStateZip: 'Roseville NH 11523',
    phone: '(786) 713-8616',
  });

  const [promoCode, setPromoCode] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // Dummy data untuk produk
  const product = {
    name: 'Recycle Boucle Knit Cardigan Pink',
    price: 120000, // Misal Rp 120.000
    image: 'https://picsum.photos/200', // Ganti dengan URL gambar produk Anda
    quantity: 1,
  };

  // Dummy data untuk biaya
  const subTotalPesanan = product.price * product.quantity;
  const subTotalPengiriman = 20000; // Misal Rp 20.000
  const voucherPromo = 10000; // Misal diskon Rp 10.000
  const promoNewMember = 5000; // Misal diskon Rp 5.000

  const totalPembayaran = subTotalPesanan + subTotalPengiriman - voucherPromo - promoNewMember;

  const handleAddShippingAddress = () => {
    alert('Fungsi untuk menambahkan alamat pengiriman');
  };

  const handleApplyPromoCode = () => {
    alert(`Kode promo ${promoCode} diterapkan!`);
  };

  const handleCreateOrder = () => {
    alert('Pesanan dibuat!');
    // Logika untuk mengirim data pesanan ke backend
  };

  return (
    <div className="font-sans max-w-md mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white pb-20 relative">
      <header className="flex items-center p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button className="text-2xl cursor-pointer mr-4 text-gray-700">←</button>
        <h1 className="text-lg font-bold text-center flex-grow mr-10">CHECKOUT-RINA</h1>
      </header>

      <div className="flex p-4 border-b border-gray-100 items-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-lg mr-4"
        />
        <div className="flex-grow">
          <p className="text-sm mb-1 text-gray-800">{product.name}</p>
          <p className="text-sm font-bold text-gray-800">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
          <div className="flex items-center mt-2">
            <button className="bg-gray-100 border border-gray-300 w-7 h-7 rounded-md text-base cursor-pointer text-gray-700">
              -
            </button>
            <span className="mx-3 text-sm font-bold text-gray-800">{product.quantity}</span>
            <button className="bg-gray-100 border border-gray-300 w-7 h-7 rounded-md text-base cursor-pointer text-gray-700">
              +
            </button>
          </div>
        </div>
      </div>

      <section className="p-4 border-b border-gray-100">
        <h2 className="text-xs text-gray-500 mb-2 uppercase">SHIPPING ADDRESS</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 relative">
          <p className="font-bold text-sm text-gray-700">{shippingAddress.name}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{shippingAddress.street}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{shippingAddress.cityStateZip}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{shippingAddress.phone}</p>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">→</span>
        </div>
        <button
          className="w-full bg-white border border-dashed border-gray-300 rounded-lg p-3 text-sm text-gray-600 flex justify-center items-center"
          onClick={handleAddShippingAddress}
        >
          Add shipping address <span className="text-lg ml-1">+</span>
        </button>
      </section>

      <section className="p-4 border-b border-gray-100">
        <h2 className="text-xs text-gray-500 mb-2 uppercase">SHIPPING METHOD</h2>
        <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-3">
          <span className="text-sm text-gray-700">Pickup at store</span>
          <div className="relative">
            <select className="border-none bg-transparent text-sm text-gray-700 outline-none pr-6 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.2-6.5H18.6c-5.4%200-10.4%202.1-13.2%206.5C2.1%2072.2%200%2077.3%200%2082.7c0%205.4%202.1%2010.4%206.5%2013.2l128%20127.9c5.4%205.4%2012.3%208.4%2019.2%208.4s13.8-3%2019.2-8.4L287%2095.9c4.4-4.4%206.5-9.4%206.5-14.8S291.4%2073.8%20287%2069.4z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] bg-[length:10px] cursor-pointer">
              <option value="free">FREE</option>
            </select>
          </div>
        </div>
      </section>

      <section className="p-4 border-b border-gray-100">
        <div className="flex mb-3">
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
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Belum ada kode promo</span>
          <span className="text-xl text-gray-400">→</span>
        </div>
      </section>

      <section className="p-4 border-b border-gray-100">
        <h2 className="text-xs text-gray-500 mb-2 uppercase">PAYMENT METHOD</h2>
        <div className="relative">
          <select
            className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none pr-6 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.2-6.5H18.6c-5.4%200-10.4%202.1-13.2%206.5C2.1%2072.2%200%2077.3%200%2082.7c0%205.4%202.1%2010.4%206.5%2013.2l128%20127.9c5.4%205.4%2012.3%208.4%2019.2%208.4s13.8-3%2019.2-8.4L287%2095.9c4.4-4.4%206.5-9.4%206.5-14.8S291.4%2073.8%20287%2069.4z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_center] bg-[length:10px] cursor-pointer"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          >
            <option value="">select payment method</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="ovo">OVO</option>
            <option value="gopay">Gopay</option>
          </select>
        </div>
      </section>

      <section className="p-4">
        <h2 className="text-xs text-gray-500 mb-3 uppercase">CEK BELANJAANMU YUK</h2>
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

      <footer className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-4 bg-white border-t border-gray-100 shadow-lg">
        <Link
          to="/payment"
          style={{ backgroundColor: COLORS.primary }}
          className="w-full flex items-center justify-center px-4 py-2 text-white rounded hover:opacity-90"
        >
          <img src="/bagcheckout.svg" alt="Bag" className="w-6 h-6 mr-2" />
          CHECKOUT SEKARANG
        </Link>
      </footer>
    </div>
  );
};

export default Checkout;
