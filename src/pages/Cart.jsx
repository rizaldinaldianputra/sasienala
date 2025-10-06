import { useState } from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../constants/colors';

const Cart = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Recycle Boucle Knit Cardigan', color: 'Pink', price: 120, quantity: 1 },
    { id: 2, name: '2021 Signature Sweatshirt', color: '[NAVY]', price: 120, quantity: 1 },
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setItems(items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            CART
          </h1>
        </div>

        {/* Cart Items */}
        <div className="p-6 space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 pb-6 border-b border-gray-100"
            >
              {/* Product Image */}
              <div className="w-20 h-20 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-pink-500 text-xs font-medium">IMAGE</span>
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="text-gray-900 font-medium">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.color}</p>
                <p className="font-bold mt-1" style={{ color: COLORS.primary }}>
                  IDR {item.price * item.quantity}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-600 text-sm">-</span>
                  </button>

                  <span className="text-gray-900 font-medium w-6 text-center">{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-600 text-sm">+</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Subtotal Section */}
          <div className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">SUB TOTAL</span>
              <span className="font-bold" style={{ color: COLORS.primary }}>
                IDR {subtotal}
              </span>
            </div>

            {/* Note */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-xs leading-relaxed">
                shipping charges, taxes and discount codes
                <br />
                are calculated at the time of accounting.
              </p>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="px-6 pb-6">
          <Link
            to="/checkout"
            className="flex items-center justify-center w-full text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 hover:opacity-90"
            style={{ backgroundColor: COLORS.primary }}
          >
            CHECKOUT SEKARANG
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
