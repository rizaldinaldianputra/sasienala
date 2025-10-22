import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import useTracking from '../hook/useTracking';

const Tracking = () => {
  const [searchParams] = useSearchParams();
  const order_id = searchParams.get('order_id');
  const awb = searchParams.get('awb');
  const courier = searchParams.get('courier');

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
        <div className="bg-white rounded-lg shadow-md p-5 w-full max-w-md space-y-6">
          {/* SUMMARY */}
          {tracking?.summary && (
            <div>
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

          {/* DELIVERY STATUS */}
          {tracking?.delivery_status && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Delivery Status</h2>
              <div className="bg-green-50 p-4 rounded-lg space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Status:</span> {tracking.delivery_status.status}
                </p>
                <p>
                  <span className="font-semibold">POD Receiver:</span>{' '}
                  {tracking.delivery_status.pod_receiver}
                </p>
                <p>
                  <span className="font-semibold">POD Date & Time:</span>{' '}
                  {tracking.delivery_status.pod_date} {tracking.delivery_status.pod_time}
                </p>
              </div>
            </div>
          )}

          {/* MANIFEST / TIMELINE */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-2">
              Timeline Pengiriman
            </h2>

            {loading && <p className="text-gray-500 text-sm">Memuat data...</p>}
            {error && <p className="text-red-500 text-sm">Tidak ditemukan AWB yang valid</p>}

            {tracking?.manifest && (
              <div className="relative pl-6">
                {tracking.manifest
                  .slice()
                  .reverse()
                  .map((item, idx, arr) => {
                    const isLast = idx === arr.length - 1;
                    return (
                      <div key={idx} className="mb-6 relative">
                        {/* Timeline circle */}
                        <span
                          className={`absolute -left-3 top-1 w-6 h-6 rounded-full border-2 border-white ${
                            isLast ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                        ></span>

                        {/* Timeline line */}
                        {!isLast && (
                          <span className="absolute left-0 top-6 w-0.5 h-full bg-gray-300"></span>
                        )}

                        <div className="ml-3">
                          <p className="text-gray-500 text-sm">{item.manifest_date}</p>
                          <p className="text-gray-700 text-sm">{item.manifest_description}</p>
                        </div>
                      </div>
                    );
                  })}
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
