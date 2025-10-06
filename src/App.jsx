import { Route, Routes } from 'react-router-dom';
import Product from './pages/Product';
import ProductDetail from './pages/Product_detail';
import Promo from './pages/Promo';

import Account from './pages/Account';
import Cart from './pages/Cart';
import Chat from './pages/Chat';
import Checkout from './pages/Checkout';
import PaymentMethod from './pages/Payment';
import Transaksi from './pages/Transaksi';

export default function App() {
  return (
    <div className="min-h-screen relative pb-20">
      <main className="">
        <Routes>
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
