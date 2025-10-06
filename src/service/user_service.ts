import { User } from '../interface/user';
import { apiCore } from './main_service';

export const userService = {
  getAll: () => apiCore.get<User[]>('/users'),
  getById: (id: number) => apiCore.get<User>(`/users/${id}`),
  create: (data: Omit<User, 'id'>) => apiCore.post<User>('/users', data),
  update: (id: number, data: Partial<User>) => apiCore.put<User>(`/users/${id}`, data),
  delete: (id: number) => apiCore.delete<{ success: boolean }>(`/users/${id}`),
};
