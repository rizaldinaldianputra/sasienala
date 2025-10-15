// src/interface/voucher.ts

export interface Voucher {
  code: string;
  type: string;
  name: string;
  purpose: string;
  category: string;
  desc: string;
  term: string;
  value: string;
  min_order: string;
  max_discount: string;
  start_date: string;
  end_date: string;
  usage_limit: number;
  usage_per_user: number;
  is_active: boolean;
  id: number;
}

export interface RedeemedVoucher {
  id: number;
  voucher: Voucher;
  redeemed_at: string;
}
