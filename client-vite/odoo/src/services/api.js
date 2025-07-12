import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Handle 403 errors (forbidden)
    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response.data);
    }

    // Handle 500 errors (server error)
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
