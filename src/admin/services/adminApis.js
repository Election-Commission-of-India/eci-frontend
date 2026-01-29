import apiClient from '../../services/apis.js';

// Admin Authentication with JWT
export const adminLogin = async (loginData) => {
  const response = await apiClient.post('/admin/login', loginData);

  // Store JWT token if login successful
  if (response.data.jwt) {
    localStorage.setItem('authToken', response.data.jwt);
    localStorage.setItem('authRole', 'ROLE_ADMIN');
  }

  return response.data;
};


// User Management APIs
export const createUser = async (userData) => {
  const response = await apiClient.post('/admin/users', userData);
  return response.data;
};

export const getAllUsers = async (page = 0, size = 10, role = null, isActive = null) => {
  const params = { page, size };
  if (role) params.role = role;
  if (isActive !== null) params.isActive = isActive;

  const response = await apiClient.get('/admin/users', { params });
  return response.data;
};

export const toggleUserStatus = async (userId) => {
  const response = await apiClient.put(`/admin/users/${userId}/toggle-status`);
  return response.data;
};

export const assignRole = async (userId, role) => {
  const response = await apiClient.put(`/admin/users/${userId}/assign-role`, null, {
    params: { role }
  });
  return response.data;
};

// Constituency Management APIs
export const createConstituency = async (constituencyData) => {
  const response = await apiClient.post('/admin/constituencies', constituencyData);
  return response.data;
};

export const updateConstituency = async (id, constituencyData) => {
  const response = await apiClient.put(`/admin/constituencies/${id}`, constituencyData);
  return response.data;
};

export const toggleConstituencyStatus = async (id) => {
  const response = await apiClient.put(`/admin/constituencies/${id}/toggle-status`);
  return response.data;
};

// Polling Station Management APIs
export const createPollingStation = async (stationData) => {
  const response = await apiClient.post('/admin/polling-stations', stationData);
  return response.data;
};

export const updatePollingStation = async (id, stationData) => {
  const response = await apiClient.put(`/admin/polling-stations/${id}`, stationData);
  return response.data;
};

export const assignPollingStationToConstituency = async (stationId, constituencyId) => {
  const response = await apiClient.put(`/admin/polling-stations/${stationId}/assign-constituency/${constituencyId}`);
  return response.data;
};

export const checkPollingStationAssignment = async (stationId) => {
  const response = await apiClient.get(`/admin/polling-stations/${stationId}/assignment`);
  return response.data;
};

// Document Type Management APIs
export const createDocumentType = async (documentTypeData) => {
  const response = await apiClient.post('/admin/document-types', documentTypeData);
  return response.data;
};

export const getDistricts = async () => {
  const response = await apiClient.get('/admin/districts');
  return response.data;
};

// Logout function
export const adminLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authRole');
  localStorage.removeItem('adminUser');
};
