const User = require('../models/Users');
const { successResponse, errorResponse } = require('../utils/responseHelpers');

/**
 * Get supported languages
 * @route GET /api/language/supported
 * @access Public
 */
const getSupportedLanguages = async (req, res) => {
  try {
    const languages = [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧'
      },
      {
        code: 'pcm',
        name: 'Nigerian Pidgin',
        nativeName: 'Naija',
        flag: '🇳🇬'
      },
      {
        code: 'ig',
        name: 'Igbo',
        nativeName: 'Igbo',
        flag: '🇳🇬'
      },
      {
        code: 'yo',
        name: 'Yoruba',
        nativeName: 'Yorùbá',
        flag: '🇳🇬'
      },
      {
        code: 'ha',
        name: 'Hausa',
        nativeName: 'Hausa',
        flag: '🇳🇬'
      }
    ];

    return successResponse(res, 'Supported languages retrieved successfully', { languages });
  } catch (error) {
    console.error('Get supported languages error:', error);
    return errorResponse(res, 'Failed to retrieve supported languages', 500);
  }
};

/**
 * Get user's current language preference
 * @route GET /api/language/preference
 * @access Private
 */
const getUserLanguagePreference = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences.language');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, 'Language preference retrieved successfully', {
      language: user.preferences.language || 'en'
    });
  } catch (error) {
    console.error('Get user language preference error:', error);
    return errorResponse(res, 'Failed to retrieve language preference', 500);
  }
};

/**
 * Update user's language preference
 * @route PUT /api/language/preference
 * @access Private
 */
const updateUserLanguagePreference = async (req, res) => {
  try {
    const { language } = req.body;

    // Validate language code
    const supportedLanguages = ['en', 'ig', 'yo', 'ha', 'pcm'];
    if (!language || !supportedLanguages.includes(language)) {
      return errorResponse(res, 'Invalid language code. Supported languages: en, ig, yo, ha, pcm', 400);
    }

    // Update user's language preference
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'preferences.language': language },
      { new: true, runValidators: true }
    ).select('preferences.language firstName lastName email');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, 'Language preference updated successfully', {
      language: user.preferences.language,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Update user language preference error:', error);
    return errorResponse(res, 'Failed to update language preference', 500);
  }
};

/**
 * Get all user preferences (including language)
 * @route GET /api/language/preferences/all
 * @access Private
 */
const getAllUserPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, 'User preferences retrieved successfully', {
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Get all user preferences error:', error);
    return errorResponse(res, 'Failed to retrieve user preferences', 500);
  }
};

/**
 * Update multiple user preferences at once
 * @route PUT /api/language/preferences/bulk
 * @access Private
 */
const updateBulkPreferences = async (req, res) => {
  try {
    const { language, currency, notifications, privacy } = req.body;
    const updates = {};

    // Validate and add language if provided
    if (language) {
      const supportedLanguages = ['en', 'ig', 'yo', 'ha', 'pcm'];
      if (!supportedLanguages.includes(language)) {
        return errorResponse(res, 'Invalid language code. Supported languages: en, ig, yo, ha, pcm', 400);
      }
      updates['preferences.language'] = language;
    }

    // Validate and add currency if provided
    if (currency) {
      const supportedCurrencies = ['NGN', 'USD'];
      if (!supportedCurrencies.includes(currency)) {
        return errorResponse(res, 'Invalid currency code. Supported currencies: NGN, USD', 400);
      }
      updates['preferences.currency'] = currency;
    }

    // Add notifications preferences if provided
    if (notifications) {
      if (typeof notifications.email === 'boolean') {
        updates['preferences.notifications.email'] = notifications.email;
      }
      if (typeof notifications.sms === 'boolean') {
        updates['preferences.notifications.sms'] = notifications.sms;
      }
      if (typeof notifications.push === 'boolean') {
        updates['preferences.notifications.push'] = notifications.push;
      }
      if (typeof notifications.marketing === 'boolean') {
        updates['preferences.notifications.marketing'] = notifications.marketing;
      }
    }

    // Add privacy preferences if provided
    if (privacy) {
      if (privacy.profileVisibility && ['public', 'friends', 'private'].includes(privacy.profileVisibility)) {
        updates['preferences.privacy.profileVisibility'] = privacy.profileVisibility;
      }
      if (typeof privacy.allowFriendRequests === 'boolean') {
        updates['preferences.privacy.allowFriendRequests'] = privacy.allowFriendRequests;
      }
    }

    // Check if there are any updates to apply
    if (Object.keys(updates).length === 0) {
      return errorResponse(res, 'No valid preferences provided to update', 400);
    }

    // Update user preferences
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('preferences firstName lastName email');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, 'User preferences updated successfully', {
      preferences: user.preferences,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Update bulk preferences error:', error);
    return errorResponse(res, 'Failed to update user preferences', 500);
  }
};

module.exports = {
  getSupportedLanguages,
  getUserLanguagePreference,
  updateUserLanguagePreference,
  getAllUserPreferences,
  updateBulkPreferences
};
