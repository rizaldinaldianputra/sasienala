import { useState } from 'react';
import { COLORS } from '../constants/colors';

const paymentMethods = [
  {
    id: '1',
    name: 'Credit Card',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg',
  },
  {
    id: '2',
    name: 'Bank Transfer',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Bank_icon.svg',
  },
  {
    id: '3',
    name: 'E-Wallet',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/PayPal.svg',
  },
  {
    id: '4',
    name: 'Cash on Delivery',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Cash_icon.svg',
  },
];

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  return (
    <div className="max-w-md mx-auto p-4 bg-white flex flex-col min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>

      <ul className="space-y-2 flex-1">
        {paymentMethods.map((item) => (
          <li
            key={item.id}
            className={`flex justify-between items-center p-4 border rounded cursor-pointer transition-colors ${
              selectedMethod === item.id
                ? 'border-blue-500 bg-blue-100'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedMethod(item.id)}
          >
            <div className="flex items-center">
              <img src={item.logo} alt={item.name} className="w-10 h-10 mr-4 object-contain" />
              <span className="text-lg">{item.name}</span>
            </div>
            {selectedMethod === item.id && <span className="text-blue-500 text-lg">✓</span>}
          </li>
        ))}
      </ul>

      <button
        className="mt-6 w-full p-4 rounded text-white font-bold hover:opacity-90 transition"
        style={{ backgroundColor: COLORS.primary }}
        disabled={!selectedMethod}
        onClick={() =>
          alert(`Payment Method: ${paymentMethods.find((m) => m.id === selectedMethod).name}`)
        }
      >
        🛍️ Proceed to Pay
      </button>
    </div>
  );
};

export default PaymentMethod;
