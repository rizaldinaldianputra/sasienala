import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import AppBar from '../components/Appbar';
import { useLoyalty } from '../hook/useLoyalty';
import { useRedeemReward } from '../hook/useReedem';

function MemberShip() {
  const {
    status,
    tiers,
    loading: loyaltyLoading,
    error: loyaltyError,
    redeemPoints,
  } = useLoyalty();
  const { rewards, loading: rewardsLoading, error: rewardsError, redeemReward } = useRedeemReward();
  const [processingId, setProcessingId] = useState(null);

  const handleRedeemReward = async (rewardId) => {
    setProcessingId(rewardId);
    try {
      const res = await redeemReward(rewardId);
      if (res) {
        alert(
          `Berhasil redeem reward!\nTransaction ID: ${res.transaction_id}\nPoints Remaining: ${res.points_remaining}`,
        );
      } else {
        alert('Gagal redeem reward.'); // fallback kalau res null
      }
    } catch (err) {
      console.error(err);
      // cek apakah backend mengirim detail message
      if (err.response?.data?.detail) {
        alert(`Gagal redeem reward: ${err.response.data.detail}`);
      } else {
        alert(`Gagal redeem reward: ${err.message || err}`);
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleRedeemPoints = async (points) => {
    try {
      await redeemPoints(points);
    } catch (err) {
      console.error(err);
      alert('Gagal redeem points.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden md:max-w-md lg:max-w-lg">
        {/* Header */}
        <AppBar title="Membership dan Loyalty Point" onBack={() => window.history.back()} />

        {/* Digital Member Card */}
        <div className="p-4 bg-white">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">KARTU MEMBER DIGITAL</h2>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 text-white shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">Informasi Poin</span>
              <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-semibold">
                {status?.tier || 'Loading...'}
              </span>
            </div>

            <div className="flex flex-col items-center mt-2">
              <div className="text-4xl font-bold">{status?.points_balance ?? '-'}</div>
              <div className="text-sm">Point Tersedia</div>
            </div>

            {status && (
              <div className="flex items-center text-xs mt-3 bg-white bg-opacity-20 p-2 rounded-md">
                <FiStar className="text-yellow-300 mr-1" />
                <span>
                  {status.points_to_next_tier} poin lagi untuk naik ke {status.next_tier}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Loyalty Tiers */}
        <div className="p-4 bg-white border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Membership Tier</h2>
          <div className="grid grid-cols-1 gap-3">
            {tiers.map((tier) => (
              <div key={tier.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-800">{tier.name}</div>
                <div className="text-xs text-gray-500">{tier.description}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Point Rate: {tier.other_benefits.point_rate}, Bonus:{' '}
                  {tier.other_benefits.bonus_points} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Katalog Reward */}
        <div className="p-4 bg-white border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Katalog Reward</h2>
          {(rewardsLoading || loyaltyLoading) && (
            <div className="text-xs text-gray-500">Loading...</div>
          )}
          {(rewardsError || loyaltyError) && (
            <div className="text-xs text-red-500">{rewardsError || loyaltyError}</div>
          )}
          {!rewardsLoading && rewards?.length === 0 && (
            <div className="text-xs text-gray-500">Belum ada reward tersedia.</div>
          )}
          <div className="grid grid-cols-1 gap-3">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-gray-50 p-3 rounded-lg flex flex-col">
                <div className="text-sm font-medium text-gray-800">{reward.name}</div>
                <div className="text-xs text-gray-500">{reward.description}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Points Required: {reward.points_required} | Available: {reward.quantity_available}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberShip;
