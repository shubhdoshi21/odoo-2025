const express = require("express");
const { body, query } = require("express-validator");
const SwapController = require("../controllers/SwapController");
const { protect } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validation");

const router = express.Router();

// Validation rules
const createSwapValidation = [
  body("responder").isMongoId().withMessage("Valid responder ID is required"),
  body("offeredSkill")
    .isMongoId()
    .withMessage("Valid offered skill ID is required"),
  body("requestedSkill")
    .isMongoId()
    .withMessage("Valid requested skill ID is required"),
  body("message")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Message cannot exceed 1000 characters"),
  body("scheduledDate")
    .optional()
    .isISO8601()
    .withMessage("Scheduled date must be a valid date"),
];

const updateSwapValidation = [
  body("message")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Message cannot exceed 1000 characters"),
  body("scheduledDate")
    .optional()
    .isISO8601()
    .withMessage("Scheduled date must be a valid date"),
];

const swapSearchValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
  query("status")
    .optional()
    .isIn(["pending", "accepted", "rejected", "cancelled", "completed"])
    .withMessage("Invalid status"),
];

// Routes
// GET /api/swaps - Get user's swaps
router.get(
  "/",
  protect,
  swapSearchValidation,
  handleValidationErrors,
  SwapController.getUserSwaps
);

// GET /api/swaps/pending - Get pending swaps for user
router.get("/pending", protect, SwapController.getPendingSwaps);

// GET /api/swaps/:id - Get swap by ID
router.get("/:id", protect, SwapController.getSwapById);

// POST /api/swaps - Create new swap
router.post(
  "/",
  protect,
  createSwapValidation,
  handleValidationErrors,
  SwapController.createSwap
);

// PUT /api/swaps/:id - Update swap
router.put(
  "/:id",
  protect,
  updateSwapValidation,
  handleValidationErrors,
  SwapController.updateSwap
);

// PATCH /api/swaps/:id/accept - Accept swap
router.patch("/:id/accept", protect, SwapController.acceptSwap);

// PATCH /api/swaps/:id/reject - Reject swap
router.patch("/:id/reject", protect, SwapController.rejectSwap);

// PATCH /api/swaps/:id/cancel - Cancel swap
router.patch("/:id/cancel", protect, SwapController.cancelSwap);

// PATCH /api/swaps/:id/complete - Complete swap
router.patch("/:id/complete", protect, SwapController.completeSwap);

// DELETE /api/swaps/:id - Delete swap
router.delete("/:id", protect, SwapController.deleteSwap);

module.exports = router;
