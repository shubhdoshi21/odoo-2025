const AdminService = require("../services/AdminService");
const { validationResult } = require("express-validator");

class AdminController {
  // Get admin dashboard statistics
  static async getDashboardStats(req, res) {
    try {
      const stats = await AdminService.getDashboardStats();

      res.json({
        success: true,
        message: "Dashboard statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      console.error("Error in getDashboardStats:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get all users (Admin only)
  static async getAllUsers(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const {
        page = 1,
        limit = 10,
        search,
        status,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const result = await AdminService.getAllUsers({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        status,
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        message: "Users retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get user by ID (Admin only)
  static async getUserById(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { userId } = req.params;

      const user = await AdminService.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User retrieved successfully",
        data: { user },
      });
    } catch (error) {
      console.error("Error in getUserById:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update user (Admin only)
  static async updateUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { userId } = req.params;
      const updateData = req.body;

      const user = await AdminService.updateUser(userId, updateData);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User updated successfully",
        data: { user },
      });
    } catch (error) {
      console.error("Error in updateUser:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Delete user (Admin only)
  static async deleteUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { userId } = req.params;

      const user = await AdminService.deleteUser(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User deleted successfully",
        data: { user },
      });
    } catch (error) {
      console.error("Error in deleteUser:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Ban user (Admin only)
  static async banUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { userId } = req.params;
      const { reason, duration } = req.body;

      const user = await AdminService.banUser(userId, { reason, duration });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User banned successfully",
        data: { user },
      });
    } catch (error) {
      console.error("Error in banUser:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Unban user (Admin only)
  static async unbanUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { userId } = req.params;

      const user = await AdminService.unbanUser(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User unbanned successfully",
        data: { user },
      });
    } catch (error) {
      console.error("Error in unbanUser:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get all swaps (Admin only)
  static async getAllSwaps(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const {
        page = 1,
        limit = 10,
        status,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const result = await AdminService.getAllSwaps({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        message: "Swaps retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getAllSwaps:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get swap by ID (Admin only)
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

      const swap = await AdminService.getSwapById(swapId);

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

  // Delete swap (Admin only)
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

      const swap = await AdminService.deleteSwap(swapId);

      if (!swap) {
        return res.status(404).json({
          success: false,
          message: "Swap not found",
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

  // Get all feedback (Admin only)
  static async getAllFeedback(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const result = await AdminService.getAllFeedback({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        message: "Feedback retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getAllFeedback:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get reported feedback (Admin only)
  static async getReportedFeedback(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const result = await AdminService.getReportedFeedback({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        message: "Reported feedback retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getReportedFeedback:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Delete feedback (Admin only)
  static async deleteFeedback(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { feedbackId } = req.params;

      const feedback = await AdminService.deleteFeedback(feedbackId);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: "Feedback not found",
        });
      }

      res.json({
        success: true,
        message: "Feedback deleted successfully",
        data: { feedback },
      });
    } catch (error) {
      console.error("Error in deleteFeedback:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get moderation logs (Admin only)
  static async getModerationLogs(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const {
        page = 1,
        limit = 10,
        action,
        adminId,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const result = await AdminService.getModerationLogs({
        page: parseInt(page),
        limit: parseInt(limit),
        action,
        adminId,
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        message: "Moderation logs retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getModerationLogs:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Send admin message (Admin only)
  static async sendAdminMessage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { recipientId, subject, message, type = "notification" } = req.body;
      const adminId = req.user.id;

      const adminMessage = await AdminService.sendAdminMessage({
        adminId,
        recipientId,
        subject,
        message,
        type,
      });

      res.status(201).json({
        success: true,
        message: "Admin message sent successfully",
        data: { adminMessage },
      });
    } catch (error) {
      console.error("Error in sendAdminMessage:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get admin messages (Admin only)
  static async getAdminMessages(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const {
        page = 1,
        limit = 10,
        recipientId,
        type,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const result = await AdminService.getAdminMessages({
        page: parseInt(page),
        limit: parseInt(limit),
        recipientId,
        type,
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        message: "Admin messages retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getAdminMessages:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = AdminController;
