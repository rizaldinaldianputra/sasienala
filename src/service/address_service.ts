// src/service/address_service.ts
import { ShippingAddress } from '../interface/address';
import { apiCore } from './main_service';

export const addressService = {
  // Ambil semua alamat user
  getAllAddress: (id: number) => apiCore.get<ShippingAddress[]>(`/address/user/${id}`),

  // Ambil detail alamat berdasarkan ID
  getAddressById: (id: number) => apiCore.get(`/address/user/${id}`),

  // Tambah alamat baru
  addAddress: (address: ShippingAddress) => apiCore.post<ShippingAddress>('/address/', address),

  // Update alamat
  updateAddress: (id: number, address: Partial<ShippingAddress>) =>
    apiCore.put<ShippingAddress>(`/address/${id}`, address),

  // Hapus alamat
  deleteAddress: (id: number) => apiCore.delete<void>(`/address/${id}`),

  // Set alamat sebagai primary
  setPrimaryAddress: (id: number) => apiCore.put(`/address/${id}/set-primary`),

  // Dropdown
  getProvince: () => apiCore.get('/address/provinces'),
  getCityByProvince: (provinceId: number) => apiCore.get(`/address/cities/${provinceId}`),
  getDistrictByCity: (cityId: number) => apiCore.get(`/address/districts/${cityId}`),
  getSubdistrictByDistrict: (districtId: number) =>
    apiCore.get(`/address/sub-districts/${districtId}`),
  getSubdistrictByDistrictName: (districtName: string) =>
    apiCore.get(`/address/sub-districts/by-district-name/${districtName}`),
};
