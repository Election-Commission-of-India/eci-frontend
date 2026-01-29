import apiClient from '../../services/apis.js';

// ERO Authentication with JWT
export const eroLogin = async (loginData) => {
  const response = await apiClient.post('/ero/login', loginData);

  // Store JWT token if login successful
  if (response.data.jwt) {
    if (response.data.jwt) {
      localStorage.setItem('authToken', response.data.jwt);
      localStorage.setItem('authRole', 'ROLE_ERO');
    }

  }

  return response.data;
};

// ERO Dashboard (requires JWT)
export const getEroDashboard = async () => {
  const response = await apiClient.get('/ero/dashboard');
  return response.data;
};

// ERO Voters (requires JWT)
export const getAllVoters = async () => {
  const response = await apiClient.get('/ero/voters');
  return response.data;
};

// ERO Applications (requires JWT)
export const getApplicationsByConstituency = async (constituencyId) => {
  const response = await apiClient.get(`/ero/applications/constituency/${constituencyId}`);
  return response.data;
};

export const filterApplications = async (filters) => {
  const params = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params[key] = value;
    }
  });

  const response = await apiClient.get('/ero/applications/filter', { params });
  return response.data;
};

export const getApplicationWithBlo = async (applicationId) => {
  const response = await apiClient.get(`/ero/applications/${applicationId}/blo-review`);
  return response.data;
};

// ERO BLO Assignment (requires JWT)
export const assignBloToBooth = async (assignmentData) => {
  const response = await apiClient.post('/ero/blo/assign-blo', null, {
    params: assignmentData
  });
  return response.data;
};

// ERO Complaints (requires JWT)
export const getComplaints = async (constituencyId, status) => {
  const params = { constituencyId };
  if (status) params.status = status;

  const response = await apiClient.get('/ero/complaints', { params });
  return response.data;
};

export const getComplaintDetails = async (complaintId) => {
  const response = await apiClient.get(`/ero/complaints/${complaintId}`);
  return response.data;
};

export const assignComplaintToBlo = async (complaintId, assignmentData) => {
  const response = await apiClient.post(`/ero/complaints/${complaintId}/assign`, assignmentData);
  return response.data;
};

// ERO Documents (requires JWT)
export const getDocumentsByApplication = async (applicationId) => {
  const response = await apiClient.get(`/ero/documents/application/${applicationId}`);
  return response.data;
};

export const verifyDocument = async (documentId, verificationData) => {
  const response = await apiClient.post(`/ero/documents/${documentId}/verify`, verificationData);
  return response.data;
};

// EPIC Generation
export const generateEpic = async (applicationId) => {
  const response = await apiClient.post(`/ero/applications/${applicationId}/approve`);
  return response.data;
};

// Logout function
export const eroLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authRole');
  localStorage.removeItem('eroUser');
};
