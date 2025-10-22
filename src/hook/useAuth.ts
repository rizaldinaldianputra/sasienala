import Cookies from 'js-cookie';
import { useState } from 'react';
import { authService } from '../service/auth_service';

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login({ email, password });
      console.log('Full Axios response:', res); // debug

      const resData = res.data; // ambil data dari backend
      const firstUserId = resData.user_id;
      if (firstUserId) {
        Cookies.set('userId', firstUserId.toString(), { expires: 7 });
      }
      return resData;
    } catch (err: any) {
      console.log('Error Axios:', err);
      setError(err.response?.data?.message || err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register({ email, password, username });

      return res; // bisa langsung return data saja
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Register failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, token: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.verifyOtp({ email, token });
      return res.data || res;
    } catch (err: any) {
      const message = err.response?.data?.message || 'OTP verification failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.resendOtp({ email });
      return res;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to resend OTP';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, register, verifyOtp, resendOtp };
};
