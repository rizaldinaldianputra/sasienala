import Cookies from 'js-cookie';
import { useState } from 'react';
import { DataUser, Profile, UpdateProfileResponse, UploadPhotoResponse } from '../interface/user';
import { userService } from '../service/user_service';

export const useUser = () => {
  const [user, setUser] = useState<DataUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user dari token
  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUser(data);

      // Simpan user_id ke cookie
      if (data.id) {
        Cookies.set('userId', data.id.toString(), { expires: 7 });
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching user');
    } finally {
      setLoading(false);
    }
  };

  // Update profil
  // Update profil
  const updateProfile = async (profileData: Profile): Promise<UpdateProfileResponse | void> => {
    setLoading(true);
    setError(null);
    try {
      // Kirim langsung ke backend tanpa bungkus profile
      const res = await userService.updateProfile(profileData);

      return res;
    } catch (err: any) {
      setError(err.message || 'Error updating profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload foto profil
  const updateProfilePhoto = async (file: File): Promise<UploadPhotoResponse | void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.updateFotoProfile(file);
      if (user) {
        setUser({
          ...user,
          profile: {
            ...user.profile,
            profile_picture: `https://sasienala.id/api/${res.file_path}`,
          },
        });
      }
      return res;
    } catch (err: any) {
      setError(err.message || 'Error uploading profile photo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    setUser,
    loading,
    error,
    fetchUser,
    updateProfile,
    updateProfilePhoto,
  };
};
