const SwapService = require("../services/SwapService");
const { validationResult } = require("express-validator");

class SwapController {
  // Get user's swaps
  static async getUserSwaps(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const userId = req.user.id;
      const {
        page = 1,
        limit = 10,
        status,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const result = await SwapService.getUserSwaps(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        message: "User swaps retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getUserSwaps:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get pending swaps
  static async getPendingSwaps(req, res) {
    try {
      const userId = req.user.id;
      const swaps = await SwapService.getPendingSwaps(userId);

      res.json({
        success: true,
        message: "Pending swaps retrieved successfully",
        data: { swaps },
      });
    } catch (error) {
      console.error("Error in getPendingSwaps:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get swap by ID
  static async getSwapById(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { swapId } = req.params;
      const userId = req.user.id;

      const swap = await SwapService.getSwapById(swapId, userId);

      if (!swap) {
        return res.status(404).json({
          success: false,
          message: "Swap not found",
        });
      }

      res.json({
        success: true,
        message: "Swap retrieved successfully",
        data: { swap },
      });
    } catch (error) {
      console.error("Error in getSwapById:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Create new swap
  static async createSwap(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const swapData = {
        ...req.body,
        requesterId: req.user.id,
      };

      const swap = await SwapService.createSwap(swapData);

      res.status(201).json({
        success: true,
        message: "Swap created successfully",
        data: { swap },
      });
    } catch (error) {
      console.error("Error in createSwap:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update swap
  static async updateSwap(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { swapId } = req.params;
      const updateData = req.body;
      const userId = req.user.id;

      const swap = await SwapService.updateSwap(swapId, updateData, userId);

      if (!swap) {
        return res.status(404).json({
          success: false,
          message: "Swap not found or access denied",
        });
      }

      res.json({
        success: true,
        message: "Swap updated successfully",
        data: { swap },
      });
    } catch (error) {
      console.error("Error in updateSwap:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Accept swap
  static async acceptSwap(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { swapId } = req.params;
      const userId = req.user.id;

      const swap = await SwapService.acceptSwap(swapId, userId);

      if (!swap) {
        return res.status(404).json({
          success: false,
          message: "Swap not found or access denied",
        });
      }

      res.json({
        success: true,
        message: "Swap accepted successfully",
        data: { swap },
      });
    } catch (error) {
      console.error("Error in acceptSwap:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Reject swap
  static async rejectSwap(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { swapId } = req.params;
      const { reason } = req.body;
      const userId = req.user.id;

      const swap = await SwapService.rejectSwap(swapId, userId, reason);

      if (!swap) {
        return res.status(404).json({
          success: false,
          message: "Swap not found or access denied",
        });
      }

      res.json({
        success: true,
        message: "Swap rejected successfully",
        data: { swap },
      });
    } catch (error) {
      console.error("Error in rejectSwap:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Cancel swap
  static async cancelSwap(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { swapId } = req.params;
      const { reason } = req.body;
      const userId = req.user.id;

      const swap = await SwapService.cancelSwap(swapId, userId, reason);

      if (!swap) {
        return res.status(404).json({
          success: false,
          message: "Swap not found or access denied",
        });
      }

      res.json({
        success: true,
        message: "Swap cancelled successfully",
        data: { swap },
      });
    } catch (error) {
      console.error("Error in cancelSwap:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Complete swap
  static async completeSwap(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { swapId } = req.params;
      const userId = req.user.id;

      const swap = await SwapService.completeSwap(swapId, userId);

      if (!swap) {
        return res.status(404).json({
          success: false,
          message: "Swap not found or access denied",
        });
      }

      res.json({
        success: true,
        message: "Swap completed successfully",
        data: { swap },
      });
    } catch (error) {
      console.error("Error in completeSwap:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Delete swap
  static async deleteSwap(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { swapId } = req.params;
      const userId = req.user.id;

      const swap = await SwapService.deleteSwap(swapId, userId);

      if (!swap) {
        return res.status(404).json({
          success: false,
          message: "Swap not found or access denied",
        });
      }

      res.json({
        success: true,
        message: "Swap deleted successfully",
        data: { swap },
      });
    } catch (error) {
      console.error("Error in deleteSwap:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get swap statistics
  static async getSwapStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await SwapService.getSwapStats(userId);

      res.json({
        success: true,
        message: "Swap statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      console.error("Error in getSwapStats:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = SwapController;
