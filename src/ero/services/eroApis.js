import apiClient from '../../services/apis.js';

// ERO Authentication
export const eroLogin = async (loginData) => {
  const response = await apiClient.post('/api/login', loginData);
  return response.data;
};

// ERO Dashboard
export const getEroDashboard = async () => {
  const response = await apiClient.get('/dashboard');
  return response.data;
};

// ERO Voters
export const getAllVoters = async () => {
  const response = await apiClient.get('/voters');
  return response.data;
};

// ERO Applications
export const getApplicationsByConstituency = async (constituencyId) => {
  const response = await apiClient.get(`/applications/constituency/${constituencyId}`);
  return response.data;
};

export const filterApplications = async (filters) => {
  const params = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params[key] = value;
    }
  });

  const response = await apiClient.get('/applications/filter', { params });
  return response.data;
};

export const getApplicationWithBlo = async (applicationId) => {
  const response = await apiClient.get(`/applications/${applicationId}/blo-review`);
  return response.data;
};

// ERO BLO Assignment
export const assignBloToBooth = async (assignmentData) => {
  const response = await apiClient.post('/api/ero/blo/assign-blo', null, {
    params: assignmentData
  });
  return response.data;
};

// ERO Complaints
export const getComplaints = async (constituencyId, status) => {
  const params = { constituencyId };
  if (status) params.status = status;

  const response = await apiClient.get('/ero/complaints/complaints', { params });
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

// ERO Documents
export const getDocumentsByApplication = async (applicationId) => {
  const response = await apiClient.get(`/ero/documents/application/${applicationId}`);
  return response.data;
};

export const verifyDocument = async (documentId, verificationData) => {
  const response = await apiClient.post(`/ero/documents/${documentId}/verify`, verificationData);
  return response.data;
};