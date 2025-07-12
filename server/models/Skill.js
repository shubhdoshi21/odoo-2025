const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Skill name cannot exceed 100 characters"],
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      enum: [
        "Technology",
        "Creative",
        "Language",
        "Business",
        "Health",
        "Education",
        "Other",
      ],
      default: "Other",
    },
    createdByAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search optimization
skillSchema.index({ name: 1 });
skillSchema.index({ name: "text" }); // Text index for search
skillSchema.index({ category: 1 });
skillSchema.index({ isActive: 1 });

// Pre-save middleware to normalize name
skillSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name.toLowerCase().trim();
  }
  next();
});

// Static method to search skills
skillSchema.statics.searchSkills = function (query, limit = 10) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
    ],
  })
    .sort({ usageCount: -1, name: 1 })
    .limit(limit);
};

// Static method to get popular skills
skillSchema.statics.getPopularSkills = function (limit = 10) {
  return this.find({ isActive: true }).sort({ usageCount: -1 }).limit(limit);
};

// Method to increment usage count
skillSchema.methods.incrementUsage = function () {
  this.usageCount += 1;
  return this.save();
};

module.exports = mongoose.model("Skill", skillSchema);
