// src/components/PaymentSuccessModal.jsx
import { useState } from 'react';

const PaymentSuccessModal = ({ paymentId, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-80 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 font-bold text-lg"
        >
          &times;
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-400 tracking-widest">PAYMENT SUCCESS</p>
          <div className="my-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-600">Your payment was success</p>
          <p className="text-xs text-gray-400 mt-1">Payment ID {paymentId}</p>
        </div>

        {/* Rating */}
        <div className="text-center mb-4">
          <p className="text-xs text-gray-500 mb-2">Rate your purchase</p>
          <div className="flex justify-center space-x-4">
            {[1, 2, 3].map((val) => (
              <button
                key={val}
                onClick={() => handleRatingClick(val)}
                className={`text-2xl ${rating >= val ? 'text-orange-500' : 'text-gray-300'}`}
              >
                {val === 1 ? '😐' : val === 2 ? '🙂' : '😍'}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => onSubmit(rating)}
            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
          >
            SUBMIT
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
          >
            BACK TO HOME
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
