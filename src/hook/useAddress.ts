// src/hook/useAddress.ts
import { useEffect, useState } from 'react';
import { ShippingAddress } from '../interface/address';
import { addressService } from '../service/address_service';
import { getUserId } from '../session/session';

export const useAddress = (autoFetchAll = true) => {
  // State untuk list alamat
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);

  // State untuk detail alamat (misal untuk edit)
  const [address, setAddress] = useState<ShippingAddress | null>(null);

  // State loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch semua alamat
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await addressService.getAllAddress(); // pastikan ini return array
      setAddresses(res);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengambil alamat');
    } finally {
      setLoading(false);
    }
  };

  // Fetch detail alamat by id
  const fetchAddressById = async () => {
    try {
      const userId = getUserId();
      setLoading(true);
      const res = await addressService.getAddressById(userId || 0); // bisa array atau object
      // jika backend return array, filter is_primary
      const primary = Array.isArray(res)
        ? res.find((addr) => addr.is_primary)
        : res.is_primary
        ? res
        : null;
      setAddress(primary);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengambil alamat');
    } finally {
      setLoading(false);
    }
  };

  // Tambah alamat baru
  const addAddress = async (newAddress: ShippingAddress) => {
    try {
      setLoading(true);
      const res = await addressService.addAddress(newAddress);
      setAddresses((prev) => [...prev, res]);
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan alamat');
    } finally {
      setLoading(false);
    }
  };

  // Update alamat
  const updateAddress = async (id: number, updatedAddress: Partial<ShippingAddress>) => {
    try {
      setLoading(true);
      const res = await addressService.updateAddress(id, updatedAddress);
      setAddresses((prev) => prev.map((addr) => (addr.id === id ? res : addr)));
      if (address?.id === id) setAddress(res);
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui alamat');
    } finally {
      setLoading(false);
    }
  };

  // Hapus alamat
  const deleteAddress = async (id: number) => {
    try {
      setLoading(true);
      await addressService.deleteAddress(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      if (address?.id === id) setAddress(null);
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus alamat');
    } finally {
      setLoading(false);
    }
  };

  // Clear semua data
  const clearData = () => {
    setAddresses([]);
    setAddress(null);
    setError(null);
  };

  // Auto-fetch semua alamat
  useEffect(() => {
    if (autoFetchAll) fetchAddresses();
  }, [autoFetchAll]);

  return {
    addresses, // list alamat
    address, // detail alamat
    loading,
    error,
    refetch: fetchAddresses,
    fetchAddressById,
    addAddress,
    updateAddress,
    deleteAddress,
    clearData,
  };
};
