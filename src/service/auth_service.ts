import { apiCore } from './main_service';

export const authService = {
  login: (data: { email: string; password: string }) => apiCore.post('/auth/login', data),
  register: (data: { email: string; password: string; username: string }) =>
    apiCore.post('/auth/register', data),
};
