import api from "./api";

const swapService = {
  // Get user's swaps
  getUserSwaps: async (params = {}) => {
    const response = await api.get("/swaps", { params });
    return response;
  },

  // Get pending swaps
  getPendingSwaps: async () => {
    const response = await api.get("/swaps/pending");
    return response;
  },

  // Get swap by ID
  getSwapById: async (swapId) => {
    const response = await api.get(`/swaps/${swapId}`);
    return response;
  },

  // Create new swap
  createSwap: async (swapData) => {
    const response = await api.post("/swaps", swapData);
    return response;
  },

  // Update swap
  updateSwap: async (swapId, updateData) => {
    const response = await api.put(`/swaps/${swapId}`, updateData);
    return response;
  },

  // Accept swap
  acceptSwap: async (swapId) => {
    const response = await api.patch(`/swaps/${swapId}/accept`);
    return response;
  },

  // Reject swap
  rejectSwap: async (swapId, reason = "") => {
    const response = await api.patch(`/swaps/${swapId}/reject`, { reason });
    return response;
  },

  // Cancel swap
  cancelSwap: async (swapId, reason = "") => {
    const response = await api.patch(`/swaps/${swapId}/cancel`, { reason });
    return response;
  },

  // Complete swap
  completeSwap: async (swapId) => {
    const response = await api.patch(`/swaps/${swapId}/complete`);
    return response;
  },

  // Delete swap
  deleteSwap: async (swapId) => {
    const response = await api.delete(`/swaps/${swapId}`);
    return response;
  },
};

export default swapService;
