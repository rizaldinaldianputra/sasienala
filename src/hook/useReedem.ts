// hook/useRedeemReward.ts
import { useEffect, useState } from 'react';
import { RedeemItem } from '../interface/reward';
import { loyaltyRedeemService } from '../service/reedem_service';

export const useRedeemReward = () => {
  const [rewards, setRewards] = useState<RedeemItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [redeemLoading, setRedeemLoading] = useState<boolean>(false);

  const fetchRewards = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loyaltyRedeemService.getAll();
      setRewards(res.data);
    } catch (err: any) {
      setError(err.detail || 'Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async (rewardId: number): Promise<{ message: string } | null> => {
    setRedeemLoading(true);
    setError(null);

    try {
      const res = await loyaltyRedeemService.redeemReward(rewardId);
      let message = 'Terjadi kesalahan.';

      // backend sukses
      if ('success' in res.data && res.data.success) {
        message = res.data.message || 'Berhasil diredeem';
        await fetchRewards(); // refres.datah reward list after redeem
      }
      // backend gagal
      else if ('message' in res.data) {
        message = res.data.message;
      }

      return { message };
    } catch (err: any) {
      const message =
        err.message || 'Anda telah mencapai batas maksimal penukaran untuk reward ini';
      setError(message);
      return { message };
    } finally {
      setRedeemLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  return {
    rewards,
    loading,
    error,
    redeemLoading,
    refetch: fetchRewards,
    redeemReward,
  };
};
