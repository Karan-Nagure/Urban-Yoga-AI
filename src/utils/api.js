const BASE = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('uy_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  register:      (body)  => request('/auth/register',  { method: 'POST', body: JSON.stringify(body) }),
  login:         (body)  => request('/auth/login',     { method: 'POST', body: JSON.stringify(body) }),
  getProfile:    ()      => request('/user/profile'),
  updateProfile: (body)  => request('/user/profile',   { method: 'PUT',  body: JSON.stringify(body) }),
  saveSession:   (body)  => request('/user/session',   { method: 'POST', body: JSON.stringify(body) }),
  getSessions:   ()      => request('/user/sessions'),
  getStats:      ()      => request('/user/stats'),
};
