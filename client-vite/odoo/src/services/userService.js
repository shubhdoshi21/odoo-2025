import api from './api';

const userService = {
  // Get all users with pagination and filters
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response;
  },

  // Search users
  searchUsers: async (params = {}) => {
    const response = await api.get('/users/search', { params });
    return response;
  },

  // Get top rated users
  getTopRatedUsers: async (limit = 10) => {
    const response = await api.get('/users/top-rated', { params: { limit } });
    return response;
  },

  // Get user by ID
  getUserById: async userId => {
    const response = await api.get(`/users/${userId}`);
    return response;
  },

  // Get users by skill
  getUsersBySkill: async (params = {}) => {
    const { skillId, ...otherParams } = params;
    const response = await api.get(`/users/skill/${skillId}`, {
      params: otherParams,
    });
    return response;
  },

  uploadProfilePhoto: async file => {
    const formData = new FormData();
    formData.append('profilePhoto', file);
    const response = await api.post('/users/profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },
};

export default userService;
