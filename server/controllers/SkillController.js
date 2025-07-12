const SkillService = require("../services/SkillService");
const { validationResult } = require("express-validator");

class SkillController {
  // Get all skills with pagination and filters
  static async getAllSkills(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const {
        page = 1,
        limit = 10,
        category,
        search,
        sortBy = "name",
        sortOrder = "asc",
      } = req.query;

      const result = await SkillService.getAllSkills({
        page: parseInt(page),
        limit: parseInt(limit),
        category,
        search,
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        message: "Skills retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getAllSkills:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Search skills
  static async searchSkills(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { q: query, limit = 10 } = req.query;

      if (!query || query.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const skills = await SkillService.searchSkills(
        query.trim(),
        parseInt(limit)
      );

      res.json({
        success: true,
        message: "Skills search completed",
        data: { skills },
      });
    } catch (error) {
      console.error("Error in searchSkills:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get popular skills
  static async getPopularSkills(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { limit = 10 } = req.query;

      const skills = await SkillService.getPopularSkills(parseInt(limit));

      res.json({
        success: true,
        message: "Popular skills retrieved successfully",
        data: { skills },
      });
    } catch (error) {
      console.error("Error in getPopularSkills:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get skills by category
  static async getSkillsByCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { category } = req.params;
      const {
        page = 1,
        limit = 10,
        sortBy = "name",
        sortOrder = "asc",
      } = req.query;

      const result = await SkillService.getSkillsByCategory(category, {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        message: "Skills by category retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getSkillsByCategory:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get skill by ID
  static async getSkillById(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { id } = req.params;

      const skill = await SkillService.getSkillById(id);

      if (!skill) {
        return res.status(404).json({
          success: false,
          message: "Skill not found",
        });
      }

      res.json({
        success: true,
        message: "Skill retrieved successfully",
        data: { skill },
      });
    } catch (error) {
      console.error("Error in getSkillById:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Create new skill (Admin only)
  static async createSkill(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const skillData = req.body;
      const skill = await SkillService.createSkill(skillData);

      res.status(201).json({
        success: true,
        message: "Skill created successfully",
        data: { skill },
      });
    } catch (error) {
      console.error("Error in createSkill:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update skill (Admin only)
  static async updateSkill(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const updateData = req.body;

      const skill = await SkillService.updateSkill(id, updateData);

      if (!skill) {
        return res.status(404).json({
          success: false,
          message: "Skill not found",
        });
      }

      res.json({
        success: true,
        message: "Skill updated successfully",
        data: { skill },
      });
    } catch (error) {
      console.error("Error in updateSkill:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Delete skill (Admin only)
  static async deleteSkill(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { id } = req.params;

      const skill = await SkillService.deleteSkill(id);

      if (!skill) {
        return res.status(404).json({
          success: false,
          message: "Skill not found",
        });
      }

      res.json({
        success: true,
        message: "Skill deleted successfully",
        data: { skill },
      });
    } catch (error) {
      console.error("Error in deleteSkill:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get skill statistics
  static async getSkillStats(req, res) {
    try {
      const stats = await SkillService.getSkillStats();

      res.json({
        success: true,
        message: "Skill statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      console.error("Error in getSkillStats:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = SkillController;
