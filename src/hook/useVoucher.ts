// src/hook/useVoucher.ts
import { useEffect, useState } from 'react';
import { Voucher } from '../interface/voucer';
import { voucherService } from '../service/voucher_service';
import { getUserId } from '../session/session';

export const useVoucher = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
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

    fetchVouchers();
  }, []); // ✅ hanya dijalankan sekali

  return { vouchers, loading, error };
};

export default useVoucher;
