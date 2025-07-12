const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Requester is required"],
    },
    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Responder is required"],
    },
    offeredSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: [true, "Offered skill is required"],
    },
    requestedSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: [true, "Requested skill is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    scheduledDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    isRated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query optimization
swapSchema.index({ requester: 1 });
swapSchema.index({ responder: 1 });
swapSchema.index({ status: 1 });
swapSchema.index({ requester: 1, status: 1 });
swapSchema.index({ responder: 1, status: 1 });
swapSchema.index({ createdAt: -1 });

// Virtual for checking if swap is active
swapSchema.virtual("isActive").get(function () {
  return ["pending", "accepted"].includes(this.status);
});

// Pre-save middleware to update completedAt
swapSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "completed" &&
    !this.completedAt
  ) {
    this.completedAt = new Date();
  }
  next();
});

// Static method to get user's swaps
swapSchema.statics.getUserSwaps = function (userId, status = null) {
  const query = {
    $or: [{ requester: userId }, { responder: userId }],
  };

  if (status) {
    query.status = status;
  }

  return this.find(query)
    .populate("requester", "name email profilePhoto")
    .populate("responder", "name email profilePhoto")
    .populate("offeredSkill", "name category")
    .populate("requestedSkill", "name category")
    .sort({ createdAt: -1 });
};

// Static method to get pending swaps for a user
swapSchema.statics.getPendingSwaps = function (userId) {
  return this.find({
    responder: userId,
    status: "pending",
  })
    .populate("requester", "name email profilePhoto averageRating")
    .populate("offeredSkill", "name category")
    .populate("requestedSkill", "name category")
    .sort({ createdAt: -1 });
};

// Static method to check if users have existing swap
swapSchema.statics.checkExistingSwap = function (user1Id, user2Id) {
  return this.findOne({
    $or: [
      { requester: user1Id, responder: user2Id },
      { requester: user2Id, responder: user1Id },
    ],
    status: { $in: ["pending", "accepted"] },
  });
};

// Method to accept swap
swapSchema.methods.accept = function () {
  if (this.status !== "pending") {
    throw new Error("Only pending swaps can be accepted");
  }
  this.status = "accepted";
  return this.save();
};

// Method to reject swap
swapSchema.methods.reject = function () {
  if (this.status !== "pending") {
    throw new Error("Only pending swaps can be rejected");
  }
  this.status = "rejected";
  return this.save();
};

// Method to cancel swap
swapSchema.methods.cancel = function () {
  if (!["pending", "accepted"].includes(this.status)) {
    throw new Error("Only pending or accepted swaps can be cancelled");
  }
  this.status = "cancelled";
  return this.save();
};

// Method to complete swap
swapSchema.methods.complete = function () {
  if (this.status !== "accepted") {
    throw new Error("Only accepted swaps can be completed");
  }
  this.status = "completed";
  this.completedAt = new Date();
  return this.save();
};

module.exports = mongoose.model("Swap", swapSchema);
