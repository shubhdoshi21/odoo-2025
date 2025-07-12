const AuthService = require("../services/AuthService");

class AuthController {
  // Register user
  async register(req, res) {
    try {
      const { name, email, password, location, availability } = req.body;

      const result = await AuthService.register({
        name,
        email,
        password,
        location,
        availability,
      });

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide email and password",
        });
      }

      const result = await AuthService.login(email, password);

      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const result = await AuthService.getProfile(req.user._id);

      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const result = await AuthService.updateProfile(
        req.user._id,
        req.body,
        req
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Please provide current and new password",
        });
      }

      const result = await AuthService.changePassword(
        req.user._id,
        currentPassword,
        newPassword
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Please provide email address",
        });
      }

      const result = await AuthService.forgotPassword(email);

      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { resetToken, newPassword } = req.body;

      if (!resetToken || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Please provide reset token and new password",
        });
      }

      const result = await AuthService.resetPassword(resetToken, newPassword);

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete account
  async deleteAccount(req, res) {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Please provide password to confirm account deletion",
        });
      }

      const result = await AuthService.deleteAccount(req.user._id, password);

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
