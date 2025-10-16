// midtrans.ts

/** ==============================
 * Payload Interfaces
 * ============================== */
export interface MidtransPayload {
  order_id: number;
  snap_response: SnapResponse;
}

export interface SnapResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status: string;
  va_numbers: VaNumber[];
  bca_va_number: string;
  pdf_url: string;
  finish_redirect_url: string;
}

export interface VaNumber {
  bank: string;
  va_number: string;
}

/** ==============================
 * Response Interfaces
 * ============================== */
export interface MidtransResponsePayload {
  success: boolean;
  midtrans_response: MidtransResponse;
  message: string;
  payment_method: string;
}

export interface MidtransResponse {
  status_code: string;
  transaction_id: string;
  gross_amount: string;
  currency: string;
  order_id: string;
  payment_type: string;
  signature_key: string;
  transaction_status: string;
  fraud_status: string;
  status_message: string;
  merchant_id: string;
  va_numbers: VaNumber[];
  payment_amounts: PaymentAmount[];
  transaction_time: string;
  settlement_time: string;
  expiry_time: string;
}

export interface PaymentAmount {
  // kosong untuk saat ini, karena array kosong di response
  // bisa ditambahkan field jika ada data di response lain
}
