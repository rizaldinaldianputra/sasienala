// src/service/voucher_service.ts
import { Voucher } from '../interface/voucer';
import { apiCore } from './main_service';

export const voucherService = {
  getVoucherByUser: (id: number) => apiCore.get<Voucher[]>(`/voucher/user-vouchers/${id}`),
  getAllPromoVoucher: () => apiCore.get<Voucher[]>(`/voucher/promotions`),
  redeemVoucher: (params: { user_id: number; code: string }) =>
    apiCore.post<String[]>(`/voucher/redeem`, params),
};
