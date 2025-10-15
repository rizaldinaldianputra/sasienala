export interface ShippingAddress {
  id: number;
  user_id: number;
  receiver_name: string;
  phone: string;
  province_id: number;
  province_name: string;
  city_id: number;
  city_name: string;
  district_id: number;
  district_name: string;
  subdistrict_id: number;
  subdistrict_name: string;
  postal_code: string;
  full_address: string;
  other: string;
  latitude: number;
  longitude: number;
  tags: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}
