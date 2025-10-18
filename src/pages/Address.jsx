// src/pages/AddressManager.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/Appbar';
import { COLORS } from '../constants/colors';
import { addressService } from '../service/address_service';
import { getUserId } from '../session/session';

const AddressManager = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      const res = await addressService.getAllAddress(userId || 0);
      setAddresses(res.data || res);
    } catch (err) {
      setError(err.message || 'Gagal fetch alamat');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus alamat ini?')) return;
    try {
      await addressService.deleteAddress(id);
      fetchAddresses();
    } catch (err) {
      alert(err.message || 'Gagal hapus alamat');
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      await addressService.setPrimaryAddress(id);
      fetchAddresses();
    } catch (err) {
      alert(err.message || 'Gagal set alamat utama');
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <AppBar title="Manajemen Alamat" onBack={() => window.history.back()} />

      <button
        className="w-full py-2 text-white rounded mb-2"
        style={{ backgroundColor: COLORS.primary }}
        onClick={() => navigate('/address/form')} // tambah tanpa id
      >
        Tambah Alamat
      </button>

      {addresses.length === 0 && <p>Belum ada alamat</p>}
      {addresses.map((addr) => (
        <div key={addr.id} className="border p-3 rounded shadow space-y-1">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{addr.receiver_name}</span>
            {addr.is_primary && (
              <span
                className="text-xs px-2 py-1 rounded text-white"
                style={{ backgroundColor: COLORS.primary }}
              >
                Utama
              </span>
            )}
          </div>
          <p>📞 {addr.phone}</p>
          <p>🏠 {addr.full_address}</p>
          {addr.tags && <p className="text-xs text-gray-500">Tag: {addr.tags}</p>}
          <div className="flex gap-2 mt-1">
            <button
              className="text-blue-500 text-sm"
              onClick={
                () => navigate('/address/form', { state: { existingAddress: addr } }) // edit kirim semua data address
              }
            >
              Edit
            </button>
            <button className="text-red-500 text-sm" onClick={() => handleDelete(addr.id)}>
              Hapus
            </button>
            {!addr.is_primary && (
              <button className="text-green-500 text-sm" onClick={() => handleSetPrimary(addr.id)}>
                Set Utama
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressManager;
