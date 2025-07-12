const mongoose = require("mongoose");

const adminMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Admin reference is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    targetAudience: {
      type: String,
      enum: ["all", "users", "admins"],
      default: "all",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
adminMessageSchema.index({ isActive: 1 });
adminMessageSchema.index({ priority: 1 });
adminMessageSchema.index({ targetAudience: 1 });
adminMessageSchema.index({ createdAt: -1 });

// Static method to get active messages
adminMessageSchema.statics.getActiveMessages = function (
  targetAudience = "all"
) {
  const query = { isActive: true };

  if (targetAudience !== "all") {
    query.targetAudience = { $in: ["all", targetAudience] };
  }

  return this.find(query)
    .populate("sentBy", "name role")
    .sort({ priority: -1, createdAt: -1 });
};

// Static method to get urgent messages
adminMessageSchema.statics.getUrgentMessages = function () {
  return this.find({
    isActive: true,
    priority: "urgent",
  })
    .populate("sentBy", "name role")
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model("AdminMessage", adminMessageSchema);
