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
      return res;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
