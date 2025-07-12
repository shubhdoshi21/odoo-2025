const UserRepository = require('../repositories/UserRepository');

class UserController {
  // Get all users with pagination and filters
  async getAllUsers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        location,
        availability,
        isPublic,
      } = req.query;
      const filters = {};

      if (location) filters.location = location;
      if (availability)
        filters.availability = Array.isArray(availability)
          ? availability
          : [availability];
      if (isPublic !== undefined) filters.isPublic = isPublic === 'true';

      const result = await UserRepository.findAll(
        parseInt(page),
        parseInt(limit),
        filters,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Search users
  async searchUsers(req, res) {
    try {
      const { q, location, availability, page = 1, limit = 10 } = req.query;

      console.log('Search request received:', {
        q,
        location,
        availability,
        page,
        limit,
      });

      // Build search criteria
      const searchCriteria = {};

      if (q) searchCriteria.name = q;
      if (location) searchCriteria.location = location;
      if (availability) {
        searchCriteria.availability = Array.isArray(availability)
          ? availability
          : [availability];
      }

      console.log('Search criteria built:', searchCriteria);

      // If no search criteria provided, return all users
      if (Object.keys(searchCriteria).length === 0) {
        console.log('No search criteria, returning all users');
        const result = await UserRepository.findAll(
          parseInt(page),
          parseInt(limit),
          {},
        );
        return res.status(200).json({
          success: true,
          data: result,
        });
      }

      const result = await UserRepository.search(
        searchCriteria,
        parseInt(page),
        parseInt(limit),
      );

      console.log('Search results:', result.users.length, 'users found');

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get top rated users
  async getTopRatedUsers(req, res) {
    try {
      const { limit = 10 } = req.query;
      const users = await UserRepository.getTopRated(parseInt(limit));

      res.status(200).json({
        success: true,
        data: {
          users,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserRepository.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check if user is public or if the requesting user is the same user
      if (!user.isPublic && (!req.user || req.user._id.toString() !== id)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            location: user.location,
            profilePhoto: user.profilePhoto,
            profilePhotoUrl: user.profilePhotoUrl,
            availability: user.availability,
            offeredSkills: user.offeredSkills,
            wantedSkills: user.wantedSkills,
            averageRating: user.averageRating,
            totalRatings: user.totalRatings,
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get users by skill
  async getUsersBySkill(req, res) {
    try {
      const { skillId } = req.params;
      const { type = 'offered', page = 1, limit = 10 } = req.query;

      const result = await UserRepository.findBySkill(
        skillId,
        type,
        parseInt(page),
        parseInt(limit),
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
