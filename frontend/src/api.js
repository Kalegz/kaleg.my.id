const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'API Error');
  }

  return res.json();
};

// ─── Public API ──────────────────────────────────────────────────────────────

export const getProfile = () => apiFetch('/profile');

export const getSkills = () => apiFetch('/skills');

export const getExperiences = () => apiFetch('/experiences');

export const getPosts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/posts${query ? '?' + query : ''}`);
};

export const getPost = (slug) => apiFetch(`/posts/${slug}`);

// ─── Admin Auth ───────────────────────────────────────────────────────────────

export const adminLogin = (credentials) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });

export const adminLogout = () =>
  apiFetch('/admin/logout', { method: 'POST' });

export const getAdminMe = () => apiFetch('/admin/me');

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

export const updateProfile = (data) =>
  apiFetch('/admin/profile', { method: 'PUT', body: JSON.stringify(data) });

export const uploadAvatar = (file) => {
  const token = localStorage.getItem('admin_token');
  const formData = new FormData();
  formData.append('avatar', file);
  // No Content-Type header — browser sets it with the correct multipart boundary
  return fetch(`${API_BASE}/admin/profile/avatar`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Upload failed');
    }
    return res.json();
  });
};

export const createSkill = (data) =>
  apiFetch('/admin/skills', { method: 'POST', body: JSON.stringify(data) });

export const updateSkill = (id, data) =>
  apiFetch(`/admin/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteSkill = (id) =>
  apiFetch(`/admin/skills/${id}`, { method: 'DELETE' });

export const createExperience = (data) =>
  apiFetch('/admin/experiences', { method: 'POST', body: JSON.stringify(data) });

export const updateExperience = (id, data) =>
  apiFetch(`/admin/experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteExperience = (id) =>
  apiFetch(`/admin/experiences/${id}`, { method: 'DELETE' });

export const getAdminPosts = () => apiFetch('/admin/posts');

export const createPost = (data) =>
  apiFetch('/admin/posts', { method: 'POST', body: JSON.stringify(data) });

export const updatePost = (id, data) =>
  apiFetch(`/admin/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deletePost = (id) =>
  apiFetch(`/admin/posts/${id}`, { method: 'DELETE' });
