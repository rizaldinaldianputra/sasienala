import { useState } from 'react';
import { CartItem, UpdateCartResponse, UpdateQuantityResponse } from '../interface/cart';
import { cartService } from '../service/cart_service';
import { getUserId } from '../session/session';

export const useCart = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  // Ambil cart user
  const getCart = async (): Promise<CartItem[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const id = getUserId();
      if (!id) throw new Error('User ID tidak ditemukan di cookies');
      setUserId(id);

      const response = await cartService.getCartbyUser(id);
      setCartItems(response); // ambil data dari axios response
      return response;
    } catch (err: any) {
      setError(err.message || 'Error fetching cart');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update quantity cart
  const updateQuantity = async (
    cartId: number,
    qty: number,
  ): Promise<UpdateQuantityResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.updateQtyCart(cartId, { quantity: qty });
      // update quantity di state lokal jika perlu
      const updatedCart = cartItems.map((item) =>
        item.id === cartId ? { ...item, quantity: response.quantity } : item,
      );
      setCartItems(updatedCart);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error updating quantity');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add item ke cart
  const addCartItem = async (
    user_id: number,
    product_id: number,
    model_id: number,
    quantity: number,
  ): Promise<UpdateCartResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.addCart({
        user_id: user_id,
        product_id: product_id,
        model_id: model_id,
        quantity: quantity,
      });
      return response;
    } catch (err: any) {
      setError(err.message || 'Error adding item to cart');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCart = async (cartId: number): Promise<UpdateCartResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.deleteCart(cartId);
      // update state lokal dengan menghapus item yang dihapus
      const updatedCart = cartItems.filter((item) => item.id !== cartId);
      setCartItems(updatedCart);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error deleting cart item');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    cartItems,
    userId,
    loading,
    error,
    getCart,
    updateQuantity,
    addCartItem,
    deleteCart,
  };
};
