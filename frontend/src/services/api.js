import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds timeout
});

// Add a request interceptor to set auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Movies API
export const moviesApi = {
  // Get all movies
  getAll: () => api.get('/movies'),
  
  // Get a single movie by ID
  getById: (id) => api.get(`/movies/${id}`),
  
  // Upload a new movie
  upload: (formData, onUploadProgress) => api.post('/movies/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  }),
  
  // Request a movie
  requestMovie: (data) => api.post('/movies/request', data)
};

// Auth API
export const authApi = {
  // Login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Signup
  signup: (userData) => api.post('/auth/signup', userData),
  
  // Get current user
  getCurrentUser: () => api.get('/users/me')
};

export default api;