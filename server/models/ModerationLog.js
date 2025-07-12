const mongoose = require("mongoose");

const moderationLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Admin reference is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
    swapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Swap",
    },
    action: {
      type: String,
      required: [true, "Action is required"],
      enum: [
        "banned_user",
        "unbanned_user",
        "rejected_skill",
        "approved_skill",
        "deleted_swap",
        "warned_user",
        "suspended_user",
        "other",
      ],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    duration: {
      type: Number, // Duration in days for temporary actions
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
moderationLogSchema.index({ adminId: 1 });
moderationLogSchema.index({ userId: 1 });
moderationLogSchema.index({ action: 1 });
moderationLogSchema.index({ severity: 1 });
moderationLogSchema.index({ createdAt: -1 });

// Static method to get logs for a specific user
moderationLogSchema.statics.getUserLogs = function (userId, limit = 20) {
  return this.find({ userId })
    .populate("adminId", "name role")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get logs by admin
moderationLogSchema.statics.getAdminLogs = function (adminId, limit = 50) {
  return this.find({ adminId })
    .populate("userId", "name email")
    .populate("skillId", "name")
    .populate("swapId", "requester responder")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get recent critical actions
moderationLogSchema.statics.getCriticalActions = function (limit = 10) {
  return this.find({ severity: "critical" })
    .populate("adminId", "name role")
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get moderation statistics
moderationLogSchema.statics.getModerationStats = function (startDate, endDate) {
  const matchStage = {};
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$action",
        count: { $sum: 1 },
        severity: { $push: "$severity" },
      },
    },
    {
      $project: {
        action: "$_id",
        count: 1,
        criticalCount: {
          $size: {
            $filter: {
              input: "$severity",
              cond: { $eq: ["$$this", "critical"] },
            },
          },
        },
      },
    },
  ]);
};

module.exports = mongoose.model("ModerationLog", moderationLogSchema);
