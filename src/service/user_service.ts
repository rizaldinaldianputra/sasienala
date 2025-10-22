import { Profile, UpdateProfileResponse, UploadPhotoResponse } from '../interface/user';
import { apiCore } from './main_service';

export const userService = {
  // Ambil data user (check token)
  getAll: () => apiCore.get('/profile/get-profile'),

  updateProfile: (profileData: Profile): Promise<UpdateProfileResponse> => {
    const formData = new FormData();

    // masukkan semua field dari profileData ke FormData
    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    return apiCore.putForm<UpdateProfileResponse>('/profile/update-profile', formData);
  },

  // Update foto profil (form data)
  updateFotoProfile: (file: File): Promise<UploadPhotoResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiCore.postForm<UploadPhotoResponse>('/profile/upload-profile-picture', formData);
  },
};
