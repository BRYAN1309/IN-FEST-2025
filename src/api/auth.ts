// src/api/auth.ts
import api from './axios';

import axios from './axios';

export const register = async (data: any) => {
  try {
    const response = await axios.post('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Registration failed', error);
    throw error;
  }
};

export const login = async (data: { email: string; password: string }) => {
  const res = await api.post('/auth/login', data);
  const token = res.data.access_token;
  localStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return res;
};

export const getProfile = async () => {
  const token = localStorage.getItem('token');
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return api.get('/me');
};

export const logout = async () => {
  const token = localStorage.getItem('token');
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const res = await api.post('/logout');
  localStorage.removeItem('token');
  return res;
};
