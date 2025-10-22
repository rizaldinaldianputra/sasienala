// services/order_service.ts
import { Order, OrderConfirmResponse } from '../interface/order';
import { apiCore } from './main_service';

export const orderService = {
  getAll: (id: number) => apiCore.get(`/transactions/user/${id}`),
  getById: (id: number): Promise<Order> => apiCore.get<Order>(`/transactions/detail/${id}`),
  confirmPayment: (id: number): Promise<OrderConfirmResponse> =>
    apiCore.post<OrderConfirmResponse>(`/transactions/confirm/${id}`),
};
