export interface User {
  status: string;
  user_id: number;
  user_email: string;
  user_name: string;
  profile_picture: string;
}

export interface DataUser {
  id: number;
  email: string;
  username: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  profile: Profile;
}

export interface UploadPhotoResponse {
  message: string;
  file_path: string;
}

export interface UpdateProfileResponse {
  message: string;
}

export interface Profile {
  bio: string;
  phone_number: string;
  gender: string;
  birth_date: string;
  profile_picture: string;
  created_at: string;
  updated_at: string;
}
