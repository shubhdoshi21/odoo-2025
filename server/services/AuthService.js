const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const { generateToken } = require("../middleware/auth");

class AuthService {
  // Register a new user
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await UserRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Create new user
      const user = await UserRepository.create(userData);

      // Generate JWT token
      const token = generateToken(user._id);

      return {
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            location: user.location,
            profilePhoto: user.profilePhoto,
            availability: user.availability,
            isPublic: user.isPublic,
            offeredSkills: user.offeredSkills,
            wantedSkills: user.wantedSkills,
            averageRating: user.averageRating,
            totalRatings: user.totalRatings,
            createdAt: user.createdAt,
          },
          token,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      // Find user with password
      const user = await UserRepository.findByEmailWithPassword(email);

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Check if user is banned
      if (user.isBanned) {
        throw new Error("Your account has been banned");
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Generate JWT token
      const token = generateToken(user._id);

      return {
        success: true,
        message: "Login successful",
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            location: user.location,
            profilePhoto: user.profilePhoto,
            availability: user.availability,
            isPublic: user.isPublic,
            offeredSkills: user.offeredSkills,
            wantedSkills: user.wantedSkills,
            averageRating: user.averageRating,
            totalRatings: user.totalRatings,
            createdAt: user.createdAt,
          },
          token,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get current user profile
  async getProfile(userId) {
    try {
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      return {
        success: true,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            location: user.location,
            profilePhoto: user.profilePhoto,
            profilePhotoUrl: user.profilePhotoUrl,
            availability: user.availability,
            isPublic: user.isPublic,
            offeredSkills: user.offeredSkills,
            wantedSkills: user.wantedSkills,
            averageRating: user.averageRating,
            totalRatings: user.totalRatings,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    try {
      // Remove sensitive fields from update data
      const { password, email, ...safeUpdateData } = updateData;

      const updatedUser = await UserRepository.update(userId, safeUpdateData);
      if (!updatedUser) {
        throw new Error("User not found");
      }

      return {
        success: true,
        message: "Profile updated successfully",
        data: {
          user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            location: updatedUser.location,
            profilePhoto: updatedUser.profilePhoto,
            profilePhotoUrl: updatedUser.profilePhotoUrl,
            availability: updatedUser.availability,
            isPublic: updatedUser.isPublic,
            offeredSkills: updatedUser.offeredSkills,
            wantedSkills: updatedUser.wantedSkills,
            averageRating: updatedUser.averageRating,
            totalRatings: updatedUser.totalRatings,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
          },
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get user with password
      const user = await UserRepository.findByEmailWithPassword(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      // Hash new password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await UserRepository.update(userId, { password: hashedPassword });

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // Forgot password (generate reset token)
  async forgotPassword(email) {
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      // Generate reset token (expires in 1 hour)
      const resetToken = jwt.sign(
        { id: user._id, type: "password_reset" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // In a real application, you would send this token via email
      // For now, we'll just return it (remove this in production)
      return {
        success: true,
        message: "Password reset token generated",
        data: {
          resetToken,
          // Remove this in production - send via email instead
          message: "In production, this token would be sent via email",
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async resetPassword(resetToken, newPassword) {
    try {
      // Verify reset token
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

      if (decoded.type !== "password_reset") {
        throw new Error("Invalid reset token");
      }

      // Hash new password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await UserRepository.update(decoded.id, { password: hashedPassword });

      return {
        success: true,
        message: "Password reset successfully",
      };
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        throw new Error("Invalid or expired reset token");
      }
      throw error;
    }
  }

  // Delete account
  async deleteAccount(userId, password) {
    try {
      // Get user with password
      const user = await UserRepository.findByEmailWithPassword(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error("Password is incorrect");
      }

      // Delete user
      await UserRepository.delete(userId);

      return {
        success: true,
        message: "Account deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
