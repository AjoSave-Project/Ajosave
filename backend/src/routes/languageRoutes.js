const express = require('express');
const router = express.Router();
const {
  getSupportedLanguages,
  getUserLanguagePreference,
  updateUserLanguagePreference,
  getAllUserPreferences,
  updateBulkPreferences
} = require('../controllers/languageController');

const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.get('/supported', getSupportedLanguages);

// Protected routes - require authentication
router.get('/preference', protect, getUserLanguagePreference);
router.put('/preference', protect, updateUserLanguagePreference);
router.get('/preferences/all', protect, getAllUserPreferences);
router.put('/preferences/bulk', protect, updateBulkPreferences);

module.exports = router;
