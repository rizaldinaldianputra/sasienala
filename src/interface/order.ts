export interface Item {
  id: number;
  product_id: number;
  model_id: number;
  product_name: string;
  image_url: string;
  price: number;
  quantity: number;
  total: number;
  note: string | null;
}

export interface Order {
  id: number;
  user_id: number;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  final_total: number;
  shipping_courier: string;
  shipping_service: string;
  shipping_tracking_number: string | null;
  shipping_status: string;
  payment_method: string | null;
  payment_status: string;
  payment_ref: string;
  snap_token: string;
  status: string;
  created_at: string;
  updated_at: string;
  items: Item[];
}

export type OrdersResponse = Order[];
