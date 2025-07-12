const FeedbackService = require("../services/FeedbackService");
const { validationResult } = require("express-validator");

class FeedbackController {
  // Get user's feedback
  static async getUserFeedback(req, res) {
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
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const result = await FeedbackService.getUserFeedback(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        message: "User feedback retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getUserFeedback:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get feedback for a specific user
  static async getFeedbackForUser(req, res) {
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
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const result = await FeedbackService.getFeedbackForUser(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        message: "Feedback for user retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getFeedbackForUser:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get feedback for a specific swap
  static async getFeedbackForSwap(req, res) {
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
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const result = await FeedbackService.getFeedbackForSwap(swapId, {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        message: "Feedback for swap retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getFeedbackForSwap:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get feedback by ID
  static async getFeedbackById(req, res) {
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

      const feedback = await FeedbackService.getFeedbackById(feedbackId);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: "Feedback not found",
        });
      }

      res.json({
        success: true,
        message: "Feedback retrieved successfully",
        data: { feedback },
      });
    } catch (error) {
      console.error("Error in getFeedbackById:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Create new feedback
  static async createFeedback(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const feedbackData = {
        ...req.body,
        reviewerId: req.user.id,
      };

      const feedback = await FeedbackService.createFeedback(feedbackData);

      res.status(201).json({
        success: true,
        message: "Feedback created successfully",
        data: { feedback },
      });
    } catch (error) {
      console.error("Error in createFeedback:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update feedback
  static async updateFeedback(req, res) {
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
      const updateData = req.body;
      const userId = req.user.id;

      const feedback = await FeedbackService.updateFeedback(
        feedbackId,
        updateData,
        userId
      );

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: "Feedback not found or access denied",
        });
      }

      res.json({
        success: true,
        message: "Feedback updated successfully",
        data: { feedback },
      });
    } catch (error) {
      console.error("Error in updateFeedback:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Delete feedback
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
      const userId = req.user.id;

      const feedback = await FeedbackService.deleteFeedback(feedbackId, userId);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: "Feedback not found or access denied",
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

  // Get feedback statistics
  static async getFeedbackStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await FeedbackService.getFeedbackStats(userId);

      res.json({
        success: true,
        message: "Feedback statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      console.error("Error in getFeedbackStats:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Report feedback (Admin only)
  static async reportFeedback(req, res) {
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
      const { reason, description } = req.body;
      const reporterId = req.user.id;

      const report = await FeedbackService.reportFeedback(feedbackId, {
        reason,
        description,
        reporterId,
      });

      res.json({
        success: true,
        message: "Feedback reported successfully",
        data: { report },
      });
    } catch (error) {
      console.error("Error in reportFeedback:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = FeedbackController;
