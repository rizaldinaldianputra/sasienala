// services/loyalty_service.ts
import {
  LoyaltyRedeemResponse,
  LoyaltyStatus,
  LoyaltyTier,
  LoyaltyTransaction,
} from '../interface/loyalty';
import { apiCore } from './main_service';

export const loyaltyService = {
  // Ambil status loyalty user
  getStatus: (userId: number): Promise<LoyaltyStatus> =>
    apiCore.get<LoyaltyStatus>(`/loyalty/status/${userId}`),

  // Ambil transaksi/point loyalty user
  getTransactions: (userId: number): Promise<LoyaltyTransaction[]> =>
    apiCore.get<LoyaltyTransaction[]>(`/loyalty/transactions/${userId}`),

  // Redeem point
  redeemPoints: (userId: number, points: number): Promise<LoyaltyRedeemResponse> =>
    apiCore.post<LoyaltyRedeemResponse>(`/loyalty/redeem/${userId}?points=${points}`),

  // Ambil daftar tier loyalty
  getTiers: (): Promise<LoyaltyTier[]> => apiCore.get<LoyaltyTier[]>(`/loyalty/tiers`),
};
