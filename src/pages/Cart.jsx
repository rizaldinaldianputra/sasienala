import React from 'react';

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      name: 'Recycle Boudic Ioint Cardigan Pink',
      price: '$120',
      color: 'Pink'
    },
    {
      id: 2,
      name: '2021 Signature Sweetshirt [NAVY]',
      price: '$120',
      color: ''
    }
  ];

  return (
    <div className="max-w-sm mx-auto p-4 bg-white">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold uppercase tracking-wide">CART</h1>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-start border-b pb-4">
            <div className="w-16 h-16 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 leading-tight">
                {item.name}
              </h3>
              {item.color && (
                <p className="text-xs text-gray-600 mt-1">{item.color}</p>
              )}
              <p className="text-base font-semibold text-gray-900 mt-1">
                {item.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">SUB TOTAL</span>
          <span className="text-lg font-bold text-gray-900">$240</span>
        </div>

        <p className="text-xs text-gray-500 text-center leading-relaxed">
          shipping charges, taxes and discount codes<br />
          are calculated at the time of accounting.
        </p>

        <button className="w-full bg-black text-white py-3 px-4 text-sm font-semibold rounded hover:bg-gray-800 transition duration-200 uppercase tracking-wide">
          CHECKOUT SEKARANG
        </button>
      </div>
    </div>
  );
};

export default Cart;