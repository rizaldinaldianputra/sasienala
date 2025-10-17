// src/hook/useVoucher.ts
import { useEffect, useState } from 'react';
import { Voucher } from '../interface/voucer';
import { voucherService } from '../service/voucher_service';
import { getUserId } from '../session/session';

export const useVoucher = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [allvouchers, setAllVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const userId = getUserId();
        const res = await voucherService.getVoucherByUser(userId || 0);
        setVouchers(res);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    const fetchAllVouchers = async () => {
      setLoading(true);
      try {
        const res = await voucherService.getAllPromoVoucher();
        setAllVouchers(res);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
    fetchAllVouchers();
  }, []);

  const redeemVoucher = async (code: string) => {
    setLoading(true);
    try {
      const userId = getUserId() || 0;
      const res = await voucherService.redeemVoucher({ user_id: userId, code });
      return res;
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { vouchers, loading, error, allvouchers, redeemVoucher };
};

export default useVoucher;
