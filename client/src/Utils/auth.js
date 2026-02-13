// auth.js
export const isAuthenticated = () => {
  const token = localStorage.getItem('blood-app-token');
  return !!token; // returns true if token exists
};
