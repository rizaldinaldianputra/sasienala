import { useEffect, useState } from 'react';
import AppBar from '../components/Appbar';
import { useLoyalty } from '../hook/useLoyalty';
import { useRedeemReward } from '../hook/useReedem';

function PointRedeem() {
  const { rewards, loading, redeemReward, redeemLoading } = useRedeemReward();
  const { transactions, refetchTransactions } = useLoyalty();
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog'); // <<< FIX

  const handleRedeemReward = async (rewardId) => {
    setProcessingId(rewardId);
    try {
      const res = await redeemReward(rewardId);
      if (res && res.message) {
        alert(res.message);
      } else {
        alert('Reward berhasil ditukar!');
      }
      await refetchTransactions();
    } catch (err) {
      console.error(err);
      if (err?.response?.data?.detail) {
        alert(err.response.data.detail);
      } else {
        alert('Gagal redeem reward.');
      }
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'transactions') {
      refetchTransactions();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden md:max-w-md lg:max-w-lg">
        <AppBar title="Tukar Poin" onBack={() => window.history.back()} />

        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-2 text-sm font-semibold ${
              activeTab === 'catalog'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('catalog')}
          >
            Katalog Reward
          </button>
          <button
            className={`flex-1 py-2 text-sm font-semibold ${
              activeTab === 'transactions'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            Transaksi Poin
          </button>
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          {activeTab === 'catalog' && (
            <div className="grid grid-cols-1 gap-3">
              {loading && <div className="text-xs text-gray-500">Loading rewards...</div>}
              {!loading && rewards.length === 0 && (
                <div className="text-xs text-gray-500">Belum ada reward tersedia.</div>
              )}
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-800">{reward.name}</div>
                    <div className="text-xs text-gray-500">{reward.description}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Points: {reward.points_required}
                    </div>
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
          )}

          {activeTab === 'transactions' && (
            <div className="grid grid-cols-1 gap-2">
              {!transactions || transactions.length === 0 ? (
                <div className="text-xs text-gray-500">Belum ada transaksi poin.</div>
              ) : (
                transactions.map((tx, idx) => (
                  <div key={idx} className="bg-gray-50 p-2 rounded-lg flex justify-between text-xs">
                    <div>{tx.description || 'Redeem/Top-up'}</div>
                    <div>{tx.points || 0} pts</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PointRedeem;
