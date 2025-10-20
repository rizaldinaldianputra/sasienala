// interface/loyalty_redeem.ts

// Voucher detail
export interface VoucherDetails {
  id: number;
  name: string;
  desc: string;
  type: 'percentage' | 'fixed';
  value: number;
}

// Product detail
export interface ProductDetails {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

// Reward type enum
export type RewardType = 'voucher' | 'product';

// Redeemable item
export interface RedeemItem {
  id: number;
  name: string;
  description: string;
  'reward_type.value': RewardType;
  points_required: number;
  quantity_available: number;
  redemption_limit_per_user: number;
  user_redemption_count: number;
  is_redeemable: boolean;
  redeem_notice: string | null;
  required_tier_name: string;
  product_details: ProductDetails | null;
  voucher_details: VoucherDetails | null;
}

// interface/reward.ts
export interface RedeemRewardResponse {
  success: boolean;
  message: string;
  points_balance_after: number;
}
