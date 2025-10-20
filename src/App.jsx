import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import Account from './pages/Account';
import AddressManager from './pages/Address';
import AddressForm from './pages/Address_form';
import Cart from './pages/Cart';
import Chat from './pages/Chat';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import MemberShip from './pages/MemberShip';
import PointRedeem from './pages/Point.';
import Product from './pages/Product';
import ProductDetail from './pages/Product_detail';
import ProfilePage from './pages/Profile_detail';
import Promo from './pages/Promo';
import Transaksi from './pages/Transaksi';
import TransaksiDetail from './pages/Transaksi_detail';
import VoucherPage from './pages/Voucher';

export default function App() {
  const navigate = useNavigate();
  const [checkedToken, setCheckedToken] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      // token ada → langsung ke home/chat
      navigate('/', { replace: true });
    }
    setCheckedToken(true); // selesai cek token
  }, []);

  if (!checkedToken) return null; // jangan render sebelum cek token

  return (
    <div className="min-h-screen relative pb-20">
      <main className="">
        <Routes>
          {/* jika user tidak punya token baru bisa ke login */}
          <Route path="/login" element={<Login />} />
          {/* semua route lainnya */}
          <Route path="/" element={<Chat />} />
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/promo" element={<Promo />} />
          <Route path="/transaksi" element={<Transaksi />} />
          <Route path="/transaksidetail/:id" element={<TransaksiDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/address" element={<AddressManager />} />
          <Route path="/address/form" element={<AddressForm />} />
          <Route path="/voucher" element={<VoucherPage />} />
          <Route path="/membership" element={<MemberShip />} />
          <Route path="/point" element={<PointRedeem />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>
    </div>
  );
}
