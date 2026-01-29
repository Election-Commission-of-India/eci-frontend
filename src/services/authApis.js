import api from "./apiInterceptor";

const AUTH_API_URL = "/api/users"; // ✅ Added /api prefix

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post(`${AUTH_API_URL}/adduser`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Registration failed";
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post(`${AUTH_API_URL}/login`, credentials);

      if (response.data.jwt) {
        // Store JWT token
        localStorage.setItem("jwtToken", response.data.jwt);

        // Decode JWT to get user info
        const userInfo = decodeToken(response.data.jwt);
        localStorage.setItem("user", JSON.stringify(userInfo));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || "Login failed";
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post(`${AUTH_API_URL}/logout`); // ✅ Fixed URL
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Always clear local storage
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`${AUTH_API_URL}/profile/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to fetch profile";
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(
        `${AUTH_API_URL}/updateprofile/${userId}`,
        profileData,
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to update profile";
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("jwtToken");
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get JWT token
  getToken: () => {
    return localStorage.getItem("jwtToken");
  },
};

// Helper function to decode JWT (basic decode, not verification)
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default authService;
