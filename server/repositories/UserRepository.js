const User = require("../models/User");

class UserRepository {
  // Create a new user
  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  async findById(id) {
    try {
      return await User.findById(id).select("-password");
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  async findByEmail(email) {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      throw error;
    }
  }

  // Find user by email with password (for authentication)
  async findByEmailWithPassword(email) {
    try {
      return await User.findOne({ email: email.toLowerCase() }).select(
        "+password"
      );
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async update(id, updateData) {
    try {
      return await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  async delete(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  // Find all users with pagination
  async findAll(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = { isBanned: false };

      // Apply filters
      if (filters.isPublic !== undefined) {
        query.isPublic = filters.isPublic;
      }

      if (filters.location) {
        query.location = { $regex: filters.location, $options: "i" };
      }

      if (filters.availability && filters.availability.length > 0) {
        query.availability = { $in: filters.availability };
      }

      const users = await User.find(query)
        .populate("offeredSkills", "name category")
        .populate("wantedSkills", "name category")
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      return {
        users,
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

  // Find users by skill
  async findBySkill(skillId, type = "offered", page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const query =
        type === "offered"
          ? { offeredSkills: skillId, isPublic: true, isBanned: false }
          : { wantedSkills: skillId, isPublic: true, isBanned: false };

      const users = await User.find(query)
        .populate("offeredSkills", "name category")
        .populate("wantedSkills", "name category")
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ averageRating: -1, createdAt: -1 });

      const total = await User.countDocuments(query);

      return {
        users,
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

  // Search users
  async search(query, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const searchQuery = {
        isBanned: false,
        $or: [
          { name: { $regex: query, $options: "i" } },
          { location: { $regex: query, $options: "i" } },
        ],
      };

      const users = await User.find(searchQuery)
        .populate("offeredSkills", "name category")
        .populate("wantedSkills", "name category")
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ averageRating: -1, createdAt: -1 });

      const total = await User.countDocuments(searchQuery);

      return {
        users,
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

  // Get top rated users
  async getTopRated(limit = 10) {
    try {
      return await User.find({ isBanned: false, isPublic: true })
        .populate("offeredSkills", "name category")
        .populate("wantedSkills", "name category")
        .select("-password")
        .sort({ averageRating: -1, totalRatings: -1 })
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  // Ban/unban user
  async toggleBan(id, isBanned) {
    try {
      return await User.findByIdAndUpdate(
        id,
        { isBanned },
        { new: true, runValidators: true }
      ).select("-password");
    } catch (error) {
      throw error;
    }
  }

  // Update user skills
  async updateSkills(id, offeredSkills, wantedSkills) {
    try {
      return await User.findByIdAndUpdate(
        id,
        { offeredSkills, wantedSkills },
        { new: true, runValidators: true }
      )
        .populate("offeredSkills", "name category")
        .populate("wantedSkills", "name category")
        .select("-password");
    } catch (error) {
      throw error;
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      const stats = await User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: {
              $sum: { $cond: [{ $eq: ["$isBanned", false] }, 1, 0] },
            },
            bannedUsers: {
              $sum: { $cond: [{ $eq: ["$isBanned", true] }, 1, 0] },
            },
            publicUsers: {
              $sum: { $cond: [{ $eq: ["$isPublic", true] }, 1, 0] },
            },
            avgRating: { $avg: "$averageRating" },
          },
        },
      ]);

      return (
        stats[0] || {
          totalUsers: 0,
          activeUsers: 0,
          bannedUsers: 0,
          publicUsers: 0,
          avgRating: 0,
        }
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();
