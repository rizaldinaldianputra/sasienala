// src/pages/Tracking.jsx
import { useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import useTracking from '../hook/useTracking';

const Tracking = ({ order_id, awb, courier }) => {
  const { tracking, loading, error, fetchTracking } = useTracking();

  useEffect(() => {
    if (order_id && awb && courier) {
      fetchTracking({ order_id, awb, courier });
    }
  }, [order_id, awb, courier]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <Header />

      <div className="p-4 sm:p-6 flex justify-center flex-grow">
        <div className="bg-white rounded-lg shadow-md p-5 w-full max-w-md">
          {/* --- INFORMASI PENGIRIMAN --- */}
          {tracking?.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Status Pengiriman</h2>
              <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Nomor Resi:</span>{' '}
                  {tracking.summary.waybill_number}
                </p>
                <p>
                  <span className="font-semibold">Courier:</span> {tracking.summary.courier_name}
                </p>
                <p>
                  <span className="font-semibold">Service:</span> {tracking.summary.service_code}
                </p>
                <p>
                  <span className="font-semibold">Tanggal Kirim:</span>{' '}
                  {tracking.summary.waybill_date}
                </p>
                <p>
                  <span className="font-semibold">Pengirim:</span> {tracking.summary.shipper_name}
                </p>
                <p>
                  <span className="font-semibold">Penerima:</span> {tracking.summary.receiver_name}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {tracking.summary.status}
                </p>
              </div>
            </div>
          )}

          {/* --- TIMELINE MANIFEST --- */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-2">
              Timeline Pengiriman
            </h2>

            {loading && <p className="text-gray-500 text-sm">Memuat data...</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {tracking?.manifest && (
              <div className="relative border-l-2 border-gray-300 pl-6">
                {tracking.manifest
                  .slice()
                  .reverse()
                  .map((item, idx) => (
                    <div key={idx} className="mb-6 relative">
                      <span className="absolute -left-3 top-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></span>
                      <div>
                        <p className="text-gray-500 text-sm">{item.manifest_date}</p>
                        <p className="text-gray-700 text-sm">{item.manifest_description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Tracking;
