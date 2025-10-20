// src/pages/PointRedeem.tsx
import { useState } from 'react';
import AppBar from '../components/Appbar';
import { useRedeemReward } from '../hook/useReedem';

function PointRedeem() {
  const { rewards, loading, redeemReward, redeemLoading } = useRedeemReward();
  const [processingId, setProcessingId] = useState(null);

  const handleRedeemReward = async (rewardId) => {
    setProcessingId(rewardId);
    try {
      const res = await redeemReward(rewardId);
      if (res && res.message) {
        alert(res.message); // tampilkan pesan dari backend
      } else {
        alert('Reward berhasil ditukar!');
      }
    } catch (err) {
      console.error(err);
      // cek jika backend mengirim response.detail
      if (err?.response?.data?.detail) {
        alert(err.response.data.detail);
      } else {
        alert('Gagal redeem reward.');
      }
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden md:max-w-md lg:max-w-lg">
        {/* Header */}
        <AppBar title="Tukar Poin" onBack={() => window.history.back()} />

        {/* Reward Catalog */}
        <div className="p-4 bg-white border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Katalog Reward</h2>
          {loading && <div className="text-xs text-gray-500">Loading rewards...</div>}
          {!loading && rewards.length === 0 && (
            <div className="text-xs text-gray-500">Belum ada reward tersedia.</div>
          )}
          <div className="grid grid-cols-1 gap-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="text-sm font-medium text-gray-800">{reward.name}</div>
                  <div className="text-xs text-gray-500">{reward.description}</div>
                  <div className="text-xs text-gray-600 mt-1">Points: {reward.points_required}</div>
                </div>
                <button
                  className="bg-orange-500 text-white py-1 px-3 rounded-lg text-sm font-semibold disabled:opacity-50"
                  disabled={redeemLoading || processingId === reward.id}
                  onClick={() => handleRedeemReward(reward.id)}
                >
                  {processingId === reward.id ? 'Processing...' : 'Redeem'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Navigation */}
      </div>
    </div>
  );
}

export default PointRedeem;
