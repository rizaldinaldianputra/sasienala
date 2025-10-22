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
      const firstUserId = res.user_id;
      if (firstUserId) {
        Cookies.set('userId', firstUserId.toString(), { expires: 7 });
      }
      return res;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
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

      // res.data adalah isi JSON dari backend
      console.log(res.data.access_token); // jika sukses
      console.log(res.data.detail); // jika backend mengembalikan { detail: 'Email sudah terdaftar' }

      return res.data; // bisa langsung return data saja
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Register failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, register };
};
