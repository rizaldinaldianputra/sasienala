// src/pages/AddressForm.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '../components/Appbar';
import { COLORS } from '../constants/colors';
import { addressService } from '../service/address_service';
import { getUserId } from '../session/session';

const AddressForm = ({ onSaved }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const existingAddress = location.state?.existingAddress || null;

  const [form, setForm] = useState({
    receiver_name: '',
    phone: '',
    province_id: null,
    city_id: null,
    district_id: null,
    subdistrict_id: null,
    full_address: '',
    other: '',
    postal_code: '',
    latitude: -6.9555339,
    longitude: 107.6438528,
    tags: 'home',
    is_primary: 1,
  });

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProvinces();
    if (existingAddress) {
      setForm({ ...existingAddress });
      if (existingAddress.province_id) fetchCities(existingAddress.province_id);
      if (existingAddress.city_id) fetchDistricts(existingAddress.city_id);
      if (existingAddress.district_id) fetchSubdistricts(existingAddress.district_id);
    }
  }, [existingAddress]);

  // ========== FETCH DROPDOWN ==========
  const fetchProvinces = async () => {
    try {
      const res = await addressService.getProvince();
      setProvinces(res.data || res);
    } catch (e) {
      console.error('Gagal fetch provinsi:', e);
    }
  };

  const fetchCities = async (provinceId) => {
    try {
      const res = await addressService.getCityByProvince(provinceId);
      setCities(res.data || res);
    } catch (e) {
      console.error('Gagal fetch kota:', e);
    }
  };

  const fetchDistricts = async (cityId) => {
    try {
      const res = await addressService.getDistrictByCity(cityId);
      setDistricts(res.data || res);
    } catch (e) {
      console.error('Gagal fetch kecamatan:', e);
    }
  };

  const fetchSubdistricts = async (districtId) => {
    try {
      const res = await addressService.getSubdistrictByDistrict(districtId);
      setSubdistricts(res.data || res);
    } catch (e) {
      console.error('Gagal fetch kelurahan:', e);
    }
  };

  // ========== HANDLE FORM ==========
  const handleChange = (key, value) => {
    const val = ['province_id', 'city_id', 'district_id', 'subdistrict_id'].includes(key)
      ? Number(value)
      : value;

    setForm((prev) => ({ ...prev, [key]: val }));

    if (key === 'province_id') {
      setCities([]);
      setDistricts([]);
      setSubdistricts([]);
      setForm((prev) => ({
        ...prev,
        city_id: null,
        district_id: null,
        subdistrict_id: null,
      }));
      if (value) fetchCities(Number(value));
    }

    if (key === 'city_id') {
      setDistricts([]);
      setSubdistricts([]);
      setForm((prev) => ({
        ...prev,
        district_id: null,
        subdistrict_id: null,
      }));
      if (value) fetchDistricts(Number(value));
    }

    if (key === 'district_id') {
      setSubdistricts([]);
      setForm((prev) => ({ ...prev, subdistrict_id: null }));
      if (value) fetchSubdistricts(Number(value));
    }
  };

  // ========== HANDLE SAVE ==========
  const handleSave = async () => {
    try {
      setLoading(true);
      const user_id = getUserId();

      const payload = {
        user_id: Number(user_id),
        receiver_name: form.receiver_name,
        phone: form.phone,
        province_id: Number(form.province_id),
        city_id: Number(form.city_id),
        district_id: Number(form.district_id),
        subdistrict_id: Number(form.subdistrict_id),
        full_address: form.full_address,
        other: form.other,
        postal_code: form.postal_code,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        tags: form.tags,
        is_primary: form.is_primary ? 1 : 0,
      };

      console.log('Payload add address:', payload);

      if (form.id) {
        await addressService.updateAddress(form.id, payload);
      } else {
        await addressService.addAddress(payload);
      }

      alert('Alamat berhasil disimpan');
      if (onSaved) onSaved();
      navigate(-1);
    } catch (err) {
      console.error('Gagal menyimpan alamat:', err);
      alert(err.message || 'Gagal menyimpan alamat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <AppBar title={form.id ? 'Edit Alamat' : 'Tambah Alamat'} onBack={() => navigate(-1)} />

      <div className="border p-4 rounded shadow space-y-2">
        <input
          type="text"
          placeholder="Nama Penerima"
          value={form.receiver_name}
          onChange={(e) => handleChange('receiver_name', e.target.value)}
          className="w-full border rounded p-2"
        />

        <input
          type="text"
          placeholder="Telepon"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="w-full border rounded p-2"
        />

        <select
          value={form.province_id || ''}
          onChange={(e) => handleChange('province_id', e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Pilih Provinsi</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={form.city_id || ''}
          onChange={(e) => handleChange('city_id', e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Pilih Kota</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={form.district_id || ''}
          onChange={(e) => handleChange('district_id', e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Pilih Kecamatan</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={form.subdistrict_id || ''}
          onChange={(e) => handleChange('subdistrict_id', e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Pilih Kelurahan</option>
          {subdistricts.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Alamat Lengkap"
          value={form.full_address}
          onChange={(e) => handleChange('full_address', e.target.value)}
          className="w-full border rounded p-2"
        />

        <input
          type="text"
          placeholder="Keterangan (Opsional)"
          value={form.other}
          onChange={(e) => handleChange('other', e.target.value)}
          className="w-full border rounded p-2"
        />

        <input
          type="text"
          placeholder="Kode Pos"
          value={form.postal_code}
          onChange={(e) => handleChange('postal_code', e.target.value)}
          className="w-full border rounded p-2"
        />

        <input
          type="text"
          placeholder="Tag (home/work)"
          value={form.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          className="w-full border rounded p-2"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!form.is_primary}
            onChange={(e) => handleChange('is_primary', e.target.checked ? 1 : 0)}
          />
          Jadikan Alamat Utama
        </label>

        <button
          onClick={handleSave}
          className="w-full py-2 mt-2 text-white rounded"
          style={{ backgroundColor: COLORS.primary }}
          disabled={loading}
        >
          {form.id ? 'Update' : 'Simpan'}
        </button>
      </div>
    </div>
  );
};

export default AddressForm;
