// Centralized auth utility for BLO
// This file will be updated to use JWT when authentication is implemented
// Page components should NOT access localStorage directly

const AUTH_KEYS = {
  USER_ID: 'bloUserId',
  USER_DATA: 'bloUserData',
  TOKEN: 'bloToken'
};

export const getCurrentUserId = () => {
  return localStorage.getItem(AUTH_KEYS.USER_ID);
};

export const setCurrentUser = (loginResponse) => {
  if (loginResponse.userId) {
    localStorage.setItem(AUTH_KEYS.USER_ID, loginResponse.userId.toString());
  }
  if (loginResponse.token) {
    localStorage.setItem(AUTH_KEYS.TOKEN, loginResponse.token);
  }
  localStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(loginResponse));
};

export const getCurrentUserData = () => {
  const userData = localStorage.getItem(AUTH_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

export const getToken = () => {
  return localStorage.getItem(AUTH_KEYS.TOKEN);
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEYS.USER_ID);
  localStorage.removeItem(AUTH_KEYS.USER_DATA);
  localStorage.removeItem(AUTH_KEYS.TOKEN);
};

export const isAuthenticated = () => {
  return !!getCurrentUserId();
};