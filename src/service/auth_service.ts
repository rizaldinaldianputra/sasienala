import { apiCore } from './main_service';

export const authService = {
  login: (data: { email: string; password: string }) => apiCore.post('/auth/login', data),
  register: (data: { email: string; password: string; username: string }) =>
    apiCore.post('/auth/register', data),
  resendOtp: (data: { email: string }) => apiCore.post('/auth/send-verification-code', data),
  verifyOtp: (data: { email: string; token: string }) => apiCore.post('/auth/verify-email', data),
};
