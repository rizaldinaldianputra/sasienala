// models/Cart.ts
export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  model_id: number;
  quantity: number;
  is_active: boolean;
  product_name: string;
  product_image: string;
  price: number;
  stock: number;
  model_color: string;
  model_size: string;
}

export interface UpdateQuantityResponse {
  message: string;
  cart_id: number;
  quantity: number;
}

export interface UpdateCartResponse {
  message: string;
  cart_id: number;
}
