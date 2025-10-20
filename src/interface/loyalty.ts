// interface/loyalty.ts

// Status loyalty user
export interface LoyaltyStatus {
  tier: string;
  points_balance: number;
  current_spent: number;
  next_tier: string;
  points_to_next_tier: number;
  progress_percent: number;
}

// Transaksi poin loyalty
export interface LoyaltyTransaction {
  id: number;
  type: 'earn' | 'redeem';
  points: number;
  balance_after: number;
  reason: string;
  created_at: string; // ISO date string
}

// Response saat redeem point
export interface LoyaltyRedeemResponse {
  message: string;
  points_remaining: number;
  transaction_id: number;
}

// Membership / tier loyalty
export interface LoyaltyTier {
  id: number;
  name: string;
  description: string;
  required_points: number;
  required_spent: number;
  discount_percent: number;
  other_benefits: LoyaltyOtherBenefits;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface LoyaltyOtherBenefits {
  point_rate: string;
  bonus_points: number;
  voucher: string;
  freebies: string;
  message: string;
}
