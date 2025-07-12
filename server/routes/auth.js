const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/AuthController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors, isValidEmail, isStrongPassword } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('availability')
    .optional()
    .isArray()
    .withMessage('Availability must be an array'),
  body('availability.*')
    .optional()
    .isIn(['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Afternoons', 'Flexible'])
    .withMessage('Invalid availability option')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

const resetPasswordValidation = [
  body('resetToken')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

const deleteAccountValidation = [
  body('password')
    .notEmpty()
    .withMessage('Password is required to confirm account deletion')
];

// Routes
// POST /api/auth/register
router.post('/register', registerValidation, handleValidationErrors, AuthController.register);

// POST /api/auth/login
router.post('/login', loginValidation, handleValidationErrors, AuthController.login);

// GET /api/auth/profile
router.get('/profile', protect, AuthController.getProfile);

// PUT /api/auth/profile
router.put('/profile', protect, AuthController.updateProfile);

// POST /api/auth/change-password
router.post('/change-password', protect, changePasswordValidation, handleValidationErrors, AuthController.changePassword);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPasswordValidation, handleValidationErrors, AuthController.forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', resetPasswordValidation, handleValidationErrors, AuthController.resetPassword);

// DELETE /api/auth/account
router.delete('/account', protect, deleteAccountValidation, handleValidationErrors, AuthController.deleteAccount);

module.exports = router; 