const express = require("express");
const { query, body } = require("express-validator");
const SkillController = require("../controllers/SkillController");
const { protect, protectAdmin, requireRole } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validation");

const router = express.Router();

// Validation rules
const skillSearchValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
  query("category")
    .optional()
    .isIn([
      "Technology",
      "Creative",
      "Language",
      "Business",
      "Health",
      "Education",
      "Other",
    ])
    .withMessage("Invalid category"),
];

const createSkillValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Skill name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("category")
    .optional()
    .isIn([
      "Technology",
      "Creative",
      "Language",
      "Business",
      "Health",
      "Education",
      "Other",
    ])
    .withMessage("Invalid category"),
];

const updateSkillValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Skill name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("category")
    .optional()
    .isIn([
      "Technology",
      "Creative",
      "Language",
      "Business",
      "Health",
      "Education",
      "Other",
    ])
    .withMessage("Invalid category"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

// Routes
// GET /api/skills - Get all skills
router.get(
  "/",
  skillSearchValidation,
  handleValidationErrors,
  SkillController.getAllSkills
);

// GET /api/skills/search - Search skills
router.get("/search", SkillController.searchSkills);

// GET /api/skills/popular - Get popular skills
router.get("/popular", SkillController.getPopularSkills);

// GET /api/skills/category/:category - Get skills by category
router.get("/category/:category", SkillController.getSkillsByCategory);

// GET /api/skills/:id - Get skill by ID
router.get("/:id", SkillController.getSkillById);

// POST /api/skills - Create new skill (admin only)
router.post(
  "/",
  protectAdmin,
  requireRole("moderator"),
  createSkillValidation,
  handleValidationErrors,
  SkillController.createSkill
);

// PUT /api/skills/:id - Update skill (admin only)
router.put(
  "/:id",
  protectAdmin,
  requireRole("moderator"),
  updateSkillValidation,
  handleValidationErrors,
  SkillController.updateSkill
);

// DELETE /api/skills/:id - Delete skill (admin only)
router.delete(
  "/:id",
  protectAdmin,
  requireRole("moderator"),
  SkillController.deleteSkill
);

// PATCH /api/skills/:id/toggle - Toggle skill active status (admin only)
// router.patch(
//   "/:id/toggle",
//   protectAdmin,
//   requireRole("moderator"),
//   SkillController.toggleSkillActive
// );

module.exports = router;
