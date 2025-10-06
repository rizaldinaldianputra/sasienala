import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Promo  from "./pages/Promo";
import Product from "./pages/Product"
import ProductDetail from "./pages/Product_detail"

import  Transaksi from "./pages/Transaksi"
import  Account from "./pages/Account"
import Cart from "./pages/Cart";

export default function App() {
  return (
    <div className="min-h-screen relative pb-20">

      <main className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />

                  <Route path="/product/:id" element={<ProductDetail />} /> 

          <Route path="/promo" element={<Promo />} />
                    <Route path="/transaksi" element={<Transaksi />} />
                                        <Route path="/account" element={<Account />} />


        </Routes>
      </main>

    </div>
  );
}
