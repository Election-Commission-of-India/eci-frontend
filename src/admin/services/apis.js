import axios from 'axios';

// Backend base URL
export const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * REQUEST INTERCEPTOR
 * - Attaches JWT token automatically
 * - Uses SINGLE token: authToken
 */
apiClient.interceptors.request.use(
  (config) => {
    // Do NOT attach token for login APIs
    if (config.url?.includes('/login')) {
      return config;
    }

    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      'API Request:',
      config.method?.toUpperCase(),
      config.url
    );

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * - Handles 401 (expired / invalid token)
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      'Response Error:',
      error.response?.status,
      error.config?.url
    );

    // Token expired / invalid
    if (error.response?.status === 401) {
      // Clear session
      localStorage.removeItem('authToken');
      localStorage.removeItem('authRole');
      localStorage.removeItem('user');

      // Redirect based on current path
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else if (window.location.pathname.startsWith('/ero')) {
        window.location.href = '/ero/login';
      } else {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
