// services/order_service.ts
import { Order, OrdersResponse } from '../interface/order';
import { apiCore } from './main_service';

export const orderService = {
  getAll: (id: number): Promise<OrdersResponse> =>
    apiCore.get<OrdersResponse>(`/transactions/user/${id}`),
  getById: (id: number): Promise<Order> => apiCore.get<Order>(`/orders/${id}`),
};
