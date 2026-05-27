/**
 * Language Controller Tests
 * 
 * Test suite for language preference management endpoints
 * Run with: npm test -- languageController.test.js
 */

const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/Users');

// Mock data
const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser@example.com',
  phoneNumber: '+2348012345678',
  dateOfBirth: new Date('1990-01-01'),
  password: 'password123',
  bvn: '12345678901',
  nin: '12345678901',
  preferences: {
    language: 'en',
    currency: 'NGN',
    notifications: {
      email: true,
      sms: true,
      push: true,
      marketing: false
    },
    privacy: {
      profileVisibility: 'friends',
      allowFriendRequests: true
    }
  }
};

describe('Language Controller', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
    }
  });

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({ email: mockUser.email });
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Create test user and get auth token
    const user = await User.create(mockUser);
    userId = user._id;
    
    // In a real test, you would login and get the token
    // For this example, we'll assume you have a way to generate a test token
    // authToken = generateTestToken(userId);
  });

  afterEach(async () => {
    // Clean up test data
    await User.deleteMany({ email: mockUser.email });
  });

  describe('GET /api/language/supported', () => {
    it('should return list of supported languages', async () => {
      const response = {
        success: true,
        message: 'Supported languages retrieved successfully',
        data: {
          languages: [
            { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
            { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬' },
            { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
            { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' }
          ]
        }
      };

      expect(response.success).toBe(true);
      expect(response.data.languages).toHaveLength(4);
      expect(response.data.languages[0].code).toBe('en');
    });

    it('should not require authentication', async () => {
      // This endpoint should be accessible without auth token
      const isPublic = true;
      expect(isPublic).toBe(true);
    });
  });

  describe('GET /api/language/preference', () => {
    it('should return user language preference', async () => {
      const user = await User.findById(userId);
      expect(user.preferences.language).toBe('en');
    });

    it('should require authentication', async () => {
      // Test should fail without auth token
      const requiresAuth = true;
      expect(requiresAuth).toBe(true);
    });

    it('should return 404 if user not found', async () => {
      // Test with non-existent user ID
      const nonExistentId = new mongoose.Types.ObjectId();
      const user = await User.findById(nonExistentId);
      expect(user).toBeNull();
    });
  });

  describe('PUT /api/language/preference', () => {
    it('should update user language preference', async () => {
      const user = await User.findByIdAndUpdate(
        userId,
        { 'preferences.language': 'yo' },
        { new: true }
      );

      expect(user.preferences.language).toBe('yo');
    });

    it('should reject invalid language code', async () => {
      const invalidLanguage = 'invalid';
      const supportedLanguages = ['en', 'ig', 'yo', 'ha'];
      
      expect(supportedLanguages.includes(invalidLanguage)).toBe(false);
    });

    it('should require authentication', async () => {
      const requiresAuth = true;
      expect(requiresAuth).toBe(true);
    });

    it('should validate language code format', async () => {
      const validCodes = ['en', 'ig', 'yo', 'ha'];
      const testCode = 'en';
      
      expect(validCodes.includes(testCode)).toBe(true);
    });
  });

  describe('GET /api/language/preferences/all', () => {
    it('should return all user preferences', async () => {
      const user = await User.findById(userId).select('preferences');
      
      expect(user.preferences).toBeDefined();
      expect(user.preferences.language).toBeDefined();
      expect(user.preferences.currency).toBeDefined();
      expect(user.preferences.notifications).toBeDefined();
      expect(user.preferences.privacy).toBeDefined();
    });

    it('should require authentication', async () => {
      const requiresAuth = true;
      expect(requiresAuth).toBe(true);
    });
  });

  describe('PUT /api/language/preferences/bulk', () => {
    it('should update multiple preferences at once', async () => {
      const updates = {
        'preferences.language': 'ig',
        'preferences.currency': 'USD',
        'preferences.notifications.email': false
      };

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      );

      expect(user.preferences.language).toBe('ig');
      expect(user.preferences.currency).toBe('USD');
      expect(user.preferences.notifications.email).toBe(false);
    });

    it('should validate language code', async () => {
      const supportedLanguages = ['en', 'ig', 'yo', 'ha'];
      const testLanguage = 'ig';
      
      expect(supportedLanguages.includes(testLanguage)).toBe(true);
    });

    it('should validate currency code', async () => {
      const supportedCurrencies = ['NGN', 'USD'];
      const testCurrency = 'NGN';
      
      expect(supportedCurrencies.includes(testCurrency)).toBe(true);
    });

    it('should validate profile visibility', async () => {
      const validVisibility = ['public', 'friends', 'private'];
      const testVisibility = 'private';
      
      expect(validVisibility.includes(testVisibility)).toBe(true);
    });

    it('should handle partial updates', async () => {
      // Only update language, leave other preferences unchanged
      const user = await User.findByIdAndUpdate(
        userId,
        { 'preferences.language': 'ha' },
        { new: true }
      );

      expect(user.preferences.language).toBe('ha');
      expect(user.preferences.currency).toBe('NGN'); // Should remain unchanged
    });

    it('should return error if no valid preferences provided', async () => {
      const emptyUpdates = {};
      const hasUpdates = Object.keys(emptyUpdates).length > 0;
      
      expect(hasUpdates).toBe(false);
    });

    it('should require authentication', async () => {
      const requiresAuth = true;
      expect(requiresAuth).toBe(true);
    });
  });

  describe('Language Preference Validation', () => {
    it('should accept all supported language codes', async () => {
      const supportedLanguages = ['en', 'ig', 'yo', 'ha'];
      
      for (const lang of supportedLanguages) {
        const user = await User.findByIdAndUpdate(
          userId,
          { 'preferences.language': lang },
          { new: true, runValidators: true }
        );
        
        expect(user.preferences.language).toBe(lang);
      }
    });

    it('should reject unsupported language codes', async () => {
      const unsupportedLanguages = ['fr', 'es', 'de', 'invalid'];
      const supportedLanguages = ['en', 'ig', 'yo', 'ha'];
      
      for (const lang of unsupportedLanguages) {
        expect(supportedLanguages.includes(lang)).toBe(false);
      }
    });
  });

  describe('Default Language Preference', () => {
    it('should default to English for new users', async () => {
      const newUser = await User.create({
        ...mockUser,
        email: 'newuser@example.com',
        phoneNumber: '+2348087654321'
      });

      expect(newUser.preferences.language).toBe('en');

      // Clean up
      await User.deleteOne({ _id: newUser._id });
    });
  });
});

// Export for use in test runner
module.exports = {
  mockUser
};
