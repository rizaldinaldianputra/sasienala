export interface Product {
  attribute_list?: Attribute[];
  brand?: string;
  category_id?: number;
  category_name?: string | null;
  condition?: string;
  created_at?: string;
  create_time?: string;
  description?: string;
  has_model?: boolean;
  image?: string;
  image_square?: boolean;
  item_id?: number;
  item_name?: string;
  item_sku?: string;
  item_status?: string;
  logistic_info?: LogisticInfo[];
  order_count?: number;
  pre_order?: boolean;
  price?: number;
  stock?: number;
  tags?: Record<string, any>;
  updated_at?: string;
  update_time?: string;
  weight?: number;
}

export interface Attribute {
  attribute_id?: number;
  original_attribute_name?: string;
  attribute_value_list?: AttributeValue[];
  is_mandatory?: boolean;
}

export interface AttributeValue {
  value_id?: number;
  original_value_name?: string;
  value_unit?: string;
}

export interface LogisticInfo {
  logistic_id?: number;
  logistic_name?: string;
  enabled?: boolean;
  size_id?: number;
  is_free?: boolean;
  estimated_shipping_fee?: number;
}

export interface ProductResponse {
  count: number;
  data: Product[];
}
