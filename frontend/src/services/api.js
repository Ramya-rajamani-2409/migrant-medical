// src/services/api.js
// Central place for all API calls

import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api', // proxied to http://localhost:5000/api
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mmrs_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- AUTH ----
export const loginUser = (data) => api.post('/auth/login', data);

// ---- WORKER ----
export const getWorkerProfile = () => api.get('/worker/profile');
export const getWorkerRecords = () => api.get('/worker/records');
export const getPublicWorkerProfile = (workerId) => api.get(`/worker/public/${workerId}`);

// ---- DOCTOR ----
export const getDoctorProfile = () => api.get('/doctor/profile');
export const updateDoctorProfile = (data) => api.put('/doctor/profile', data);
export const searchWorkers = (q, type) => api.get(`/doctor/search?q=${q}&type=${type}`);
export const getWorkerForDoctor = (id) => api.get(`/doctor/worker/${id}`);
export const addPrescription = (workerId, data) => api.post(`/doctor/prescription/${workerId}`, data);
export const getDoctorActivity = () => api.get('/doctor/activity');

// ---- ADMIN ----
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getWorkers = () => api.get('/admin/workers');
export const getWorkerFull = (id) => api.get(`/admin/workers/${id}`);
export const addWorker = (data) => api.post('/admin/workers', data);
export const updateWorker = (id, data) => api.put(`/admin/workers/${id}`, data);
export const removeWorker = (id) => api.delete(`/admin/workers/${id}`);
export const getDoctors = () => api.get('/admin/doctors');
export const addDoctor = (data) => api.post('/admin/doctors', data);
export const updateDoctor = (id, data) => api.put(`/admin/doctors/${id}`, data);
export const removeDoctor = (id) => api.delete(`/admin/doctors/${id}`);
export const generatePassword = () => api.get('/admin/generate-password');
export const getAllActivity = () => api.get('/admin/activity');

export default api;
