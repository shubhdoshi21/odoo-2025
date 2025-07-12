const Swap = require("../models/Swap");
const User = require("../models/User");
const Skill = require("../models/Skill");

class SwapRepository {
  // Create new swap
  static async create(swapData) {
    try {
      const swap = new Swap(swapData);
      return await swap.save();
    } catch (error) {
      throw new Error(`Error creating swap: ${error.message}`);
    }
  }

  // Find swap by ID with populated fields
  static async findById(swapId, userId = null) {
    try {
      let query = Swap.findById(swapId)
        .populate(
          "requesterId",
          "username firstName lastName email profilePicture rating"
        )
        .populate(
          "providerId",
          "username firstName lastName email profilePicture rating"
        )
        .populate("requestedSkillId", "name category description")
        .populate("offeredSkillId", "name category description");

      if (userId) {
        query = query.or([{ requesterId: userId }, { providerId: userId }]);
      }

      return await query.exec();
    } catch (error) {
      throw new Error(`Error finding swap: ${error.message}`);
    }
  }

  // Get user's swaps with pagination and filters
  static async getUserSwaps(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const query = Swap.find({
        $or: [{ requesterId: userId }, { providerId: userId }],
      })
        .populate(
          "requesterId",
          "username firstName lastName email profilePicture rating"
        )
        .populate(
          "providerId",
          "username firstName lastName email profilePicture rating"
        )
        .populate("requestedSkillId", "name category description")
        .populate("offeredSkillId", "name category description");

      if (status) {
        query.where("status", status);
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
      query.sort(sortOptions);

      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);

      const [swaps, total] = await Promise.all([
        query.exec(),
        Swap.countDocuments({
          $or: [{ requesterId: userId }, { providerId: userId }],
          ...(status && { status }),
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        swaps,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      throw new Error(`Error getting user swaps: ${error.message}`);
    }
  }

  // Get pending swaps for a user
  static async getPendingSwaps(userId) {
    try {
      return await Swap.find({
        providerId: userId,
        status: "pending",
      })
        .populate(
          "requesterId",
          "username firstName lastName email profilePicture rating"
        )
        .populate("requestedSkillId", "name category description")
        .populate("offeredSkillId", "name category description")
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      throw new Error(`Error getting pending swaps: ${error.message}`);
    }
  }

  // Update swap
  static async update(swapId, updateData, userId) {
    try {
      const swap = await Swap.findOneAndUpdate(
        {
          _id: swapId,
          $or: [{ requesterId: userId }, { providerId: userId }],
        },
        updateData,
        { new: true, runValidators: true }
      )
        .populate(
          "requesterId",
          "username firstName lastName email profilePicture rating"
        )
        .populate(
          "providerId",
          "username firstName lastName email profilePicture rating"
        )
        .populate("requestedSkillId", "name category description")
        .populate("offeredSkillId", "name category description");

      return swap;
    } catch (error) {
      throw new Error(`Error updating swap: ${error.message}`);
    }
  }

  // Accept swap
  static async acceptSwap(swapId, userId) {
    try {
      const swap = await Swap.findOneAndUpdate(
        {
          _id: swapId,
          providerId: userId,
          status: "pending",
        },
        {
          status: "accepted",
          acceptedAt: new Date(),
        },
        { new: true, runValidators: true }
      )
        .populate(
          "requesterId",
          "username firstName lastName email profilePicture rating"
        )
        .populate(
          "providerId",
          "username firstName lastName email profilePicture rating"
        )
        .populate("requestedSkillId", "name category description")
        .populate("offeredSkillId", "name category description");

      return swap;
    } catch (error) {
      throw new Error(`Error accepting swap: ${error.message}`);
    }
  }

  // Reject swap
  static async rejectSwap(swapId, userId, reason) {
    try {
      const swap = await Swap.findOneAndUpdate(
        {
          _id: swapId,
          providerId: userId,
          status: "pending",
        },
        {
          status: "rejected",
          rejectedAt: new Date(),
          rejectionReason: reason,
        },
        { new: true, runValidators: true }
      )
        .populate(
          "requesterId",
          "username firstName lastName email profilePicture rating"
        )
        .populate(
          "providerId",
          "username firstName lastName email profilePicture rating"
        )
        .populate("requestedSkillId", "name category description")
        .populate("offeredSkillId", "name category description");

      return swap;
    } catch (error) {
      throw new Error(`Error rejecting swap: ${error.message}`);
    }
  }

  // Cancel swap
  static async cancelSwap(swapId, userId, reason) {
    try {
      const swap = await Swap.findOneAndUpdate(
        {
          _id: swapId,
          $or: [{ requesterId: userId }, { providerId: userId }],
          status: { $in: ["pending", "accepted"] },
        },
        {
          status: "cancelled",
          cancelledAt: new Date(),
          cancellationReason: reason,
        },
        { new: true, runValidators: true }
      )
        .populate(
          "requesterId",
          "username firstName lastName email profilePicture rating"
        )
        .populate(
          "providerId",
          "username firstName lastName email profilePicture rating"
        )
        .populate("requestedSkillId", "name category description")
        .populate("offeredSkillId", "name category description");

      return swap;
    } catch (error) {
      throw new Error(`Error cancelling swap: ${error.message}`);
    }
  }

  // Complete swap
  static async completeSwap(swapId, userId) {
    try {
      const swap = await Swap.findOneAndUpdate(
        {
          _id: swapId,
          $or: [{ requesterId: userId }, { providerId: userId }],
          status: "accepted",
        },
        {
          status: "completed",
          completedAt: new Date(),
        },
        { new: true, runValidators: true }
      )
        .populate(
          "requesterId",
          "username firstName lastName email profilePicture rating"
        )
        .populate(
          "providerId",
          "username firstName lastName email profilePicture rating"
        )
        .populate("requestedSkillId", "name category description")
        .populate("offeredSkillId", "name category description");

      return swap;
    } catch (error) {
      throw new Error(`Error completing swap: ${error.message}`);
    }
  }

  // Delete swap
  static async delete(swapId, userId) {
    try {
      const swap = await Swap.findOneAndDelete({
        _id: swapId,
        requesterId: userId,
        status: "pending",
      })
        .populate(
          "requesterId",
          "username firstName lastName email profilePicture rating"
        )
        .populate(
          "providerId",
          "username firstName lastName email profilePicture rating"
        )
        .populate("requestedSkillId", "name category description")
        .populate("offeredSkillId", "name category description");

      return swap;
    } catch (error) {
      throw new Error(`Error deleting swap: ${error.message}`);
    }
  }

  // Get swap statistics for a user
  static async getSwapStats(userId) {
    try {
      const stats = await Swap.aggregate([
        {
          $match: {
            $or: [{ requesterId: userId }, { providerId: userId }],
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const totalSwaps = await Swap.countDocuments({
        $or: [{ requesterId: userId }, { providerId: userId }],
      });

      const completedSwaps = await Swap.countDocuments({
        $or: [{ requesterId: userId }, { providerId: userId }],
        status: "completed",
      });

      const pendingSwaps = await Swap.countDocuments({
        providerId: userId,
        status: "pending",
      });

      const statsMap = {};
      stats.forEach((stat) => {
        statsMap[stat._id] = stat.count;
      });

      return {
        total: totalSwaps,
        completed: completedSwaps,
        pending: pendingSwaps,
        byStatus: statsMap,
      };
    } catch (error) {
      throw new Error(`Error getting swap stats: ${error.message}`);
    }
  }

  // Get all swaps (Admin only)
  static async getAllSwaps(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const query = Swap.find()
        .populate("requesterId", "username firstName lastName email")
        .populate("providerId", "username firstName lastName email")
        .populate("requestedSkillId", "name category")
        .populate("offeredSkillId", "name category");

      if (status) {
        query.where("status", status);
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
      query.sort(sortOptions);

      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);

      const [swaps, total] = await Promise.all([
        query.exec(),
        Swap.countDocuments(status ? { status } : {}),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        swaps,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      throw new Error(`Error getting all swaps: ${error.message}`);
    }
  }

  // Check if user can create swap with another user
  static async canCreateSwap(requesterId, providerId) {
    try {
      const existingSwap = await Swap.findOne({
        $or: [
          {
            requesterId,
            providerId,
            status: { $in: ["pending", "accepted"] },
          },
          {
            requesterId: providerId,
            providerId: requesterId,
            status: { $in: ["pending", "accepted"] },
          },
        ],
      });

      return !existingSwap;
    } catch (error) {
      throw new Error(`Error checking swap eligibility: ${error.message}`);
    }
  }

  // Static methods for AdminService
  static async countAll() {
    try {
      return await Swap.countDocuments();
    } catch (error) {
      throw new Error(`Error counting all swaps: ${error.message}`);
    }
  }

  static async countByStatus(status) {
    try {
      return await Swap.countDocuments({ status });
    } catch (error) {
      throw new Error(`Error counting swaps by status: ${error.message}`);
    }
  }

  static async getRecentSwaps(limit = 10) {
    try {
      return await Swap.find()
        .populate("requesterId", "username firstName lastName email")
        .populate("providerId", "username firstName lastName email")
        .populate("requestedSkillId", "name category")
        .populate("offeredSkillId", "name category")
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
    } catch (error) {
      throw new Error(`Error getting recent swaps: ${error.message}`);
    }
  }
}

module.exports = SwapRepository;
