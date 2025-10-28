import Cookies from 'js-cookie';

// ==================== TOKEN ====================

// simpan token
export const setToken = (token: string, expiresDays: number = 7) => {
  Cookies.set('token', token, { expires: expiresDays, path: '/' });
};

// ambil token
export const getToken = (): string | null => {
  return Cookies.get('token') || null;
};

// hapus token
export const removeToken = () => {
  Cookies.remove('token', { path: '/' });
};

// ==================== USER ID ====================

// simpan userId
export const setUserId = (userId: number, expiresDays: number = 7) => {
  Cookies.set('userId', userId.toString(), { expires: expiresDays, path: '/' });
};

// ambil userId
export const getUserId = (): number | null => {
  const id = Cookies.get('userId');
  return id ? parseInt(id, 10) : null;
};

// hapus userId
export const removeUserId = () => {
  Cookies.remove('userId', { path: '/' });
};

// ==================== CLEAR SESSION ====================

// hapus semua session (token + userId)
export const clearSession = () => {
  Object.keys(Cookies.get()).forEach((c) => Cookies.remove(c, { path: '/' }));
};
