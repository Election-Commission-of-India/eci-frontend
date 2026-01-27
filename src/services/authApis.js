import apiClient from './apis.js';

// User Authentication APIs with JWT
export const authApis = {
  // User Login - returns JWT token
  login: async (loginData) => {
    const response = await apiClient.post('/users/api/login', loginData);

    // Store JWT token if login successful
    if (response.data.jwt) {
      localStorage.setItem('jwtToken', response.data.jwt);
    }

    return response.data;
  },

  // User Signup
  signup: async (signupData) => {
    const response = await apiClient.post('/users/api/adduser', signupData);
    return response.data;
  },

  // Get User Profile (requires JWT)
  getUserProfile: async (userId) => {
    const response = await apiClient.get(`/users/api/profile/${userId}`);
    return response.data;
  },

  // Update User Profile (requires JWT)
  updateProfile: async (userId, updateData) => {
    const response = await apiClient.put(`/users/api/updateprofile/${userId}`, updateData);
    return response.data;
  },

  // Logout - clear tokens
  logout: () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
  }
};