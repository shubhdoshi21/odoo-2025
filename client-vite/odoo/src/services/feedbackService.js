import api from "./api";

const feedbackService = {
  // Get user's feedback
  getUserFeedback: async (params = {}) => {
    const response = await api.get("/feedback", { params });
    return response;
  },

  // Get feedback for a specific user
  getFeedbackForUser: async (userId, params = {}) => {
    const response = await api.get(`/feedback/user/${userId}`, { params });
    return response;
  },

  // Get feedback for a specific swap
  getFeedbackForSwap: async (swapId, params = {}) => {
    const response = await api.get(`/feedback/swap/${swapId}`, { params });
    return response;
  },

  // Get feedback by ID
  getFeedbackById: async (feedbackId) => {
    const response = await api.get(`/feedback/${feedbackId}`);
    return response;
  },

  // Create new feedback
  createFeedback: async (feedbackData) => {
    const response = await api.post("/feedback", feedbackData);
    return response;
  },

  // Update feedback
  updateFeedback: async (feedbackId, updateData) => {
    const response = await api.put(`/feedback/${feedbackId}`, updateData);
    return response;
  },

  // Delete feedback
  deleteFeedback: async (feedbackId) => {
    const response = await api.delete(`/feedback/${feedbackId}`);
    return response;
  },
};

export default feedbackService;
