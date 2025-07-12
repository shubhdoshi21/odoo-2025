const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    swapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Swap",
      required: [true, "Swap reference is required"],
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "From user is required"],
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "To user is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query optimization
feedbackSchema.index({ toUser: 1 });
feedbackSchema.index({ fromUser: 1 });
feedbackSchema.index({ swapId: 1 });
feedbackSchema.index({ rating: 1 });
feedbackSchema.index({ createdAt: -1 });

// Compound index to prevent duplicate feedback for same swap
feedbackSchema.index({ swapId: 1, fromUser: 1 }, { unique: true });

// Pre-save middleware to validate swap completion
feedbackSchema.pre("save", async function (next) {
  if (this.isNew) {
    const Swap = mongoose.model("Swap");
    const swap = await Swap.findById(this.swapId);

    if (!swap) {
      return next(new Error("Swap not found"));
    }

    if (swap.status !== "completed") {
      return next(new Error("Feedback can only be given for completed swaps"));
    }

    if (
      swap.requester.toString() !== this.fromUser.toString() &&
      swap.responder.toString() !== this.fromUser.toString()
    ) {
      return next(
        new Error("User can only give feedback for swaps they participated in")
      );
    }
  }
  next();
});

// Post-save middleware to update user's average rating
feedbackSchema.post("save", async function () {
  const User = mongoose.model("User");
  const user = await User.findById(this.toUser);

  if (user) {
    await user.updateAverageRating(this.rating);
  }
});

// Static method to get user's feedback
feedbackSchema.statics.getUserFeedback = function (userId, limit = 10) {
  return this.find({ toUser: userId, isPublic: true })
    .populate("fromUser", "name profilePhoto")
    .populate("swapId", "offeredSkill requestedSkill")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get average rating for a user
feedbackSchema.statics.getAverageRating = function (userId) {
  return this.aggregate([
    { $match: { toUser: mongoose.Types.ObjectId(userId), isPublic: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);
};

// Static method to get feedback for a specific swap
feedbackSchema.statics.getSwapFeedback = function (swapId) {
  return this.find({ swapId })
    .populate("fromUser", "name profilePhoto")
    .populate("toUser", "name profilePhoto")
    .sort({ createdAt: -1 });
};

// Method to check if user can give feedback
feedbackSchema.statics.canGiveFeedback = async function (swapId, userId) {
  const existingFeedback = await this.findOne({ swapId, fromUser: userId });
  return !existingFeedback;
};

module.exports = mongoose.model("Feedback", feedbackSchema);
