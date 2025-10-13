import Cookies from 'js-cookie';
import { useState } from 'react';
import { User } from '../interface/user';
import { userService } from '../service/user_service';

export const useUser = () => {
  const [users, setUsers] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch semua users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      if (data) {
        setUsers(data);

        // Simpan user_id pertama ke cookie
        const firstUserId = data.user_id;
        if (firstUserId) {
          Cookies.set('userId', firstUserId.toString(), { expires: 7 });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, fetchUsers, setUsers };
};
