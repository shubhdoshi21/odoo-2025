import api from "./api";

const skillService = {
  // Get all skills with pagination and filters
  getAllSkills: async (params = {}) => {
    const response = await api.get("/skills", { params });
    return response;
  },

  // Search skills
  searchSkills: async (query, limit = 10) => {
    const response = await api.get("/skills/search", {
      params: { q: query, limit },
    });
    return response;
  },

  // Get popular skills
  getPopularSkills: async (limit = 10) => {
    const response = await api.get("/skills/popular", { params: { limit } });
    return response;
  },

  // Get skills by category
  getSkillsByCategory: async (params = {}) => {
    const { category, ...otherParams } = params;
    const response = await api.get(`/skills/category/${category}`, {
      params: otherParams,
    });
    return response;
  },

  // Get skill by ID
  getSkillById: async (skillId) => {
    const response = await api.get(`/skills/${skillId}`);
    return response;
  },
};

export default skillService;
