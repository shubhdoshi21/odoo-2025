const UserRepository = require('../repositories/UserRepository');
const SwapRepository = require('../repositories/SwapRepository');
const FeedbackRepository = require('../repositories/FeedbackRepository');
const SkillRepository = require('../repositories/SkillRepository');
const ModerationLog = require('../models/ModerationLog');
const AdminMessage = require('../models/AdminMessage');

class AdminService {
  // Get admin dashboard statistics
  static async getDashboardStats() {
    try {
      const [
        totalUsers,
        activeUsers,
        bannedUsers,
        totalSwaps,
        pendingSwaps,
        completedSwaps,
        totalFeedback,
        reportedFeedback,
        totalSkills,
        recentModerationLogs
      ] = await Promise.all([
        UserRepository.countAll(),
        UserRepository.countByStatus('active'),
        UserRepository.countByStatus('banned'),
        SwapRepository.countAll(),
        SwapRepository.countByStatus('pending'),
        SwapRepository.countByStatus('completed'),
        FeedbackRepository.countAll(),
        FeedbackRepository.countReported(),
        SkillRepository.countAll(),
        ModerationLog.find().sort({ createdAt: -1 }).limit(10).exec()
      ]);

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          banned: bannedUsers
        },
        swaps: {
          total: totalSwaps,
          pending: pendingSwaps,
          completed: completedSwaps
        },
        feedback: {
          total: totalFeedback,
          reported: reportedFeedback
        },
        skills: {
          total: totalSkills
        },
        recentModerationLogs
      };
    } catch (error) {
      throw new Error(`Error getting dashboard statistics: ${error.message}`);
    }
  }

  // Get all users
  static async getAllUsers(options = {}) {
    try {
      const result = await UserRepository.getAllUsers(options);
      return result;
    } catch (error) {
      throw new Error(`Error getting all users: ${error.message}`);
    }
  }

  // Get user by ID
  static async getUserById(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const user = await UserRepository.findById(userId);
      return user;
    } catch (error) {
      throw new Error(`Error getting user by ID: ${error.message}`);
    }
  }

  // Update user
  static async updateUser(userId, updateData) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Check if user exists
      const existingUser = await UserRepository.findById(userId);
      if (!existingUser) {
        throw new Error('User not found');
      }

      const user = await UserRepository.update(userId, updateData);
      
      // Log the moderation action
      await this.logModerationAction({
        adminId: updateData.adminId,
        action: 'update_user',
        targetType: 'user',
        targetId: userId,
        details: `Updated user: ${Object.keys(updateData).join(', ')}`
      });

      return user;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Delete user
  static async deleteUser(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Check if user exists
      const existingUser = await UserRepository.findById(userId);
      if (!existingUser) {
        throw new Error('User not found');
      }

      const user = await UserRepository.delete(userId);
      
      // Log the moderation action
      await this.logModerationAction({
        adminId: user.adminId,
        action: 'delete_user',
        targetType: 'user',
        targetId: userId,
        details: 'User deleted'
      });

      return user;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // Ban user
  static async banUser(userId, banData) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!banData.reason) {
        throw new Error('Ban reason is required');
      }

      // Check if user exists
      const existingUser = await UserRepository.findById(userId);
      if (!existingUser) {
        throw new Error('User not found');
      }

      const banUntil = banData.duration ? new Date(Date.now() + banData.duration * 24 * 60 * 60 * 1000) : null;

      const user = await UserRepository.update(userId, {
        status: 'banned',
        banReason: banData.reason,
        banUntil,
        bannedAt: new Date()
      });
      
      // Log the moderation action
      await this.logModerationAction({
        adminId: user.adminId,
        action: 'ban_user',
        targetType: 'user',
        targetId: userId,
        details: `User banned: ${banData.reason}${banUntil ? ` until ${banUntil}` : ''}`
      });

      return user;
    } catch (error) {
      throw new Error(`Error banning user: ${error.message}`);
    }
  }

  // Unban user
  static async unbanUser(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Check if user exists
      const existingUser = await UserRepository.findById(userId);
      if (!existingUser) {
        throw new Error('User not found');
      }

      const user = await UserRepository.update(userId, {
        status: 'active',
        banReason: null,
        banUntil: null,
        bannedAt: null,
        unbannedAt: new Date()
      });
      
      // Log the moderation action
      await this.logModerationAction({
        adminId: user.adminId,
        action: 'unban_user',
        targetType: 'user',
        targetId: userId,
        details: 'User unbanned'
      });

      return user;
    } catch (error) {
      throw new Error(`Error unbanning user: ${error.message}`);
    }
  }

  // Get all swaps
  static async getAllSwaps(options = {}) {
    try {
      const result = await SwapRepository.getAllSwaps(options);
      return result;
    } catch (error) {
      throw new Error(`Error getting all swaps: ${error.message}`);
    }
  }

  // Get swap by ID
  static async getSwapById(swapId) {
    try {
      if (!swapId) {
        throw new Error('Swap ID is required');
      }

      const swap = await SwapRepository.findById(swapId);
      return swap;
    } catch (error) {
      throw new Error(`Error getting swap by ID: ${error.message}`);
    }
  }

  // Delete swap
  static async deleteSwap(swapId) {
    try {
      if (!swapId) {
        throw new Error('Swap ID is required');
      }

      // Check if swap exists
      const existingSwap = await SwapRepository.findById(swapId);
      if (!existingSwap) {
        throw new Error('Swap not found');
      }

      const swap = await SwapRepository.delete(swapId);
      
      // Log the moderation action
      await this.logModerationAction({
        adminId: swap.adminId,
        action: 'delete_swap',
        targetType: 'swap',
        targetId: swapId,
        details: 'Swap deleted'
      });

      return swap;
    } catch (error) {
      throw new Error(`Error deleting swap: ${error.message}`);
    }
  }

  // Get all feedback
  static async getAllFeedback(options = {}) {
    try {
      const result = await FeedbackRepository.getAllFeedback(options);
      return result;
    } catch (error) {
      throw new Error(`Error getting all feedback: ${error.message}`);
    }
  }

  // Get reported feedback
  static async getReportedFeedback(options = {}) {
    try {
      const result = await FeedbackRepository.getReportedFeedback(options);
      return result;
    } catch (error) {
      throw new Error(`Error getting reported feedback: ${error.message}`);
    }
  }

  // Delete feedback
  static async deleteFeedback(feedbackId) {
    try {
      if (!feedbackId) {
        throw new Error('Feedback ID is required');
      }

      // Check if feedback exists
      const existingFeedback = await FeedbackRepository.findById(feedbackId);
      if (!existingFeedback) {
        throw new Error('Feedback not found');
      }

      const feedback = await FeedbackRepository.delete(feedbackId);
      
      // Log the moderation action
      await this.logModerationAction({
        adminId: feedback.adminId,
        action: 'delete_feedback',
        targetType: 'feedback',
        targetId: feedbackId,
        details: 'Feedback deleted'
      });

      return feedback;
    } catch (error) {
      throw new Error(`Error deleting feedback: ${error.message}`);
    }
  }

  // Get moderation logs
  static async getModerationLogs(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        action,
        adminId,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      const query = ModerationLog.find();

      if (action) {
        query.where('action', action);
      }

      if (adminId) {
        query.where('adminId', adminId);
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      query.sort(sortOptions);

      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);

      const [logs, total] = await Promise.all([
        query.populate('adminId', 'username firstName lastName').exec(),
        ModerationLog.countDocuments({
          ...(action && { action }),
          ...(adminId && { adminId })
        })
      ]);

      const pages = Math.ceil(total / limit);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages
        }
      };
    } catch (error) {
      throw new Error(`Error getting moderation logs: ${error.message}`);
    }
  }

  // Send admin message
  static async sendAdminMessage(messageData) {
    try {
      const { adminId, recipientId, subject, message, type = 'notification' } = messageData;

      if (!adminId || !recipientId || !subject || !message) {
        throw new Error('Admin ID, recipient ID, subject, and message are required');
      }

      // Check if recipient exists
      const recipient = await UserRepository.findById(recipientId);
      if (!recipient) {
        throw new Error('Recipient not found');
      }

      const adminMessage = new AdminMessage({
        adminId,
        recipientId,
        subject,
        message,
        type
      });

      await adminMessage.save();
      
      // Log the moderation action
      await this.logModerationAction({
        adminId,
        action: 'send_message',
        targetType: 'user',
        targetId: recipientId,
        details: `Sent ${type} message: ${subject}`
      });

      return adminMessage;
    } catch (error) {
      throw new Error(`Error sending admin message: ${error.message}`);
    }
  }

  // Get admin messages
  static async getAdminMessages(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        recipientId,
        type,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      const query = AdminMessage.find();

      if (recipientId) {
        query.where('recipientId', recipientId);
      }

      if (type) {
        query.where('type', type);
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      query.sort(sortOptions);

      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);

      const [messages, total] = await Promise.all([
        query
          .populate('adminId', 'username firstName lastName')
          .populate('recipientId', 'username firstName lastName email')
          .exec(),
        AdminMessage.countDocuments({
          ...(recipientId && { recipientId }),
          ...(type && { type })
        })
      ]);

      const pages = Math.ceil(total / limit);

      return {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages
        }
      };
    } catch (error) {
      throw new Error(`Error getting admin messages: ${error.message}`);
    }
  }

  // Log moderation action
  static async logModerationAction(logData) {
    try {
      const { adminId, action, targetType, targetId, details } = logData;

      const log = new ModerationLog({
        adminId,
        action,
        targetType,
        targetId,
        details
      });

      await log.save();
      return log;
    } catch (error) {
      console.error(`Error logging moderation action: ${error.message}`);
    }
  }

  // Get system statistics
  static async getSystemStats() {
    try {
      const [
        userStats,
        swapStats,
        feedbackStats,
        skillStats
      ] = await Promise.all([
        UserRepository.getUserStats(),
        SwapRepository.getSwapStats(),
        FeedbackRepository.getFeedbackStats(),
        SkillRepository.getSkillStats()
      ]);

      return {
        users: userStats,
        swaps: swapStats,
        feedback: feedbackStats,
        skills: skillStats
      };
    } catch (error) {
      throw new Error(`Error getting system statistics: ${error.message}`);
    }
  }

  // Get recent activity
  static async getRecentActivity(limit = 20) {
    try {
      const [
        recentUsers,
        recentSwaps,
        recentFeedback,
        recentLogs
      ] = await Promise.all([
        UserRepository.getRecentUsers(limit),
        SwapRepository.getRecentSwaps(limit),
        FeedbackRepository.getRecentFeedback(limit),
        ModerationLog.find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .populate('adminId', 'username firstName lastName')
          .exec()
      ]);

      return {
        users: recentUsers,
        swaps: recentSwaps,
        feedback: recentFeedback,
        moderationLogs: recentLogs
      };
    } catch (error) {
      throw new Error(`Error getting recent activity: ${error.message}`);
    }
  }
}

module.exports = AdminService; 