import { User } from '../interface/user';
import { apiCore } from './main_service';

export const userService = {
  getAll: () => apiCore.get<User>('/auth/check-token'),
};
