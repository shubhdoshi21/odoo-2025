const express = require('express');
const { query } = require('express-validator');
const UserController = require('../controllers/UserController');
const { protect, optionalAuth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const multer = require('multer');
const User = require('../models/User');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

// Validation rules
const userSearchValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location search term cannot exceed 200 characters'),
  query('availability')
    .optional()
    .isArray()
    .withMessage('Availability must be an array'),
  query('availability.*')
    .optional()
    .isIn([
      'Weekdays',
      'Weekends',
      'Evenings',
      'Mornings',
      'Afternoons',
      'Flexible',
    ])
    .withMessage('Invalid availability option'),
];

// Routes
// GET /api/users - Get all users (public profiles only)
router.get(
  '/',
  optionalAuth,
  userSearchValidation,
  handleValidationErrors,
  UserController.getAllUsers,
);

// GET /api/users/search - Search users
router.get('/search', optionalAuth, UserController.searchUsers);

// GET /api/users/top-rated - Get top rated users
router.get('/top-rated', optionalAuth, UserController.getTopRatedUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', optionalAuth, UserController.getUserById);

// GET /api/users/skill/:skillId - Get users by skill
router.get('/skill/:skillId', optionalAuth, UserController.getUsersBySkill);

// POST /api/users/profile-photo - Upload profile photo
router.post(
  '/profile-photo',
  protect,
  upload.single('profilePhoto'),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const filePath = req.file.filename;
      await User.findByIdAndUpdate(userId, { profilePhoto: filePath });
      res.json({ success: true, filePath });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

module.exports = router;
