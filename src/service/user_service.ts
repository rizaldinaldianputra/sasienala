import { DataUser, Profile, UpdateProfileResponse, UploadPhotoResponse } from '../interface/user';
import { apiCore } from './main_service';

export const userService = {
  // Ambil data user (check token)
  getAll: (): Promise<DataUser> => apiCore.get<DataUser>('/profile/get-profile'),

  // Update data profil (bio, phone_number, gender, birth_date, profile_picture)
  updateProfile: (profileData: Profile): Promise<UpdateProfileResponse> => {
    return apiCore.put<UpdateProfileResponse>('/profile/update-profile', profileData);
  },

  // Update foto profil (form data)
  updateFotoProfile: (file: File): Promise<UploadPhotoResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiCore.postForm<UploadPhotoResponse>('/profile/upload-profile-picture', formData);
  },
};
