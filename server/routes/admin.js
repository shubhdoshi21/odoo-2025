const express = require("express");
const { body, query } = require("express-validator");
const AdminController = require("../controllers/AdminController");
const { protectAdmin, requireRole } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validation");

const router = express.Router();

// Validation rules
const adminLoginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const createAdminValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["superadmin", "moderator", "admin"])
    .withMessage("Invalid role"),
];

const createMessageValidation = [
  body("title")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Title must be between 2 and 200 characters"),
  body("message")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Message must be between 1 and 1000 characters"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Invalid priority"),
  body("targetAudience")
    .optional()
    .isIn(["all", "users", "admins"])
    .withMessage("Invalid target audience"),
];

const moderationActionValidation = [
  body("action")
    .isIn([
      "banned_user",
      "unbanned_user",
      "rejected_skill",
      "approved_skill",
      "deleted_swap",
      "warned_user",
      "suspended_user",
      "other",
    ])
    .withMessage("Invalid action"),
  body("description")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Description must be between 1 and 1000 characters"),
  body("severity")
    .optional()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Invalid severity"),
  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),
];

const adminSearchValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
];

// Routes
// POST /api/admin/login - Admin login
router.post(
  "/login",
  adminLoginValidation,
  handleValidationErrors,
  AdminController.login
);

// GET /api/admin/profile - Get admin profile
router.get("/profile", protectAdmin, AdminController.getProfile);

// GET /api/admin/dashboard - Get admin dashboard stats
router.get("/dashboard", protectAdmin, AdminController.getDashboardStats);

// GET /api/admin/users - Get all users (admin view)
router.get(
  "/users",
  protectAdmin,
  requireRole("moderator"),
  adminSearchValidation,
  handleValidationErrors,
  AdminController.getAllUsers
);

// GET /api/admin/users/:id - Get user by ID (admin view)
router.get(
  "/users/:id",
  protectAdmin,
  requireRole("moderator"),
  AdminController.getUserById
);

// PATCH /api/admin/users/:id/ban - Ban/unban user
router.patch(
  "/users/:id/ban",
  protectAdmin,
  requireRole("moderator"),
  AdminController.toggleUserBan
);

// GET /api/admin/swaps - Get all swaps (admin view)
router.get(
  "/swaps",
  protectAdmin,
  requireRole("moderator"),
  adminSearchValidation,
  handleValidationErrors,
  AdminController.getAllSwaps
);

// DELETE /api/admin/swaps/:id - Delete swap
router.delete(
  "/swaps/:id",
  protectAdmin,
  requireRole("moderator"),
  AdminController.deleteSwap
);

// GET /api/admin/feedback - Get all feedback (admin view)
router.get(
  "/feedback",
  protectAdmin,
  requireRole("moderator"),
  adminSearchValidation,
  handleValidationErrors,
  AdminController.getAllFeedback
);

// DELETE /api/admin/feedback/:id - Delete feedback
router.delete(
  "/feedback/:id",
  protectAdmin,
  requireRole("moderator"),
  AdminController.deleteFeedback
);

// GET /api/admin/messages - Get admin messages
router.get("/messages", protectAdmin, AdminController.getMessages);

// POST /api/admin/messages - Create admin message
router.post(
  "/messages",
  protectAdmin,
  requireRole("moderator"),
  createMessageValidation,
  handleValidationErrors,
  AdminController.createMessage
);

// PUT /api/admin/messages/:id - Update admin message
router.put(
  "/messages/:id",
  protectAdmin,
  requireRole("moderator"),
  createMessageValidation,
  handleValidationErrors,
  AdminController.updateMessage
);

// DELETE /api/admin/messages/:id - Delete admin message
router.delete(
  "/messages/:id",
  protectAdmin,
  requireRole("moderator"),
  AdminController.deleteMessage
);

// GET /api/admin/logs - Get moderation logs
router.get(
  "/logs",
  protectAdmin,
  requireRole("moderator"),
  adminSearchValidation,
  handleValidationErrors,
  AdminController.getModerationLogs
);

// POST /api/admin/logs - Create moderation log
router.post(
  "/logs",
  protectAdmin,
  requireRole("moderator"),
  moderationActionValidation,
  handleValidationErrors,
  AdminController.createModerationLog
);

// GET /api/admin/stats - Get detailed statistics
router.get(
  "/stats",
  protectAdmin,
  requireRole("moderator"),
  AdminController.getDetailedStats
);

// POST /api/admin/admins - Create new admin (superadmin only)
router.post(
  "/admins",
  protectAdmin,
  requireRole("superadmin"),
  createAdminValidation,
  handleValidationErrors,
  AdminController.createAdmin
);

// GET /api/admin/admins - Get all admins
router.get(
  "/admins",
  protectAdmin,
  requireRole("superadmin"),
  AdminController.getAllAdmins
);

// PATCH /api/admin/admins/:id - Update admin
router.patch(
  "/admins/:id",
  protectAdmin,
  requireRole("superadmin"),
  AdminController.updateAdmin
);

// DELETE /api/admin/admins/:id - Delete admin
router.delete(
  "/admins/:id",
  protectAdmin,
  requireRole("superadmin"),
  AdminController.deleteAdmin
);

module.exports = router;
