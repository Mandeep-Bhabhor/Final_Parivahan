import api from './axios';

// Company
export const companyService = {
  getCompany: () => api.get('/company'),
  addUser: (data) => api.post('/company/users', data),
  getUsers: () => api.get('/company/users'),
};

// Warehouses
export const warehouseService = {
  getAll: () => api.get('/warehouses'),
  create: (data) => api.post('/warehouses', data),
  getOne: (id) => api.get(`/warehouses/${id}`),
  update: (id, data) => api.put(`/warehouses/${id}`, data),
  delete: (id) => api.delete(`/warehouses/${id}`),
};

// Vehicles
export const vehicleService = {
  getAll: () => api.get('/vehicles'),
  create: (data) => api.post('/vehicles', data),
  getOne: (id) => api.get(`/vehicles/${id}`),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
};

// Parcels
export const parcelService = {
  getAll: () => api.get('/parcels'),
  create: (data) => api.post('/parcels', data),
  getOne: (id) => api.get(`/parcels/${id}`),
  accept: (id) => api.post(`/parcels/${id}/accept`),
  reject: (id) => api.post(`/parcels/${id}/reject`),
};

// Shipments
export const shipmentService = {
  getAll: () => api.get('/shipments'),
  create: (data) => api.post('/shipments', data),
  getOne: (id) => api.get(`/shipments/${id}`),
  updateStatus: (id, status) => api.patch(`/shipments/${id}/status`, { status }),
};
