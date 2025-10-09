import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import Account from './pages/Account';
import Cart from './pages/Cart';
import Chat from './pages/Chat';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import PaymentMethod from './pages/Payment';
import Product from './pages/Product';
import ProductDetail from './pages/Product_detail';
import Promo from './pages/Promo';
import Transaksi from './pages/Transaksi';

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
          <Route path="/payment" element={<PaymentMethod />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/promo" element={<Promo />} />
          <Route path="/transaksi" element={<Transaksi />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>
    </div>
  );
}
