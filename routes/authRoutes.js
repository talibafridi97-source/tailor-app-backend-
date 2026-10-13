const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// 1. Authentication Routes
router.post('/register', registerUser);
router.post('/signup', registerUser); // Signup support
router.post('/login', loginUser);

// 2. Business Profile Routes (Dukan ki Details)
router.get('/profile', protect, getProfile);    // Data dekhne ke liye
router.put('/profile', protect, updateProfile); // Data badalne ke liye

router.put('/fcm-token', protect, async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (typeof fcmToken !== 'string') {
      return res.status(400).json({ message: 'fcmToken must be a string' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { fcmToken } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;