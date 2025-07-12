const SkillRepository = require("../repositories/SkillRepository");
const UserRepository = require("../repositories/UserRepository");

class SkillService {
  // Get all skills with pagination and filters
  static async getAllSkills(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        search,
        sortBy = "name",
        sortOrder = "asc",
      } = options;

      const filters = {};
      if (category) {
        filters.category = category;
      }
      if (search) {
        filters.$text = { $search: search };
      }

      const result = await SkillRepository.getAllSkills({
        page,
        limit,
        filters,
        sortBy,
        sortOrder,
      });

      return result;
    } catch (error) {
      throw new Error(`Error getting all skills: ${error.message}`);
    }
  }

  // Search skills
  static async searchSkills(query, limit = 10) {
    try {
      if (!query || query.trim().length === 0) {
        throw new Error("Search query is required");
      }

      const skills = await SkillRepository.searchSkills(query.trim(), limit);
      return skills;
    } catch (error) {
      throw new Error(`Error searching skills: ${error.message}`);
    }
  }

  // Get popular skills
  static async getPopularSkills(limit = 10) {
    try {
      const skills = await SkillRepository.getPopularSkills(limit);
      return skills;
    } catch (error) {
      throw new Error(`Error getting popular skills: ${error.message}`);
    }
  }

  // Get skills by category
  static async getSkillsByCategory(category, options = {}) {
    try {
      if (!category) {
        throw new Error("Category is required");
      }

      const result = await SkillRepository.getSkillsByCategory(
        category,
        options
      );
      return result;
    } catch (error) {
      throw new Error(`Error getting skills by category: ${error.message}`);
    }
  }

  // Get skill by ID
  static async getSkillById(skillId) {
    try {
      if (!skillId) {
        throw new Error("Skill ID is required");
      }

      const skill = await SkillRepository.findById(skillId);
      return skill;
    } catch (error) {
      throw new Error(`Error getting skill by ID: ${error.message}`);
    }
  }

  // Create new skill
  static async createSkill(skillData) {
    try {
      // Validate required fields
      if (!skillData.name || !skillData.category) {
        throw new Error("Name and category are required");
      }

      // Check if skill already exists
      const existingSkill = await SkillRepository.findByName(skillData.name);
      if (existingSkill) {
        throw new Error("Skill with this name already exists");
      }

      const skill = await SkillRepository.create(skillData);
      return skill;
    } catch (error) {
      throw new Error(`Error creating skill: ${error.message}`);
    }
  }

  // Update skill
  static async updateSkill(skillId, updateData) {
    try {
      if (!skillId) {
        throw new Error("Skill ID is required");
      }

      // Check if skill exists
      const existingSkill = await SkillRepository.findById(skillId);
      if (!existingSkill) {
        throw new Error("Skill not found");
      }

      // If name is being updated, check for duplicates
      if (updateData.name && updateData.name !== existingSkill.name) {
        const duplicateSkill = await SkillRepository.findByName(
          updateData.name
        );
        if (duplicateSkill) {
          throw new Error("Skill with this name already exists");
        }
      }

      const skill = await SkillRepository.update(skillId, updateData);
      return skill;
    } catch (error) {
      throw new Error(`Error updating skill: ${error.message}`);
    }
  }

  // Delete skill
  static async deleteSkill(skillId) {
    try {
      if (!skillId) {
        throw new Error("Skill ID is required");
      }

      // Check if skill exists
      const existingSkill = await SkillRepository.findById(skillId);
      if (!existingSkill) {
        throw new Error("Skill not found");
      }

      // Check if skill is being used in any swaps
      const isUsedInSwaps = await SkillRepository.isSkillUsedInSwaps(skillId);
      if (isUsedInSwaps) {
        throw new Error("Cannot delete skill that is being used in swaps");
      }

      const skill = await SkillRepository.delete(skillId);
      return skill;
    } catch (error) {
      throw new Error(`Error deleting skill: ${error.message}`);
    }
  }

  // Get skill statistics
  static async getSkillStats() {
    try {
      const stats = await SkillRepository.getSkillStats();
      return stats;
    } catch (error) {
      throw new Error(`Error getting skill statistics: ${error.message}`);
    }
  }

  // Get skills for user
  static async getUserSkills(userId) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const skills = await SkillRepository.getSkillsByIds(user.skills);
      return skills;
    } catch (error) {
      throw new Error(`Error getting user skills: ${error.message}`);
    }
  }

  // Add skill to user
  static async addSkillToUser(userId, skillId) {
    try {
      if (!userId || !skillId) {
        throw new Error("User ID and Skill ID are required");
      }

      // Check if user exists
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Check if skill exists
      const skill = await SkillRepository.findById(skillId);
      if (!skill) {
        throw new Error("Skill not found");
      }

      // Check if user already has this skill
      if (user.skills.includes(skillId)) {
        throw new Error("User already has this skill");
      }

      const updatedUser = await UserRepository.addSkill(userId, skillId);
      return updatedUser;
    } catch (error) {
      throw new Error(`Error adding skill to user: ${error.message}`);
    }
  }

  // Remove skill from user
  static async removeSkillFromUser(userId, skillId) {
    try {
      if (!userId || !skillId) {
        throw new Error("User ID and Skill ID are required");
      }

      // Check if user exists
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Check if user has this skill
      if (!user.skills.includes(skillId)) {
        throw new Error("User does not have this skill");
      }

      const updatedUser = await UserRepository.removeSkill(userId, skillId);
      return updatedUser;
    } catch (error) {
      throw new Error(`Error removing skill from user: ${error.message}`);
    }
  }

  // Get users by skill
  static async getUsersBySkill(skillId, options = {}) {
    try {
      if (!skillId) {
        throw new Error("Skill ID is required");
      }

      // Check if skill exists
      const skill = await SkillRepository.findById(skillId);
      if (!skill) {
        throw new Error("Skill not found");
      }

      const result = await UserRepository.getUsersBySkill(skillId, options);
      return result;
    } catch (error) {
      throw new Error(`Error getting users by skill: ${error.message}`);
    }
  }

  // Get skill categories
  static async getSkillCategories() {
    try {
      const categories = await SkillRepository.getCategories();
      return categories;
    } catch (error) {
      throw new Error(`Error getting skill categories: ${error.message}`);
    }
  }

  // Get skills by multiple IDs
  static async getSkillsByIds(skillIds) {
    try {
      if (!skillIds || !Array.isArray(skillIds)) {
        throw new Error("Skill IDs array is required");
      }

      const skills = await SkillRepository.getSkillsByIds(skillIds);
      return skills;
    } catch (error) {
      throw new Error(`Error getting skills by IDs: ${error.message}`);
    }
  }
}

module.exports = SkillService;
