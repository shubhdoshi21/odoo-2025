const Skill = require("../models/Skill");
const Swap = require("../models/Swap");

class SkillRepository {
  // Create new skill
  static async create(skillData) {
    try {
      const skill = new Skill(skillData);
      return await skill.save();
    } catch (error) {
      throw new Error(`Error creating skill: ${error.message}`);
    }
  }

  // Find skill by ID
  static async findById(skillId) {
    try {
      return await Skill.findById(skillId).exec();
    } catch (error) {
      throw new Error(`Error finding skill: ${error.message}`);
    }
  }

  // Find skill by name
  static async findByName(name) {
    try {
      return await Skill.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
      }).exec();
    } catch (error) {
      throw new Error(`Error finding skill by name: ${error.message}`);
    }
  }

  // Get all skills with pagination and filters
  static async getAllSkills(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        filters = {},
        sortBy = "name",
        sortOrder = "asc",
      } = options;

      const query = Skill.find(filters);

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
      query.sort(sortOptions);

      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);

      const [skills, total] = await Promise.all([
        query.exec(),
        Skill.countDocuments(filters),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        skills,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      throw new Error(`Error getting all skills: ${error.message}`);
    }
  }

  // Search skills
  static async searchSkills(query, limit = 10) {
    try {
      return await Skill.find({
        $text: { $search: query },
      })
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .exec();
    } catch (error) {
      throw new Error(`Error searching skills: ${error.message}`);
    }
  }

  // Get popular skills
  static async getPopularSkills(limit = 10) {
    try {
      return await Skill.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "skills",
            as: "users",
          },
        },
        {
          $addFields: {
            userCount: { $size: "$users" },
          },
        },
        {
          $sort: { userCount: -1 },
        },
        {
          $limit: limit,
        },
        {
          $project: {
            users: 0,
          },
        },
      ]);
    } catch (error) {
      throw new Error(`Error getting popular skills: ${error.message}`);
    }
  }

  // Get skills by category
  static async getSkillsByCategory(category, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "name",
        sortOrder = "asc",
      } = options;

      const query = Skill.find({ category });

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
      query.sort(sortOptions);

      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);

      const [skills, total] = await Promise.all([
        query.exec(),
        Skill.countDocuments({ category }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        skills,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      throw new Error(`Error getting skills by category: ${error.message}`);
    }
  }

  // Update skill
  static async update(skillId, updateData) {
    try {
      const skill = await Skill.findByIdAndUpdate(skillId, updateData, {
        new: true,
        runValidators: true,
      });

      return skill;
    } catch (error) {
      throw new Error(`Error updating skill: ${error.message}`);
    }
  }

  // Delete skill
  static async delete(skillId) {
    try {
      const skill = await Skill.findByIdAndDelete(skillId);
      return skill;
    } catch (error) {
      throw new Error(`Error deleting skill: ${error.message}`);
    }
  }

  // Get skill statistics
  static async getSkillStats() {
    try {
      const stats = await Skill.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "skills",
            as: "users",
          },
        },
        {
          $addFields: {
            userCount: { $size: "$users" },
          },
        },
        {
          $group: {
            _id: null,
            totalSkills: { $sum: 1 },
            totalUsers: { $sum: "$userCount" },
            averageUsersPerSkill: { $avg: "$userCount" },
          },
        },
      ]);

      const categoryStats = await Skill.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      const totalSkills = await Skill.countDocuments();

      return {
        total: totalSkills,
        ...(stats[0] && {
          totalUsers: stats[0].totalUsers,
          averageUsersPerSkill:
            Math.round(stats[0].averageUsersPerSkill * 10) / 10,
        }),
        byCategory: categoryStats,
      };
    } catch (error) {
      throw new Error(`Error getting skill statistics: ${error.message}`);
    }
  }

  // Get skills by multiple IDs
  static async getSkillsByIds(skillIds) {
    try {
      if (!skillIds || !Array.isArray(skillIds) || skillIds.length === 0) {
        return [];
      }

      return await Skill.find({
        _id: { $in: skillIds },
      }).exec();
    } catch (error) {
      throw new Error(`Error getting skills by IDs: ${error.message}`);
    }
  }

  // Get categories
  static async getCategories() {
    try {
      return await Skill.distinct("category").exec();
    } catch (error) {
      throw new Error(`Error getting categories: ${error.message}`);
    }
  }

  // Check if skill is used in swaps
  static async isSkillUsedInSwaps(skillId) {
    try {
      const count = await Swap.countDocuments({
        $or: [{ requestedSkillId: skillId }, { offeredSkillId: skillId }],
      });

      return count > 0;
    } catch (error) {
      throw new Error(
        `Error checking if skill is used in swaps: ${error.message}`
      );
    }
  }

  // Get skills with user count
  static async getSkillsWithUserCount(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "userCount",
        sortOrder = "desc",
      } = options;

      const skills = await Skill.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "skills",
            as: "users",
          },
        },
        {
          $addFields: {
            userCount: { $size: "$users" },
          },
        },
        {
          $project: {
            users: 0,
          },
        },
        {
          $sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      ]);

      const total = await Skill.countDocuments();

      const pages = Math.ceil(total / limit);

      return {
        skills,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      throw new Error(`Error getting skills with user count: ${error.message}`);
    }
  }

  // Get skills by user
  static async getSkillsByUser(userId) {
    try {
      return await Skill.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "skills",
            as: "users",
          },
        },
        {
          $match: {
            "users._id": userId,
          },
        },
        {
          $project: {
            users: 0,
          },
        },
      ]);
    } catch (error) {
      throw new Error(`Error getting skills by user: ${error.message}`);
    }
  }

  // Get skills not owned by user
  static async getSkillsNotOwnedByUser(userId) {
    try {
      return await Skill.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "skills",
            as: "users",
          },
        },
        {
          $match: {
            "users._id": { $ne: userId },
          },
        },
        {
          $project: {
            users: 0,
          },
        },
      ]);
    } catch (error) {
      throw new Error(
        `Error getting skills not owned by user: ${error.message}`
      );
    }
  }

  // Get skills by popularity range
  static async getSkillsByPopularityRange(minUsers, maxUsers, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "userCount",
        sortOrder = "desc",
      } = options;

      const skills = await Skill.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "skills",
            as: "users",
          },
        },
        {
          $addFields: {
            userCount: { $size: "$users" },
          },
        },
        {
          $match: {
            userCount: { $gte: minUsers, $lte: maxUsers },
          },
        },
        {
          $project: {
            users: 0,
          },
        },
        {
          $sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      ]);

      const total = await Skill.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "skills",
            as: "users",
          },
        },
        {
          $addFields: {
            userCount: { $size: "$users" },
          },
        },
        {
          $match: {
            userCount: { $gte: minUsers, $lte: maxUsers },
          },
        },
        {
          $count: "total",
        },
      ]);

      const totalCount = total[0]?.total || 0;
      const pages = Math.ceil(totalCount / limit);

      return {
        skills,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages,
        },
      };
    } catch (error) {
      throw new Error(
        `Error getting skills by popularity range: ${error.message}`
      );
    }
  }
}

module.exports = SkillRepository;
