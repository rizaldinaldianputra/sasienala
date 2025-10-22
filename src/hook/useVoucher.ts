// src/hook/useVoucher.ts
import { useState } from 'react';
import { Voucher } from '../interface/voucer';
import { voucherService } from '../service/voucher_service';
import { getUserId } from '../session/session';

export const useVoucher = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [allVouchers, setAllVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch voucher user
  const fetchVouchers = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      if (!userId) throw new Error('User ID tidak ditemukan');
      const res = await voucherService.getVoucherByUser(userId);
      setVouchers(res.data);
      return res;
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengambil voucher user');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch semua promo voucher
  const fetchAllVouchers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await voucherService.getAllPromoVoucher();
      setAllVouchers(res.data);
      return res;
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengambil promo voucher');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const redeemVoucher = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      if (!userId) throw new Error('User ID tidak ditemukan');

      const res = await voucherService.redeemVoucher({ user_id: userId, code });
      await fetchVouchers();
      return res;
    } catch (err: any) {
      return err.response || err; // agar punya struktur status/data
    } finally {
      setLoading(false);
    }
  };

  return {
    vouchers,
    allVouchers,
    loading,
    error,
    fetchVouchers,
    fetchAllVouchers,
    redeemVoucher,
  };
};

export default useVoucher;
