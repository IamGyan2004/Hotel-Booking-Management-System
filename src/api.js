const api = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const getHotels = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/hotels${query ? `?${query}` : ''}`);
};

export const register = (payload) => api('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
export const login = (payload) => api('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
export const getMyBookings = (token) => api('/bookings/mine', { headers: { Authorization: `Bearer ${token}` } });
export const createBooking = (token, payload) => api('/bookings', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
export const cancelBooking = (token, id) => api(`/bookings/${id}/cancel`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });