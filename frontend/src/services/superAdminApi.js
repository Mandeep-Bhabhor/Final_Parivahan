import api from './axios';

// Super Admin API services
export const superAdminService = {
  // Dashboard stats
  getStats: () => api.get('/super-admin/stats'),

  // Companies
  getCompanies: () => api.get('/super-admin/companies'),
  getCompany: (id) => api.get(`/super-admin/companies/${id}`),
  createCompany: (data) => api.post('/super-admin/companies', data),
  updateCompany: (id, data) => api.put(`/super-admin/companies/${id}`, data),
  toggleCompanyStatus: (id) => api.post(`/super-admin/companies/${id}/toggle-status`),
  
  // Company Admin
  createCompanyAdmin: (companyId, data) => api.post(`/super-admin/companies/${companyId}/create-admin`, data),

  // Users
  getAllUsers: () => api.get('/super-admin/users'),

  // Parcels & Shipments (read-only)
  getAllParcels: () => api.get('/super-admin/parcels'),
  getAllShipments: () => api.get('/super-admin/shipments'),
};
