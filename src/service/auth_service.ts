import { apiCore } from './main_service';

export const authService = {
  login: (data: { email: string; password: string }) => apiCore.post('/auth/login', data),
};
