// src/interface/checkout.ts
export interface CourierOption {
  courier_name: string;
  courier_code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface CheckoutOptions {
  couriers: CourierOption[];
}

export interface Payment {
  success: boolean;
  total_weight: number;
  options: CheckoutOptions;
}

export interface CheckoutItem {
  item_id: number;
  product_id: number;
  model_id: number;
  quantity: number;
  note?: string;
}

export interface CheckoutVoucher {
  voucher_id: number;
  discount_amount: number;
}

export interface CheckoutPayload {
  user_id: number;
  address_id: number;
  items: CheckoutItem[];
  courier_name: string;
  courier_service: string;
  shipping_cost: number;
  vouchers?: CheckoutVoucher[];
}

export interface CheckoutValidatePayload {
  user_id: number;
  items: CheckoutItem[];
}

export interface CheckoutValidateResponse {
  success: boolean;
  message: string;
}

export interface CheckoutPaymentResponse {
  success: boolean;
  order: {
    id: number;
    subtotal: number;
    discount: number;
    shipping_cost: number;
    final_total: number;
    status: string;
    payment_status: string;
  };
  snap_token?: string;
}
