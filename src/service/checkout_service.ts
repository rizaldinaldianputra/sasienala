// src/service/checkout_service.ts
import {
  CheckoutPayload,
  CheckoutPaymentResponse,
  CheckoutValidatePayload,
  CheckoutValidateResponse,
  Payment,
} from '../interface/checkout';
import { MidtransPayload, MidtransResponsePayload } from '../interface/midtrans';
import { apiCore } from './main_service';

export const checkoutService = {
  // Mendapatkan opsi pengiriman berdasarkan origin, destination, weight
  getShippingOptions: (body: CheckoutPayload) =>
    apiCore.post<Payment>('/checkout/shipping-cost', body),

  // Validate checkout
  checkoutValidate: (body: CheckoutValidatePayload) =>
    apiCore.post<CheckoutValidateResponse>('/checkout/validate', body),

  // Checkout final dengan semua detail (items, courier, shipping, vouchers)
  checkoutFinal: (body: CheckoutPayload) =>
    apiCore.post<CheckoutPaymentResponse>('/checkout/create', body),

  confirmPayment: (body: MidtransPayload) =>
    apiCore.post<MidtransResponsePayload>('/payments/confirm', body),
};
