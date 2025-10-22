// services/loyalty_service.ts
import { LoyaltyRedeemResponse } from '../interface/loyalty';
import { apiCore } from './main_service';

export const loyaltyService = {
  // Ambil status loyalty user
  getStatus: (userId: number) => apiCore.get(`/loyalty/status/${userId}`),

  // Ambil transaksi/point loyalty user
  getTransactions: (userId: number) => apiCore.get(`/loyalty/transactions/${userId}`),

  // Redeem point
  redeemPoints: (userId: number, points: number): Promise<LoyaltyRedeemResponse> =>
    apiCore.post<LoyaltyRedeemResponse>(`/loyalty/redeem/${userId}?points=${points}`),

  // Ambil daftar tier loyalty
  getTiers: () => apiCore.get(`/loyalty/tiers`),
};
