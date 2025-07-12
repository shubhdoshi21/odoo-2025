import api from "./api";

const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    // If profileData is FormData, don't set Content-Type header
    if (profileData instanceof FormData) {
      const response = await api.put("/auth/profile", profileData, {
        headers: {
          "Content-Type": undefined, // Let browser set the correct Content-Type for FormData
        },
      });
      return response;
    } else {
      const response = await api.put("/auth/profile", profileData);
      return response;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post("/auth/change-password", passwordData);
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response;
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await api.post("/auth/reset-password", resetData);
    return response;
  },

  // Delete account
  deleteAccount: async (password) => {
    const response = await api.delete("/auth/account", { data: { password } });
    return response;
  },
};

export default authService;
