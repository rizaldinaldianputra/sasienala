import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/Appbar';
import { COLORS } from '../constants/colors';
import { useUser } from '../hook/useUser';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, fetchUser, updateProfile, updateProfilePhoto } = useUser();

  // State untuk semua field
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('male');
  const [birthDate, setBirthDate] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch user saat mount
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        await fetchUser();
      } catch (err) {
        console.error('Gagal fetch user', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Parsing profile dari user
  useEffect(() => {
    if (user) {
      setBio(user.profile?.bio || '');
      setPhone(user.profile?.phone_number || '');
      setGender(user.profile?.gender || 'male');
      setBirthDate(user.profile?.birth_date || '');
      setProfilePicture(user.profile?.profile_picture || 'https://picsum.photos/200');
    }
  }, [user]);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(URL.createObjectURL(file)); // preview lokal
      setUploading(true);
      try {
        await updateProfilePhoto(file);
        alert('Foto profil berhasil diperbarui');
      } catch (err) {
        alert(err.message || 'Gagal update foto profil');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async () => {
    const updatedProfile = {
      bio,
      phone_number: phone,
      gender,
      birth_date: birthDate,
      profile_picture: profilePicture,
    };

    try {
      await updateProfile(updatedProfile);
      alert('Profil berhasil diperbarui');
      navigate('/account');
    } catch (err) {
      alert(err.message || 'Gagal update profil');
    }
  };

  if (loading) return <p className="text-center mt-10">Memuat profil...</p>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded pb-24">
      <AppBar title="Profile Detail" onBack={() => window.history.back()} />

      <div className="flex flex-col items-center mb-6 mt-7">
        <div className="relative">
          <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
          <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-lg flex items-center justify-center">
            📷
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          {uploading && <p className="text-sm text-gray-500 mt-2 text-center">Mengunggah...</p>}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label>Nomor Telepon</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label>Jenis Kelamin</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
        </div>

        <div>
          <label>Tanggal Lahir</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <div className="sticky bottom-4 mt-6">
        <button
          onClick={handleSave}
          style={{ backgroundColor: COLORS.primary }}
          className="w-full text-white py-3 rounded shadow-lg"
        >
          Simpan Update
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
