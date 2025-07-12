const express = require("express");
const { body, query } = require("express-validator");
const FeedbackController = require("../controllers/FeedbackController");
const { protect } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validation");

const router = express.Router();

// Validation rules
const createFeedbackValidation = [
  body("swapId").isMongoId().withMessage("Valid swap ID is required"),
  body("toUser").isMongoId().withMessage("Valid user ID is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Comment cannot exceed 500 characters"),
];

const updateFeedbackValidation = [
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Comment cannot exceed 500 characters"),
];

const feedbackSearchValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
  query("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

// Routes
// GET /api/feedback - Get user's feedback
router.get(
  "/",
  protect,
  feedbackSearchValidation,
  handleValidationErrors,
  FeedbackController.getUserFeedback
);

// GET /api/feedback/user/:userId - Get feedback for a specific user
router.get("/user/:userId", FeedbackController.getFeedbackForUser);

// GET /api/feedback/swap/:swapId - Get feedback for a specific swap
router.get("/swap/:swapId", protect, FeedbackController.getFeedbackForSwap);

// GET /api/feedback/:id - Get feedback by ID
router.get("/:id", FeedbackController.getFeedbackById);

// POST /api/feedback - Create new feedback
router.post(
  "/",
  protect,
  createFeedbackValidation,
  handleValidationErrors,
  FeedbackController.createFeedback
);

// PUT /api/feedback/:id - Update feedback
router.put(
  "/:id",
  protect,
  updateFeedbackValidation,
  handleValidationErrors,
  FeedbackController.updateFeedback
);

// DELETE /api/feedback/:id - Delete feedback
router.delete("/:id", protect, FeedbackController.deleteFeedback);

module.exports = router;
