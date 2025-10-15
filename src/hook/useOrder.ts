// hook/useOrder.ts
import { useEffect, useState } from 'react';
import { OrdersResponse } from '../interface/order';
import { orderService } from '../service/order_service';
import { getUserId } from '../session/session';

export const useOrders = () => {
  const [orders, setOrders] = useState<OrdersResponse>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      const res = await orderService.getAll(userId || 0);
      setOrders(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const order = await orderService.getById(id);
      return order;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders, fetchOrderById };
};
