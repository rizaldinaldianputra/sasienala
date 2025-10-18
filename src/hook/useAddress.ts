// src/hook/useAddress.ts
import { useEffect, useState } from 'react';
import { ShippingAddress } from '../interface/address';
import { addressService } from '../service/address_service';
import { getUserId } from '../session/session';

// ==========================
// Hook utama untuk alamat user
// ==========================
export const useAddress = (autoFetchAll = true) => {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [address, setAddress] = useState<ShippingAddress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      const res = await addressService.getAllAddress(userId || 0);
      setAddresses(res); // langsung pakai res, jangan res.data
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengambil alamat');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddressById = async (id?: number) => {
    try {
      setLoading(true);
      const userId = id || getUserId();
      const res = await addressService.getAddressById(userId || 0);
      const primary = Array.isArray(res)
        ? res.find((addr) => addr.is_primary)
        : res.is_primary
        ? res
        : null;
      setAddress(primary || null);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengambil alamat');
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (newAddress: ShippingAddress) => {
    try {
      setLoading(true);
      const res = await addressService.addAddress({ ...newAddress, user_id: getUserId() || 0 });
      setAddresses((prev) => [...prev, res]);
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan alamat');
    } finally {
      setLoading(false);
    }
  };

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

  const setPrimaryAddress = async (id: number) => {
    try {
      setLoading(true);
      await addressService.setPrimaryAddress(id); // <- ini harus sesuai
      setAddresses((prev) => prev.map((addr) => ({ ...addr, is_primary: addr.id === id })));
      const primary = addresses.find((addr) => addr.id === id) || null;
      setAddress(primary);
    } catch (err: any) {
      setError(err.message || 'Gagal set alamat primary');
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setAddresses([]);
    setAddress(null);
    setError(null);
  };

  useEffect(() => {
    if (autoFetchAll) fetchAddresses();
  }, [autoFetchAll]);

  return {
    addresses,
    address,
    loading,
    error,
    refetch: fetchAddresses,
    fetchAddressById,
    addAddress,
    updateAddress,
    deleteAddress,
    setPrimaryAddress,
    clearData,
  };
};

// ==========================================
// Hook cascading dropdown Provinsi → Kota → Kecamatan → Kelurahan
// ==========================================
export const useAddressDropdown = () => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [subdistricts, setSubdistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const res = await addressService.getProvince();
      setProvinces(res); // langsung pakai res
    } catch (err: any) {
      setError(err.message || 'Gagal ambil provinsi');
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async (provinceId: number) => {
    try {
      setLoading(true);
      const res = await addressService.getCityByProvince(provinceId);
      setCities(res); // langsung pakai res
    } catch (err: any) {
      setError(err.message || 'Gagal ambil kota');
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (cityId: number) => {
    try {
      setLoading(true);
      const res = await addressService.getDistrictByCity(cityId);
      setDistricts(res); // langsung pakai res
    } catch (err: any) {
      setError(err.message || 'Gagal ambil kecamatan');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubdistricts = async (districtId: number) => {
    try {
      setLoading(true);
      const res = await addressService.getSubdistrictByDistrict(districtId);
      setSubdistricts(res); // langsung pakai res
    } catch (err: any) {
      setError(err.message || 'Gagal ambil kelurahan');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubdistrictsByName = async (districtName: string) => {
    try {
      setLoading(true);
      const res = await addressService.getSubdistrictByDistrictName(districtName);
      setSubdistricts(res); // langsung pakai res
    } catch (err: any) {
      setError(err.message || 'Gagal ambil kelurahan by nama kecamatan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  return {
    provinces,
    cities,
    districts,
    subdistricts,
    loading,
    error,
    fetchCities,
    fetchDistricts,
    fetchSubdistricts,
    fetchSubdistrictsByName,
  };
};
