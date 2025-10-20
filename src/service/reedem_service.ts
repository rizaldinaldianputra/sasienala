// services/loyalty_redeem_service.ts
import { RedeemItem, RedeemRewardResponse } from '../interface/reward';
import { apiCore } from './main_service';

export const loyaltyRedeemService = {
  // Ambil semua item yang bisa diredeem
  getAll: (): Promise<RedeemItem[]> => apiCore.get<RedeemItem[]>('/rewards/all'),

  // Redeem item tertentu
  redeemReward: (rewardId: number): Promise<RedeemRewardResponse> =>
    apiCore.post(`/rewards/redeem`, { reward_id: rewardId }),
};
