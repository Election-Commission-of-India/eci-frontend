import axiosInstance from '../../services/axiosInstance';


// BLO Authentication
export const bloLogin = async (loginData) => {
  const response = await axiosInstance.post('/api/v1/blo/login', loginData);
  return response.data;
};

// BLO Profile
export const getBloProfile = async (userId) => {
  const response = await axiosInstance.get(`/api/v1/blo/profile/${userId}`);
  return response.data;
};

// BLO Dashboard
export const getBloDashboard = async (userId) => {
  const response = await axiosInstance.get(`/api/v1/blo/dashboard/${userId}`);
  return response.data;
};

// BLO Applications
export const getAssignedApplications = async (userId) => {
  const response = await axiosInstance.get(`/api/v1/blo/applications/assigned/${userId}`);
  return response.data;
};

export const filterApplications = async (userId, filterData) => {
  const response = await axiosInstance.post(`/api/v1/blo/applications/filter/${userId}`, filterData);
  return response.data;
};

export const searchApplications = async (userId, searchTerm) => {
  const response = await axiosInstance.get(`/api/v1/blo/applications/search/${userId}?searchTerm=${encodeURIComponent(searchTerm)}`);
  return response.data;
};

export const getApplicationDetails = async (applicationId) => {
  const response = await axiosInstance.get(`/api/v1/blo/applications/details/${applicationId}`);
  return response.data;
};

export const getApplicationDocuments = async (applicationId) => {
  const response = await axiosInstance.get(`/api/v1/blo/applications/documents/${applicationId}`);
  return response.data;
};

export const verifyDocument = async (verificationData) => {
  const response = await axiosInstance.put('/api/v1/blo/applications/verify-document', verificationData);
  return response.data;
};

export const recommendApplication = async (recommendationData) => {
  const response = await axiosInstance.put('/api/v1/blo/applications/recommend', recommendationData);
  return response.data;
};