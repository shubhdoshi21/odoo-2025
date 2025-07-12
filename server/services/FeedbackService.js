const FeedbackRepository = require("../repositories/FeedbackRepository");
const UserRepository = require("../repositories/UserRepository");
const SwapRepository = require("../repositories/SwapRepository");

class FeedbackService {
  // Get user's feedback
  static async getUserFeedback(userId, options = {}) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const result = await FeedbackRepository.getUserFeedback(userId, options);
      return result;
    } catch (error) {
      throw new Error(`Error getting user feedback: ${error.message}`);
    }
  }

  // Get feedback for a specific user
  static async getFeedbackForUser(userId, options = {}) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      // Check if user exists
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const result = await FeedbackRepository.getFeedbackForUser(
        userId,
        options
      );
      return result;
    } catch (error) {
      throw new Error(`Error getting feedback for user: ${error.message}`);
    }
  }

  // Get feedback for a specific swap
  static async getFeedbackForSwap(swapId, options = {}) {
    try {
      if (!swapId) {
        throw new Error("Swap ID is required");
      }

      // Check if swap exists
      const swap = await SwapRepository.findById(swapId);
      if (!swap) {
        throw new Error("Swap not found");
      }

      const result = await FeedbackRepository.getFeedbackForSwap(
        swapId,
        options
      );
      return result;
    } catch (error) {
      throw new Error(`Error getting feedback for swap: ${error.message}`);
    }
  }

  // Get feedback by ID
  static async getFeedbackById(feedbackId) {
    try {
      if (!feedbackId) {
        throw new Error("Feedback ID is required");
      }

      const feedback = await FeedbackRepository.findById(feedbackId);
      return feedback;
    } catch (error) {
      throw new Error(`Error getting feedback by ID: ${error.message}`);
    }
  }

  // Create new feedback
  static async createFeedback(feedbackData) {
    try {
      // Validate required fields
      if (
        !feedbackData.reviewerId ||
        !feedbackData.reviewedUserId ||
        !feedbackData.swapId ||
        !feedbackData.rating
      ) {
        throw new Error(
          "Reviewer, reviewed user, swap, and rating are required"
        );
      }

      // Check if reviewer and reviewed user are different
      if (feedbackData.reviewerId === feedbackData.reviewedUserId) {
        throw new Error("Reviewer and reviewed user cannot be the same");
      }

      // Check if reviewer exists
      const reviewer = await UserRepository.findById(feedbackData.reviewerId);
      if (!reviewer) {
        throw new Error("Reviewer not found");
      }

      // Check if reviewed user exists
      const reviewedUser = await UserRepository.findById(
        feedbackData.reviewedUserId
      );
      if (!reviewedUser) {
        throw new Error("Reviewed user not found");
      }

      // Check if swap exists
      const swap = await SwapRepository.findById(feedbackData.swapId);
      if (!swap) {
        throw new Error("Swap not found");
      }

      // Check if user can leave feedback for this swap
      const canLeaveFeedback = await FeedbackRepository.canLeaveFeedback(
        feedbackData.swapId,
        feedbackData.reviewerId,
        feedbackData.reviewedUserId
      );

      if (!canLeaveFeedback) {
        throw new Error("Cannot leave feedback for this swap");
      }

      // Validate rating
      if (feedbackData.rating < 1 || feedbackData.rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      const feedback = await FeedbackRepository.create(feedbackData);

      // Update user's average rating
      await this.updateUserRating(feedbackData.reviewedUserId);

      return feedback;
    } catch (error) {
      throw new Error(`Error creating feedback: ${error.message}`);
    }
  }

  // Update feedback
  static async updateFeedback(feedbackId, updateData, userId) {
    try {
      if (!feedbackId) {
        throw new Error("Feedback ID is required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      // Check if feedback exists and user has access
      const existingFeedback = await FeedbackRepository.findById(feedbackId);
      if (!existingFeedback) {
        throw new Error("Feedback not found");
      }

      if (existingFeedback.reviewerId._id.toString() !== userId) {
        throw new Error("Access denied");
      }

      // Validate rating if being updated
      if (
        updateData.rating &&
        (updateData.rating < 1 || updateData.rating > 5)
      ) {
        throw new Error("Rating must be between 1 and 5");
      }

      const feedback = await FeedbackRepository.update(
        feedbackId,
        updateData,
        userId
      );

      // Update user's average rating if rating was changed
      if (updateData.rating) {
        await this.updateUserRating(existingFeedback.reviewedUserId._id);
      }

      return feedback;
    } catch (error) {
      throw new Error(`Error updating feedback: ${error.message}`);
    }
  }

  // Delete feedback
  static async deleteFeedback(feedbackId, userId) {
    try {
      if (!feedbackId) {
        throw new Error("Feedback ID is required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      // Check if feedback exists and user has access
      const existingFeedback = await FeedbackRepository.findById(feedbackId);
      if (!existingFeedback) {
        throw new Error("Feedback not found");
      }

      if (existingFeedback.reviewerId._id.toString() !== userId) {
        throw new Error("Access denied");
      }

      const feedback = await FeedbackRepository.delete(feedbackId, userId);

      // Update user's average rating
      await this.updateUserRating(existingFeedback.reviewedUserId._id);

      return feedback;
    } catch (error) {
      throw new Error(`Error deleting feedback: ${error.message}`);
    }
  }

  // Get feedback statistics
  static async getFeedbackStats(userId) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const stats = await FeedbackRepository.getFeedbackStats(userId);
      return stats;
    } catch (error) {
      throw new Error(`Error getting feedback statistics: ${error.message}`);
    }
  }

  // Report feedback
  static async reportFeedback(feedbackId, reportData) {
    try {
      if (!feedbackId) {
        throw new Error("Feedback ID is required");
      }

      if (
        !reportData.reason ||
        !reportData.description ||
        !reportData.reporterId
      ) {
        throw new Error("Reason, description, and reporter ID are required");
      }

      // Check if feedback exists
      const feedback = await FeedbackRepository.findById(feedbackId);
      if (!feedback) {
        throw new Error("Feedback not found");
      }

      // Check if reporter exists
      const reporter = await UserRepository.findById(reportData.reporterId);
      if (!reporter) {
        throw new Error("Reporter not found");
      }

      // Check if user has already reported this feedback
      const existingReport = feedback.reports.find(
        (report) => report.reporterId.toString() === reportData.reporterId
      );

      if (existingReport) {
        throw new Error("User has already reported this feedback");
      }

      const updatedFeedback = await FeedbackRepository.reportFeedback(
        feedbackId,
        reportData
      );
      return updatedFeedback;
    } catch (error) {
      throw new Error(`Error reporting feedback: ${error.message}`);
    }
  }

  // Get all feedback (Admin only)
  static async getAllFeedback(options = {}) {
    try {
      const result = await FeedbackRepository.getAllFeedback(options);
      return result;
    } catch (error) {
      throw new Error(`Error getting all feedback: ${error.message}`);
    }
  }

  // Get reported feedback (Admin only)
  static async getReportedFeedback(options = {}) {
    try {
      const result = await FeedbackRepository.getReportedFeedback(options);
      return result;
    } catch (error) {
      throw new Error(`Error getting reported feedback: ${error.message}`);
    }
  }

  // Update user's average rating
  static async updateUserRating(userId) {
    try {
      const stats = await FeedbackRepository.getFeedbackStats(userId);
      const averageRating = Math.round(stats.averageRating * 10) / 10; // Round to 1 decimal place

      await UserRepository.update(userId, { rating: averageRating });
    } catch (error) {
      console.error(`Error updating user rating: ${error.message}`);
    }
  }

  // Get feedback summary for user
  static async getFeedbackSummary(userId) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const stats = await FeedbackRepository.getFeedbackStats(userId);

      // Get recent feedback
      const recentFeedback = await FeedbackRepository.getFeedbackForUser(
        userId,
        {
          page: 1,
          limit: 5,
          sortBy: "createdAt",
          sortOrder: "desc",
        }
      );

      return {
        stats,
        recentFeedback: recentFeedback.feedback,
      };
    } catch (error) {
      throw new Error(`Error getting feedback summary: ${error.message}`);
    }
  }

  // Get feedback by rating
  static async getFeedbackByRating(userId, rating, options = {}) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      if (!rating || rating < 1 || rating > 5) {
        throw new Error("Valid rating (1-5) is required");
      }

      const result = await FeedbackRepository.getFeedbackByRating(
        userId,
        rating,
        options
      );
      return result;
    } catch (error) {
      throw new Error(`Error getting feedback by rating: ${error.message}`);
    }
  }

  // Get feedback trends
  static async getFeedbackTrends(userId, days = 30) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const trends = await FeedbackRepository.getFeedbackTrends(userId, days);
      return trends;
    } catch (error) {
      throw new Error(`Error getting feedback trends: ${error.message}`);
    }
  }
}

module.exports = FeedbackService;
