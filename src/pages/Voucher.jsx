// src/pages/VoucherPage.tsx
import { useEffect } from 'react';
import AppBar from '../components/Appbar';
import useVoucher from '../hook/useVoucher';

const VoucherPage = () => {
  const { vouchers, loading, error, redeemVoucher, fetchVouchers } = useVoucher();

  useEffect(() => {
    fetchVouchers(); // Fetch voucher user saat mount
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <AppBar title="Voucher & Promo" onBack={() => window.history.back()} />

      <h2 className="text-lg font-semibold mb-2">Voucher Kamu</h2>

      {loading && <p className="text-center mt-10">Memuat voucher...</p>}
      {error && <p className="text-center mt-10 text-red-500">{error}</p>}
      {!loading && !error && vouchers.length === 0 && <p>Belum ada voucher</p>}

      {!loading &&
        !error &&
        vouchers.map((voucher) => (
          <div
            key={voucher.id}
            className="bg-green-100 p-3 rounded-lg mb-2 flex justify-between items-center text-sm"
          >
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-md mr-3 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L10.414 11H13a1 1 0 100-2h-3V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{voucher.voucher.code}</p>
                <p className="text-gray-600">{voucher.voucher.desc}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              {/* Tombol Salin */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(voucher.voucher.code);
                  alert('Kode voucher disalin!');
                }}
                className="flex items-center bg-white p-2 rounded-md shadow hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-700 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M8 16h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs font-medium text-gray-700">Copy</span>
              </button>

              {/* Tombol Klaim */}
            </div>
          </div>
        ))}
    </div>
  );
};

export default VoucherPage;
