import { useEffect, useState } from 'react';
import { User } from '../interface/user';
import { userService } from '../service/user_service';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch semua users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      if (data) setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async (user: Omit<User, 'id'>) => {
    try {
      const newUser = await userService.create(user);
      if (newUser) setUsers((prev) => [newUser, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Error creating user');
    }
  };

  // Delete user
  const deleteUser = async (id: number) => {
    try {
      const res = await userService.delete(id);
      if (res?.success) setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error deleting user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, fetchUsers, createUser, deleteUser, setUsers };
};
