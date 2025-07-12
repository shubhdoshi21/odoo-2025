const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't include password in queries by default
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    availability: [
      {
        type: String,
        enum: [
          "Weekdays",
          "Weekends",
          "Evenings",
          "Mornings",
          "Afternoons",
          "Flexible",
        ],
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    offeredSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    wantedSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full profile URL
userSchema.virtual("profilePhotoUrl").get(function () {
  if (!this.profilePhoto) return null;
  return `${
    process.env.BASE_URL || "http://localhost:3001"
  }/uploads/${this.profilePhoto}`;
});

// Indexes for search optimization
userSchema.index({ isPublic: 1 });
userSchema.index({ isBanned: 1 });
userSchema.index({ offeredSkills: 1 });
userSchema.index({ wantedSkills: 1 });
userSchema.index({ email: 1 });

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update average rating
userSchema.methods.updateAverageRating = function (newRating) {
  this.totalRatings += 1;
  this.averageRating =
    (this.averageRating * (this.totalRatings - 1) + newRating) /
    this.totalRatings;
  return this.save();
};

// Static method to find users by skill
userSchema.statics.findBySkill = function (skillId, type = "offered") {
  const query =
    type === "offered" ? { offeredSkills: skillId } : { wantedSkills: skillId };
  return this.find({ ...query, isPublic: true, isBanned: false })
    .populate("offeredSkills", "name")
    .populate("wantedSkills", "name")
    .select("-password");
};

module.exports = mongoose.model("User", userSchema);
