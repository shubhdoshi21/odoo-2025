const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const SkillRepository = require("../repositories/SkillRepository");
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

  // Helper method to convert skill names to IDs
  async convertSkillNamesToIds(skillNames) {
    if (!skillNames || !Array.isArray(skillNames)) {
      return [];
    }

    const skillIds = [];
    for (const skillName of skillNames) {
      try {
        // Try to find existing skill by name
        let skill = await SkillRepository.findByName(skillName);

        if (!skill) {
          // Create new skill if it doesn't exist
          skill = await SkillRepository.create({
            name: skillName,
            category: "Other", // Default category
            createdByAdmin: false,
          });
        }

        skillIds.push(skill._id);
      } catch (error) {
        console.error(`Error processing skill "${skillName}":`, error);
        // Continue with other skills even if one fails
      }
    }

    return skillIds;
  }

  // Update user profile
  async updateProfile(userId, updateData, req) {
    try {
      // Remove sensitive fields from update data
      const { password, email, ...safeUpdateData } = updateData;

      // Handle file upload if present
      if (req && req.file) {
        safeUpdateData.profilePhoto = req.file.filename;
      }

      // Handle array fields from FormData (they come as key[0], key[1], etc.)
      const processArrayFields = (data, fieldName) => {
        const arrayData = [];
        Object.keys(data).forEach((key) => {
          if (key.startsWith(`${fieldName}[`)) {
            const index = parseInt(key.match(/\[(\d+)\]/)[1]);
            arrayData[index] = data[key];
          }
        });
        return arrayData.length > 0 ? arrayData : data[fieldName];
      };

      // Process array fields
      safeUpdateData.offeredSkills = processArrayFields(
        safeUpdateData,
        "offeredSkills"
      );
      safeUpdateData.wantedSkills = processArrayFields(
        safeUpdateData,
        "wantedSkills"
      );
      safeUpdateData.availability = processArrayFields(
        safeUpdateData,
        "availability"
      );

      // Parse skills if they come as JSON strings from FormData
      if (safeUpdateData.offeredSkills && typeof safeUpdateData.offeredSkills === 'string') {
        try {
          safeUpdateData.offeredSkills = JSON.parse(safeUpdateData.offeredSkills);
        } catch (error) {
          console.error('Error parsing offeredSkills:', error);
          safeUpdateData.offeredSkills = [];
        }
      }

      if (safeUpdateData.wantedSkills && typeof safeUpdateData.wantedSkills === 'string') {
        try {
          safeUpdateData.wantedSkills = JSON.parse(safeUpdateData.wantedSkills);
        } catch (error) {
          console.error('Error parsing wantedSkills:', error);
          safeUpdateData.wantedSkills = [];
        }
      }

      if (safeUpdateData.availability && typeof safeUpdateData.availability === 'string') {
        try {
          safeUpdateData.availability = JSON.parse(safeUpdateData.availability);
        } catch (error) {
          console.error('Error parsing availability:', error);
          safeUpdateData.availability = [];
        }
      }

      // Convert skill names to IDs if they are provided as arrays
      if (
        safeUpdateData.offeredSkills &&
        Array.isArray(safeUpdateData.offeredSkills)
      ) {
        safeUpdateData.offeredSkills = await this.convertSkillNamesToIds(
          safeUpdateData.offeredSkills
        );
      }

      if (
        safeUpdateData.wantedSkills &&
        Array.isArray(safeUpdateData.wantedSkills)
      ) {
        safeUpdateData.wantedSkills = await this.convertSkillNamesToIds(
          safeUpdateData.wantedSkills
        );
      }

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
