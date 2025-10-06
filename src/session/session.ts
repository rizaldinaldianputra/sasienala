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
