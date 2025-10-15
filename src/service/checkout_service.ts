// src/service/checkout_service.ts
import {
  CheckoutPayload,
  CheckoutResponse,
  CheckoutValidatePayload,
  CheckoutValidateResponse,
} from '../interface/checkout';
import { apiCore } from './main_service';

export const checkoutService = {
  // Mendapatkan opsi pengiriman berdasarkan origin, destination, weight
  getShippingOptions: (body: CheckoutPayload) =>
    apiCore.post<CheckoutResponse>('/checkout/shipping-cost', body),

  // Validate checkout
  checkoutValidate: (body: CheckoutValidatePayload) =>
    apiCore.post<CheckoutValidateResponse>('/checkout/validate', body),

  // Checkout final dengan semua detail (items, courier, shipping, vouchers)
  checkoutFinal: (body: CheckoutPayload) =>
    apiCore.post<CheckoutResponse>('/checkout/create', body),
};
