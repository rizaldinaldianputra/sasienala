// src/service/voucher_service.ts
import { Voucher } from '../interface/voucer';
import { apiCore } from './main_service';

export const voucherService = {
  // Ambil voucher berdasarkan user
  getVoucherByUser: (id: number) => apiCore.get<Voucher[]>(`/voucher/user-vouchers/${id}`),
};
