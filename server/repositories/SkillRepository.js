const Skill = require("../models/Skill");

class SkillRepository {
  // Create a new skill
  async create(skillData) {
    try {
      const skill = new Skill(skillData);
      return await skill.save();
    } catch (error) {
      throw error;
    }
  }

  // Find skill by ID
  async findById(id) {
    try {
      return await Skill.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Find skill by name
  async findByName(name) {
    try {
      return await Skill.findOne({ name: name.toLowerCase() });
    } catch (error) {
      throw error;
    }
  }

  // Update skill
  async update(id, updateData) {
    try {
      return await Skill.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw error;
    }
  }

  // Delete skill
  async delete(id) {
    try {
      return await Skill.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  // Find all skills with pagination
  async findAll(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = { isActive: true };

      // Apply filters
      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.createdByAdmin !== undefined) {
        query.createdByAdmin = filters.createdByAdmin;
      }

      const skills = await Skill.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ usageCount: -1, name: 1 });

      const total = await Skill.countDocuments(query);

      return {
        skills,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Search skills
  async search(query, limit = 10) {
    try {
      return await Skill.searchSkills(query, limit);
    } catch (error) {
      throw error;
    }
  }

  // Get popular skills
  async getPopular(limit = 10) {
    try {
      return await Skill.getPopularSkills(limit);
    } catch (error) {
      throw error;
    }
  }

  // Get skills by category
  async getByCategory(category, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const query = { category, isActive: true };

      const skills = await Skill.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ usageCount: -1, name: 1 });

      const total = await Skill.countDocuments(query);

      return {
        skills,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Increment usage count
  async incrementUsage(id) {
    try {
      const skill = await Skill.findById(id);
      if (skill) {
        return await skill.incrementUsage();
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  // Toggle skill active status
  async toggleActive(id, isActive) {
    try {
      return await Skill.findByIdAndUpdate(
        id,
        { isActive },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  // Get skill statistics
  async getSkillStats() {
    try {
      const stats = await Skill.aggregate([
        {
          $group: {
            _id: null,
            totalSkills: { $sum: 1 },
            activeSkills: {
              $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
            },
            adminCreatedSkills: {
              $sum: { $cond: [{ $eq: ["$createdByAdmin", true] }, 1, 0] },
            },
            avgUsageCount: { $avg: "$usageCount" },
          },
        },
      ]);

      const categoryStats = await Skill.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            avgUsage: { $avg: "$usageCount" },
          },
        },
        { $sort: { count: -1 } },
      ]);

      return {
        ...stats[0],
        categoryStats,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get skills with usage count
  async getSkillsWithUsage(limit = 20) {
    try {
      return await Skill.find({ isActive: true })
        .sort({ usageCount: -1 })
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  // Bulk create skills (for seeding)
  async bulkCreate(skillsData) {
    try {
      return await Skill.insertMany(skillsData);
    } catch (error) {
      throw error;
    }
  }

  // Get skills by IDs
  async findByIds(ids) {
    try {
      return await Skill.find({ _id: { $in: ids }, isActive: true });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SkillRepository();
