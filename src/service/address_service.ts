import { ShippingAddress } from '../interface/address';
import { apiCore } from './main_service';

export const addressService = {
  // Ambil semua alamat user
  getAllAddress: () => apiCore.get<ShippingAddress[]>('/address'),

  // Ambil detail alamat berdasarkan ID
  getAddressById: (id: number) => apiCore.get<ShippingAddress>(`/address/user/${id}`),

  // Tambah alamat baru
  addAddress: (address: ShippingAddress) => apiCore.post<ShippingAddress>('/address', address),

  // Update alamat
  updateAddress: (id: number, address: Partial<ShippingAddress>) =>
    apiCore.put<ShippingAddress>(`/address/${id}`, address),

  // Hapus alamat
  deleteAddress: (id: number) => apiCore.delete<void>(`/address/${id}`),
};
