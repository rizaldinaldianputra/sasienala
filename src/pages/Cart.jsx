import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../constants/colors';
import { useCart } from '../hook/useCart';

const Cart = () => {
  const { cartItems, getCart, updateQuantity, deleteCart } = useCart();

  useEffect(() => {
    getCart();
  }, []);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            CART
          </h1>
        </div>

        <div className="p-6 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 pb-6 border-b border-gray-100"
            >
              <div className="w-20 h-20 bg-pink-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-900 font-medium">{item.product_name}</h3>
                    <p className="text-gray-500 text-sm">{item.model_color}</p>
                    <p className="font-bold mt-1" style={{ color: COLORS.primary }}>
                      IDR {item.price * item.quantity}
                    </p>
                  </div>

                  {/* Tombol Delete */}
                  <button
                    onClick={() => deleteCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H3.5a.5.5 0 000 1h.634l.347 9.33A2 2 0 006.475 16h6.95a2 2 0 001.994-1.67L15.866 5H16.5a.5.5 0 000-1H15V3a1 1 0 00-1-1H6zm2 4a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6A.5.5 0 018 6zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0v-6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

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

          <div className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">SUB TOTAL</span>
              <span className="font-bold" style={{ color: COLORS.primary }}>
                IDR {subtotal}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-xs leading-relaxed">
                shipping charges, taxes and discount codes
                <br />
                are calculated at the time of accounting.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <Link
            to={cartItems.length > 0 ? '/checkout' : '#'}
            state={{ product: cartItems, subtotal }}
            className={`flex items-center justify-center w-full text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 ${
              cartItems.length > 0 ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
            }`}
            style={{ backgroundColor: cartItems.length > 0 ? COLORS.primary : '#9CA3AF' }} // abu
          >
            CHECKOUT SEKARANG
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
