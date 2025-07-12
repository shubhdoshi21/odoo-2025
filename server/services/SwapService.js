const SwapRepository = require("../repositories/SwapRepository");
const UserRepository = require("../repositories/UserRepository");
const SkillRepository = require("../repositories/SkillRepository");

class SwapService {
  // Get user's swaps
  static async getUserSwaps(userId, options = {}) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const result = await SwapRepository.getUserSwaps(userId, options);
      return result;
    } catch (error) {
      throw new Error(`Error getting user swaps: ${error.message}`);
    }
  }

  // Get pending swaps
  static async getPendingSwaps(userId) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const swaps = await SwapRepository.getPendingSwaps(userId);
      return swaps;
    } catch (error) {
      throw new Error(`Error getting pending swaps: ${error.message}`);
    }
  }

  // Get swap by ID
  static async getSwapById(swapId, userId) {
    try {
      if (!swapId) {
        throw new Error("Swap ID is required");
      }

      const swap = await SwapRepository.findById(swapId, userId);
      return swap;
    } catch (error) {
      throw new Error(`Error getting swap by ID: ${error.message}`);
    }
  }

  // Create new swap
  static async createSwap(swapData) {
    try {
      // Map field names to match the Swap model expectations
      const mappedData = {
        requester: swapData.requesterId, // Already set by controller
        responder: swapData.responder, // The user being requested from
        requestedSkill: swapData.requestedSkill, // The skill being requested
        offeredSkill: swapData.offeredSkill, // The skill being offered
        message: swapData.message,
        scheduledDate: swapData.scheduledDate,
      };

      // Validate required fields
      if (
        !mappedData.requester ||
        !mappedData.responder ||
        !mappedData.requestedSkill ||
        !mappedData.offeredSkill
      ) {
        throw new Error(
          "Requester, responder, requested skill, and offered skill are required"
        );
      }

      // Check if requester and responder are different users
      if (mappedData.requester === mappedData.responder) {
        throw new Error("Requester and responder cannot be the same user");
      }

      // Check if requester exists
      const requester = await UserRepository.findById(mappedData.requester);
      if (!requester) {
        throw new Error("Requester not found");
      }

      // Check if responder exists
      const responder = await UserRepository.findById(mappedData.responder);
      if (!responder) {
        throw new Error("Responder not found");
      }

      // Check if requested skill exists
      const requestedSkill = await SkillRepository.findById(
        mappedData.requestedSkill
      );
      if (!requestedSkill) {
        throw new Error("Requested skill not found");
      }

      // Check if offered skill exists
      const offeredSkill = await SkillRepository.findById(
        mappedData.offeredSkill
      );
      if (!offeredSkill) {
        throw new Error("Offered skill not found");
      }

      // Check if responder has the requested skill (using offeredSkills field)
      const responderHasRequestedSkill = responder.offeredSkills.some(
        (skill) => skill._id.toString() === mappedData.requestedSkill.toString()
      );
      if (!responderHasRequestedSkill) {
        throw new Error("Responder does not have the requested skill");
      }

      // Check if requester has the offered skill (using offeredSkills field)
      const requesterHasOfferedSkill = requester.offeredSkills.some(
        (skill) => skill._id.toString() === mappedData.offeredSkill.toString()
      );
      if (!requesterHasOfferedSkill) {
        throw new Error("Requester does not have the offered skill");
      }

      // Check if there's already a pending or accepted swap between these users
      const canCreate = await SwapRepository.canCreateSwap(
        mappedData.requester,
        mappedData.responder
      );
      if (!canCreate) {
        throw new Error(
          "There is already a pending or accepted swap between these users"
        );
      }

      const swap = await SwapRepository.create(mappedData);
      return swap;
    } catch (error) {
      throw new Error(`Error creating swap: ${error.message}`);
    }
  }

  // Update swap
  static async updateSwap(swapId, updateData, userId) {
    try {
      if (!swapId) {
        throw new Error("Swap ID is required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      // Check if swap exists and user has access
      const existingSwap = await SwapRepository.findById(swapId, userId);
      if (!existingSwap) {
        throw new Error("Swap not found or access denied");
      }

      // Only allow updates if swap is pending
      if (existingSwap.status !== "pending") {
        throw new Error("Can only update pending swaps");
      }

      // Only allow requester to update
      if (existingSwap.requesterId._id.toString() !== userId) {
        throw new Error("Only the requester can update the swap");
      }

      const swap = await SwapRepository.update(swapId, updateData, userId);
      return swap;
    } catch (error) {
      throw new Error(`Error updating swap: ${error.message}`);
    }
  }

  // Accept swap
  static async acceptSwap(swapId, userId) {
    try {
      if (!swapId) {
        throw new Error("Swap ID is required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      const swap = await SwapRepository.acceptSwap(swapId, userId);
      if (!swap) {
        throw new Error("Swap not found or cannot be accepted");
      }

      return swap;
    } catch (error) {
      throw new Error(`Error accepting swap: ${error.message}`);
    }
  }

  // Reject swap
  static async rejectSwap(swapId, userId, reason) {
    try {
      if (!swapId) {
        throw new Error("Swap ID is required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      // Reason is optional, use empty string if not provided
      const finalReason = reason ? reason.trim() : "";

      const swap = await SwapRepository.rejectSwap(swapId, userId, finalReason);
      if (!swap) {
        throw new Error("Swap not found or cannot be rejected");
      }

      return swap;
    } catch (error) {
      throw new Error(`Error rejecting swap: ${error.message}`);
    }
  }

  // Cancel swap
  static async cancelSwap(swapId, userId, reason) {
    try {
      if (!swapId) {
        throw new Error("Swap ID is required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      // Reason is optional, use empty string if not provided
      const finalReason = reason ? reason.trim() : "";

      const swap = await SwapRepository.cancelSwap(swapId, userId, finalReason);
      if (!swap) {
        throw new Error("Swap not found or cannot be cancelled");
      }

      return swap;
    } catch (error) {
      throw new Error(`Error cancelling swap: ${error.message}`);
    }
  }

  // Complete swap
  static async completeSwap(swapId, userId) {
    try {
      if (!swapId) {
        throw new Error("Swap ID is required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      const swap = await SwapRepository.completeSwap(swapId, userId);
      if (!swap) {
        throw new Error("Swap not found or cannot be completed");
      }

      return swap;
    } catch (error) {
      throw new Error(`Error completing swap: ${error.message}`);
    }
  }

  // Delete swap
  static async deleteSwap(swapId, userId) {
    try {
      if (!swapId) {
        throw new Error("Swap ID is required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      const swap = await SwapRepository.delete(swapId, userId);
      if (!swap) {
        throw new Error("Swap not found or cannot be deleted");
      }

      return swap;
    } catch (error) {
      throw new Error(`Error deleting swap: ${error.message}`);
    }
  }

  // Get swap statistics
  static async getSwapStats(userId) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const stats = await SwapRepository.getSwapStats(userId);
      return stats;
    } catch (error) {
      throw new Error(`Error getting swap statistics: ${error.message}`);
    }
  }

  // Get all swaps (Admin only)
  static async getAllSwaps(options = {}) {
    try {
      const result = await SwapRepository.getAllSwaps(options);
      return result;
    } catch (error) {
      throw new Error(`Error getting all swaps: ${error.message}`);
    }
  }

  // Get swaps by status
  static async getSwapsByStatus(status, options = {}) {
    try {
      if (!status) {
        throw new Error("Status is required");
      }

      const validStatuses = [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "completed",
      ];
      if (!validStatuses.includes(status)) {
        throw new Error("Invalid status");
      }

      const result = await SwapRepository.getAllSwaps({ ...options, status });
      return result;
    } catch (error) {
      throw new Error(`Error getting swaps by status: ${error.message}`);
    }
  }

  // Get swaps between two users
  static async getSwapsBetweenUsers(userId1, userId2, options = {}) {
    try {
      if (!userId1 || !userId2) {
        throw new Error("Both user IDs are required");
      }

      const result = await SwapRepository.getSwapsBetweenUsers(
        userId1,
        userId2,
        options
      );
      return result;
    } catch (error) {
      throw new Error(`Error getting swaps between users: ${error.message}`);
    }
  }

  // Get recent swaps
  static async getRecentSwaps(limit = 10) {
    try {
      const result = await SwapRepository.getAllSwaps({
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      return result;
    } catch (error) {
      throw new Error(`Error getting recent swaps: ${error.message}`);
    }
  }

  // Get swap suggestions for user
  static async getSwapSuggestions(userId, limit = 10) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      // Get user's skills
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (!user.skills || user.skills.length === 0) {
        return {
          swaps: [],
          pagination: { page: 1, limit, total: 0, pages: 0 },
        };
      }

      // Find users who have skills that the current user wants
      const suggestions = await SwapRepository.getSwapSuggestions(
        userId,
        user.skills,
        limit
      );
      return suggestions;
    } catch (error) {
      throw new Error(`Error getting swap suggestions: ${error.message}`);
    }
  }
}

module.exports = SwapService;
