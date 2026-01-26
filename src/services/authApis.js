import apiClient from './apis.js';

// User Authentication APIs
export const authApis = {
  // User Login
  login: async (loginData) => {
    const response = await apiClient.post('/users/api/login', loginData);
    return response.data;
  },

  // User Signup
  signup: async (signupData) => {
    const response = await apiClient.post('/users/api/adduser', signupData);
    return response.data;
  },

  // Get User Profile
  getUserProfile: async (userId) => {
    const response = await apiClient.get(`/users/api/profile/${userId}`);
    return response.data;
  },

  // Update User Profile
  updateProfile: async (userId, updateData) => {
    const response = await apiClient.put(`/users/api/updateprofile/${userId}`, updateData);
    return response.data;
  }
};