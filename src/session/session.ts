import Cookies from 'js-cookie';

// simpan token
export const setToken = (token: string, expiresDays: number = 7) => {
  Cookies.set('token', token, { expires: expiresDays });
};

// ambil token
export const getToken = (): string | null => {
  return Cookies.get('token') || null;
};

// hapus token
export const removeToken = () => {
  Cookies.remove('token');
};

export const setUserId = (userId: number, expiresDays: number = 7) => {
  Cookies.set('userId', userId.toString(), { expires: expiresDays });
};

// ambil user_id
export const getUserId = (): number | null => {
  const id = Cookies.get('userId');
  return id ? parseInt(id, 10) : null;
};

// hapus user_id
export const removeUserId = () => {
  Cookies.remove('userId');
};
