import { CartItem, UpdateCartResponse, UpdateQuantityResponse } from '../interface/cart';
import { apiCore } from './main_service';

export const cartService = {
  getCartbyUser: (id: number) => apiCore.get<CartItem[]>(`/cart/get-cart/${id}`),
  updateQtyCart: (id: number, body: { quantity: number }) =>
    apiCore.put<UpdateQuantityResponse>(`/cart/update-cart/${id}`, body),
  addCart: (body: { user_id: number; product_id: number; model_id: number; quantity: number }) =>
    apiCore.post<UpdateCartResponse>(`/cart/store-cart`, body),
  deleteCart: (id: number) => apiCore.delete<UpdateCartResponse>(`/cart/remove-cart/${id}`),
};
