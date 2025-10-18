// src/pages/VoucherPage.tsx
import AppBar from '../components/Appbar';
import useVoucher from '../hook/useVoucher';

const VoucherPage = () => {
  const { vouchers, loading, error, redeemVoucher } = useVoucher();

  const handleRedeem = async (code) => {
    try {
      await redeemVoucher(code);
      alert(`Voucher ${code} berhasil diklaim`);
    } catch (err) {
      console.error(err);
      alert(`Gagal klaim voucher ${code}`);
    }
  };

  if (loading) return <p className="text-center mt-10">Memuat voucher...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <AppBar title="Voucher & Promo" onBack={() => window.history.back()} />

      <h2 className="text-lg font-semibold mb-2">Voucher Kamu</h2>
      {vouchers.length === 0 && <p>Belum ada voucher</p>}
      {vouchers.map((voucher) => (
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
              <p className="font-semibold text-gray-800">{voucher.code}</p>
              <p className="text-gray-600">{voucher.desc}</p>
            </div>
          </div>
        </div>
      ))}

      {/* <h2 className="text-lg font-semibold mt-6 mb-2">Promo Tersedia</h2> */}
      {/* {allvouchers.length === 0 && <p>Belum ada promo</p>} */}
      {/* {allvouchers.map((voucher) => (
        <div
          key={voucher.id}
          className="bg-orange-100 p-3 rounded-lg mb-2 flex justify-between items-center text-sm"
        >
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-md mr-3 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-500"
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
              <p className="font-semibold text-gray-800">{voucher.code}</p>
              <p className="text-gray-600">{voucher.desc}</p>
            </div>
          </div>
          <button
            onClick={() => handleRedeem(voucher.code)}
            className="bg-white text-orange-600 font-medium py-1 px-3 rounded-md shadow-sm hover:bg-gray-50"
          >
            Klaim
          </button>
        </div>
      ))} */}
    </div>
  );
};

export default VoucherPage;
