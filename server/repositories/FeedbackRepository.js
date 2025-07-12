const Feedback = require("../models/Feedback");
const User = require("../models/User");
const Swap = require("../models/Swap");

class FeedbackRepository {
  // Create new feedback
  static async create(feedbackData) {
    try {
      const feedback = new Feedback(feedbackData);
      return await feedback.save();
    } catch (error) {
      throw new Error(`Error creating feedback: ${error.message}`);
    }
  }

  // Find feedback by ID with populated fields
  static async findById(feedbackId) {
    try {
      return await Feedback.findById(feedbackId)
        .populate(
          "reviewerId",
          "username firstName lastName email profilePicture"
        )
        .populate(
          "reviewedUserId",
          "username firstName lastName email profilePicture"
        )
        .populate("swapId", "title status")
        .exec();
    } catch (error) {
      throw new Error(`Error finding feedback: ${error.message}`);
    }
  }

  // Get user's feedback with pagination
  static async getUserFeedback(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const query = Feedback.find({
        $or: [{ reviewerId: userId }, { reviewedUserId: userId }],
      })
        .populate(
          "reviewerId",
          "username firstName lastName email profilePicture"
        )
        .populate(
          "reviewedUserId",
          "username firstName lastName email profilePicture"
        )
        .populate("swapId", "title status");

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
      query.sort(sortOptions);

      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);

      const [feedback, total] = await Promise.all([
        query.exec(),
        Feedback.countDocuments({
          $or: [{ reviewerId: userId }, { reviewedUserId: userId }],
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        feedback,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      throw new Error(`Error getting user feedback: ${error.message}`);
    }
  }

  // Get feedback for a specific user
  static async getFeedbackForUser(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const query = Feedback.find({ reviewedUserId: userId })
        .populate(
          "reviewerId",
          "username firstName lastName email profilePicture"
        )
        .populate("swapId", "title status");

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
      query.sort(sortOptions);

      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);

      const [feedback, total] = await Promise.all([
        query.exec(),
        Feedback.countDocuments({ reviewedUserId: userId }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        feedback,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      throw new Error(`Error getting feedback for user: ${error.message}`);
    }
  }

  // Get feedback for a specific swap
  static async getFeedbackForSwap(swapId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const query = Feedback.find({ swapId })
        .populate(
          "reviewerId",
          "username firstName lastName email profilePicture"
        )
        .populate(
          "reviewedUserId",
          "username firstName lastName email profilePicture"
        );

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
      query.sort(sortOptions);

      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);

      const [feedback, total] = await Promise.all([
        query.exec(),
        Feedback.countDocuments({ swapId }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        feedback,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      throw new Error(`Error getting feedback for swap: ${error.message}`);
    }
  }

  // Update feedback
  static async update(feedbackId, updateData, userId) {
    try {
      const feedback = await Feedback.findOneAndUpdate(
        {
          _id: feedbackId,
          reviewerId: userId,
        },
        updateData,
        { new: true, runValidators: true }
      )
        .populate(
          "reviewerId",
          "username firstName lastName email profilePicture"
        )
        .populate(
          "reviewedUserId",
          "username firstName lastName email profilePicture"
        )
        .populate("swapId", "title status");

      return feedback;
    } catch (error) {
      throw new Error(`Error updating feedback: ${error.message}`);
    }
  }

  // Delete feedback
  static async delete(feedbackId, userId) {
    try {
      const feedback = await Feedback.findOneAndDelete({
        _id: feedbackId,
        reviewerId: userId,
      })
        .populate(
          "reviewerId",
          "username firstName lastName email profilePicture"
        )
        .populate(
          "reviewedUserId",
          "username firstName lastName email profilePicture"
        )
        .populate("swapId", "title status");

      return feedback;
    } catch (error) {
      throw new Error(`Error deleting feedback: ${error.message}`);
    }
  }

  // Get feedback statistics for a user
  static async getFeedbackStats(userId) {
    try {
      const stats = await Feedback.aggregate([
        {
          $match: {
            $or: [{ reviewerId: userId }, { reviewedUserId: userId }],
          },
        },
        {
          $group: {
            _id: null,
            totalGiven: {
              $sum: {
                $cond: [{ $eq: ["$reviewerId", userId] }, 1, 0],
              },
            },
            totalReceived: {
              $sum: {
                $cond: [{ $eq: ["$reviewedUserId", userId] }, 1, 0],
              },
            },
            averageRating: {
              $avg: {
                $cond: [{ $eq: ["$reviewedUserId", userId] }, "$rating", null],
              },
            },
          },
        },
      ]);

      const totalFeedback = await Feedback.countDocuments({
        $or: [{ reviewerId: userId }, { reviewedUserId: userId }],
      });

      const givenFeedback = await Feedback.countDocuments({
        reviewerId: userId,
      });

      const receivedFeedback = await Feedback.countDocuments({
        reviewedUserId: userId,
      });

      const averageRating = await Feedback.aggregate([
        {
          $match: { reviewedUserId: userId },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      return {
        total: totalFeedback,
        given: givenFeedback,
        received: receivedFeedback,
        averageRating: averageRating[0]?.averageRating || 0,
        ...(stats[0] && {
          totalGiven: stats[0].totalGiven,
          totalReceived: stats[0].totalReceived,
        }),
      };
    } catch (error) {
      throw new Error(`Error getting feedback stats: ${error.message}`);
    }
  }

  // Check if user can leave feedback for a swap
  static async canLeaveFeedback(swapId, reviewerId, reviewedUserId) {
    try {
      // Check if swap exists and is completed
      const swap = await Swap.findById(swapId);
      if (!swap || swap.status !== "completed") {
        return false;
      }

      // Check if user is part of the swap
      if (
        swap.requesterId.toString() !== reviewerId &&
        swap.providerId.toString() !== reviewerId
      ) {
        return false;
      }

      // Check if feedback already exists
      const existingFeedback = await Feedback.findOne({
        swapId,
        reviewerId,
        reviewedUserId,
      });

      return !existingFeedback;
    } catch (error) {
      throw new Error(`Error checking feedback eligibility: ${error.message}`);
    }
  }

  // Get all feedback (Admin only)
  static async getAllFeedback(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const query = Feedback.find()
        .populate("reviewerId", "username firstName lastName email")
        .populate("reviewedUserId", "username firstName lastName email")
        .populate("swapId", "title status");

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
      query.sort(sortOptions);

      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);

      const [feedback, total] = await Promise.all([
        query.exec(),
        Feedback.countDocuments(),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        feedback,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      throw new Error(`Error getting all feedback: ${error.message}`);
    }
  }

  // Report feedback
  static async reportFeedback(feedbackId, reportData) {
    try {
      const feedback = await Feedback.findByIdAndUpdate(
        feedbackId,
        {
          $push: {
            reports: {
              reason: reportData.reason,
              description: reportData.description,
              reporterId: reportData.reporterId,
              reportedAt: new Date(),
            },
          },
        },
        { new: true, runValidators: true }
      )
        .populate(
          "reviewerId",
          "username firstName lastName email profilePicture"
        )
        .populate(
          "reviewedUserId",
          "username firstName lastName email profilePicture"
        )
        .populate("swapId", "title status");

      return feedback;
    } catch (error) {
      throw new Error(`Error reporting feedback: ${error.message}`);
    }
  }

  // Get reported feedback (Admin only)
  static async getReportedFeedback(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const query = Feedback.find({
        "reports.0": { $exists: true },
      })
        .populate("reviewerId", "username firstName lastName email")
        .populate("reviewedUserId", "username firstName lastName email")
        .populate("swapId", "title status");

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
      query.sort(sortOptions);

      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);

      const [feedback, total] = await Promise.all([
        query.exec(),
        Feedback.countDocuments({
          "reports.0": { $exists: true },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        feedback,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      throw new Error(`Error getting reported feedback: ${error.message}`);
    }
  }

  // Static methods for AdminService
  static async countAll() {
    try {
      return await Feedback.countDocuments();
    } catch (error) {
      throw new Error(`Error counting all feedback: ${error.message}`);
    }
  }

  static async countReported() {
    try {
      return await Feedback.countDocuments({
        "reports.0": { $exists: true },
      });
    } catch (error) {
      throw new Error(`Error counting reported feedback: ${error.message}`);
    }
  }

  static async getRecentFeedback(limit = 10) {
    try {
      return await Feedback.find()
        .populate("reviewerId", "username firstName lastName email")
        .populate("reviewedUserId", "username firstName lastName email")
        .populate("swapId", "title status")
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
    } catch (error) {
      throw new Error(`Error getting recent feedback: ${error.message}`);
    }
  }
}

module.exports = FeedbackRepository;
