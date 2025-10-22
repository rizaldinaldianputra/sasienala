// services/loyalty_redeem_service.ts
import { apiCore } from './main_service';

export const loyaltyRedeemService = {
  // Ambil semua item yang bisa diredeem
  getAll: () => apiCore.get('/rewards/all'),

  // Redeem item tertentu
  redeemReward: (rewardId: number) =>
    apiCore
      .post('/rewards/redeem', { reward_id: rewardId })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response?.data?.message || err.message || 'Terjadi kesalahan saat redeem';
      }),
};
