import { useEffect, useState } from 'react';
import {
  CheckoutPayload,
  CheckoutPaymentResponse,
  CheckoutValidatePayload,
  CourierOption,
} from '../interface/checkout';
import { MidtransPayload, MidtransResponsePayload } from '../interface/midtrans';
import { checkoutService } from '../service/checkout_service';

export const useCheckout = (
  payload?: CheckoutPayload,
  payloadCheck?: CheckoutValidatePayload,
  payloadCheckout?: CheckoutPayload,
) => {
  const [couriers, setCouriers] = useState<CourierOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validateMessage, setValidateMessage] = useState<string | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutPaymentResponse | null>(null);
  const [confirmResult, setConfirmResult] = useState<MidtransResponsePayload | null>(null);

  /** ==========================
   * Fetch shipping options
   * ========================== */
  const fetchShippingOptions = async () => {
    if (!payload) return;
    try {
      setLoading(true);
      const res = await checkoutService.getShippingOptions(payload);
      setCouriers(res.options.couriers);
    } catch (err: any) {
      setError(err?.message || 'Gagal mengambil opsi pengiriman');
    } finally {
      setLoading(false);
    }
  };

  /** ==========================
   * Validate checkout
   * ========================== */
  const checkoutValidate = async () => {
    if (!payloadCheck) return;
    try {
      setLoading(true);
      const res = await checkoutService.checkoutValidate(payloadCheck);
      if (!res.success) setValidateMessage(res.message);
      else setValidateMessage(null);
      return res;
    } catch (err: any) {
      setError(err?.message || 'Gagal validasi checkout');
    } finally {
      setLoading(false);
    }
  };

  /** ==========================
   * Checkout final
   * ========================== */
  const checkoutFinal = async (): Promise<CheckoutPaymentResponse | undefined> => {
    if (!payloadCheckout) return;
    try {
      setLoading(true);
      const res: CheckoutPaymentResponse = await checkoutService.checkoutFinal(payloadCheckout);
      setCheckoutResult(res);
      return res;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal melakukan checkout';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /** ==========================
   * Confirm payment Midtrans
   * ========================== */
  const confirmPayment = async (
    body: MidtransPayload,
  ): Promise<MidtransResponsePayload | undefined> => {
    if (!body) return;
    try {
      setLoading(true);
      const res: MidtransResponsePayload = await checkoutService.confirmPayment(body);
      setConfirmResult(res);
      return res;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal konfirmasi pembayaran';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /** ==========================
   * Fetch kurir jika payload berubah
   * ========================== */
  useEffect(() => {
    if (payload) fetchShippingOptions();
  }, [payload]);

  return {
    couriers,
    loading,
    error,
    validateMessage,
    checkoutResult,
    confirmResult,
    fetchShippingOptions,
    checkoutValidate,
    checkoutFinal,
    confirmPayment,
  };
};
