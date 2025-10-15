// src/service/voucher_service.ts
import { RedeemedVoucher, Voucher } from '../interface/voucer';
import { apiCore } from './main_service';

export const voucherService = {
  // Ambil semua voucher yang pernah diredeem
  getRedeemedVouchers: () => apiCore.get<RedeemedVoucher[]>('/vouchers/redeemed'),

  // Ambil semua voucher aktif
  getActiveVouchers: () => apiCore.get<Voucher[]>('/vouchers/active'),

  // Ambil voucher berdasarkan kode
  getVoucherByUser: (code: string) => apiCore.get<Voucher>(`/vouchers/user-vouchers/${code}`),

  // Redeem voucher
  redeemVoucher: (voucherId: number) => apiCore.post(`/vouchers/redeem/${voucherId}`),
};
