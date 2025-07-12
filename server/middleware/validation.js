const { validationResult } = require("express-validator");

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }

  next();
};

// Custom validation for ObjectId
const isValidObjectId = (value) => {
  return /^[0-9a-fA-F]{24}$/.test(value);
};

// Custom validation for email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Custom validation for password strength
const isStrongPassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

// Custom validation for rating
const isValidRating = (rating) => {
  const num = Number(rating);
  return !isNaN(num) && num >= 1 && num <= 5;
};

// Custom validation for availability
const isValidAvailability = (availability) => {
  const validOptions = [
    "Weekdays",
    "Weekends",
    "Evenings",
    "Mornings",
    "Afternoons",
    "Flexible",
  ];
  if (Array.isArray(availability)) {
    return availability.every((item) => validOptions.includes(item));
  }
  return false;
};

// Custom validation for skill category
const isValidSkillCategory = (category) => {
  const validCategories = [
    "Technology",
    "Creative",
    "Language",
    "Business",
    "Health",
    "Education",
    "Other",
  ];
  return validCategories.includes(category);
};

// Custom validation for swap status
const isValidSwapStatus = (status) => {
  const validStatuses = [
    "pending",
    "accepted",
    "rejected",
    "cancelled",
    "completed",
  ];
  return validStatuses.includes(status);
};

// Custom validation for admin role
const isValidAdminRole = (role) => {
  const validRoles = ["superadmin", "moderator", "admin"];
  return validRoles.includes(role);
};

// Custom validation for message priority
const isValidPriority = (priority) => {
  const validPriorities = ["low", "medium", "high", "urgent"];
  return validPriorities.includes(priority);
};

// Custom validation for moderation action
const isValidModerationAction = (action) => {
  const validActions = [
    "banned_user",
    "unbanned_user",
    "rejected_skill",
    "approved_skill",
    "deleted_swap",
    "warned_user",
    "suspended_user",
    "other",
  ];
  return validActions.includes(action);
};

// Custom validation for severity
const isValidSeverity = (severity) => {
  const validSeverities = ["low", "medium", "high", "critical"];
  return validSeverities.includes(severity);
};

module.exports = {
  handleValidationErrors,
  isValidObjectId,
  isValidEmail,
  isStrongPassword,
  isValidRating,
  isValidAvailability,
  isValidSkillCategory,
  isValidSwapStatus,
  isValidAdminRole,
  isValidPriority,
  isValidModerationAction,
  isValidSeverity,
};
