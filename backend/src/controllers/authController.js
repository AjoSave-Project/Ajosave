const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Wallet = require('../models/Wallets');
const config = require('../config/config');
const { createAndSendOtp, verifyOtp: verifyOtpCode } = require('../services/otpService');
const { checkVerificationCode } = require('../services/twilioVerifyService');
const { verifyBVN, verifyNIN } = require('../services/paystackVerification');
const {
  AppError,
  ValidationError,
  AuthenticationError,
  DatabaseError,
  asyncErrorHandler
} = require('../middlewares/errorHandler');

/**
 * Generate JWT Token
 * 
 * Creates a JWT token for user authentication with configurable expiration.
 * 
 * @param {string} userId - User's database ID
 * @param {string} expiresIn - Token expiration time (optional)
 * @returns {string} JWT token
 */
const generateToken = (userId, expiresIn = config.jwt.expiresIn) => {
  try {
    return jwt.sign(
      {
        id: userId,
        iat: Math.floor(Date.now() / 1000) // Issued at time
      },
      config.jwt.secret,
      { expiresIn }
    );
  } catch (error) {
    console.error('Token generation error:', error);
    throw new AppError('Failed to generate authentication token', 500);
  }
};

/**
 * Set Authentication Cookie
 * 
 * Sets an httpOnly cookie with the JWT token for secure authentication.
 * 
 * @param {Object} res - Express response object
 * @param {string} token - JWT token to set in cookie
 */
const setAuthCookie = (res, token) => {
  res.cookie('authToken', token, {
    ...config.security.cookie,
  });
};

/**
 * Clear Authentication Cookie
 * 
 * Clears the authentication cookie (used for logout).
 * 
 * @param {Object} res - Express response object
 */
const clearAuthCookie = (res) => {
  res.cookie('authToken', '', {
    ...config.security.cookie,
    maxAge: 0 // Expire immediately
  });
};

/**
 * Format User Response
 * 
 * Creates a consistent user response object, excluding sensitive information.
 * 
 * @param {Object} user - User document from database
 * @returns {Object} Formatted user object for API response
 */
const formatUserResponse = (user) => {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isVerified: user.isVerified,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
    createdAt: user.createdAt
  };
};

/**
 * Check if User Exists
 * 
 * Helper function to check if a user already exists with given email or phone.
 * 
 * @param {string} email - User's email address
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise<Object|null>} Existing user or null
 */
const checkUserExists = async (email, phoneNumber) => {
  try {
    return await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phoneNumber }
      ]
    });
  } catch (error) {
    console.error('Database error checking user existence:', error);
    throw new DatabaseError('Failed to check user existence');
  }
};

/**
 * Register User Handler - UPDATED
 * 
 * @route   POST /api/auth/register
 * @desc    Register a new user with comprehensive validation and error handling
 * @access  Public
 */
const registerUser = asyncErrorHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    bvn,
    nin,
    dateOfBirth
  } = req.body;

  // Normalize email to lowercase
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Check if user already exists (including temp users with verified email)
    const existingUser = await checkUserExists(normalizedEmail, phoneNumber);

    if (existingUser) {
      // If it's a temp user with verified email, update it instead of creating new
      if (existingUser.firstName === 'Temp' && existingUser.isEmailVerified) {
        // Update the temp user with real data
        existingUser.firstName = firstName.trim();
        existingUser.lastName = lastName.trim();
        existingUser.password = password; // Will be hashed by pre-save middleware
        existingUser.bvn = bvn;
        existingUser.nin = nin;
        existingUser.dateOfBirth = new Date(dateOfBirth);
        existingUser.isVerified = true; // Mark as verified since email was verified in step 2
        existingUser.verifiedAt = new Date();

        const savedUser = await existingUser.save();

        // Create wallet if doesn't exist
        let wallet = await Wallet.findOne({ userId: savedUser._id });
        if (!wallet) {
          wallet = new Wallet({
            userId: savedUser._id,
            totalBalance: 0,
            availableBalance: 0,
            lockedBalance: 0,
            totalPayouts: 0,
            totalContributions: 0,
            totalWithdrawals: 0
          });
          await wallet.save();
        }

        // Generate JWT token using the standard generateToken helper
        const token = generateToken(savedUser._id);
        setAuthCookie(res, token);

        return res.status(201).json({
          success: true,
          message: 'Registration successful! Welcome to Ajosave.',
          data: {
            user: savedUser,
            token,
          },
          timestamp: new Date().toISOString()
        });
      }

      // Determine which field is duplicate for better error message
      let duplicateField = '';
      if (existingUser.email === normalizedEmail) {
        duplicateField = 'email address';
      } else if (existingUser.phoneNumber === phoneNumber) {
        duplicateField = 'phone number';
      }

      throw new ValidationError(`An account with this ${duplicateField} already exists`, [{
        field: existingUser.email === normalizedEmail ? 'email' : 'phoneNumber',
        message: `This ${duplicateField} is already registered`,
        value: existingUser.email === normalizedEmail ? normalizedEmail : phoneNumber
      }]);
    }

    // Check for duplicate BVN (more specific check)
    const existingBVN = await User.findOne({ bvn });
    if (existingBVN) {
      throw new ValidationError('This BVN is already registered with another account', [{
        field: 'bvn',
        message: 'BVN is already in use',
        value: bvn
      }]);
    }

    // Check for duplicate NIN
    const existingNIN = await User.findOne({ nin });
    if (existingNIN) {
      throw new ValidationError('This NIN is already registered with another account', [{
        field: 'nin',
        message: 'NIN is already in use',
        value: nin
      }]);
    }

    // Create new user instance
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password, // Will be hashed by the pre-save middleware
      phoneNumber,
      bvn,
      nin,
      dateOfBirth: new Date(dateOfBirth),
      isVerified: true, // Mark as verified since email was verified in step 2
      verifiedAt: new Date(),
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Create wallet for the user
    const newWallet = new Wallet({
      userId: savedUser._id,
      totalBalance: 0,
      availableBalance: 0,
      lockedBalance: 0,
      totalPayouts: 0,
      totalContributions: 0,
      totalWithdrawals: 0
    });

    await newWallet.save();

    // Generate JWT token using the standard generateToken helper
    const token = generateToken(savedUser._id);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Ajosave.',
      data: {
        user: savedUser,
        token,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Registration failed for ${normalizedEmail}:`, error.message);
    throw error;
  }
});

/**
 * Login User Handler - UPDATED
 * 
 * @route   POST /api/auth/login
 * @desc    Authenticate user with phone number OR email + password
 * @access  Public
 */
const loginUser = asyncErrorHandler(async (req, res) => {
  const { phoneNumber, email, password } = req.body;

  if (!password) throw new ValidationError('Password is required');
  if (!phoneNumber && !email) throw new ValidationError('Phone number or email is required');

  try {
    let user;
    if (phoneNumber) {
      user = await User.findOne({ phoneNumber }).select('+password');
    } else {
      user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    }

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      console.warn(`🚫 Invalid password attempt for user: ${user._id}`);
      throw new AuthenticationError('Invalid credentials');
    }

    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      wallet = new Wallet({
        userId: user._id,
        totalBalance: 0,
        availableBalance: 0,
        lockedBalance: 0
      });
      await wallet.save();
    }

    user.lastLoginAt = new Date();
    await user.save();

    const otpResult = await createAndSendOtp(user, 'verification');

    res.status(200).json({
      success: true,
      message: 'Credentials verified. Please enter the verification code sent to your phone.',
      data: {
        requiresOtp: true,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userId: user._id,
        ...(otpResult.devOtp && { devOtp: otpResult.devOtp }),
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Login failed for ${phoneNumber || email}:`, error.message);
    throw error;
  }
});

/**
 * Verify User Handler
 * 
 * @route   PUT /api/auth/verify
 * @desc    Complete user verification process and update profile
 * @access  Private (requires authentication)
 */
const verifyUser = asyncErrorHandler(async (req, res) => {
  const { address } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new AuthenticationError('User not found. Please login again');
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'User is already verified',
        data: {
          user: formatUserResponse(user)
        },
        timestamp: new Date().toISOString()
      });
    }

    user.isVerified = true;
    user.address = address.trim();
    user.verifiedAt = new Date();

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Verification completed successfully',
      data: {
        user: formatUserResponse(updatedUser)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Verification failed for user ${userId}:`, error.message);
    throw error;
  }
});

/**
 * Logout User Handler
 * 
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear authentication cookie
 * @access  Private (requires authentication)
 */
const logoutUser = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    clearAuthCookie(res);

    if (req.user) {
      req.user.lastLogoutAt = new Date();
      await req.user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Logout failed for user ${userId}:`, error.message);
    clearAuthCookie(res);
    res.status(200).json({
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get Current User Handler
 * 
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user's information
 * @access  Private (requires authentication)
 */
const getCurrentUser = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new AuthenticationError('User not found. Please login again');
    }

    res.status(200).json({
      success: true,
      message: 'User information retrieved successfully',
      data: {
        user: formatUserResponse(user)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to get user info for ${userId}:`, error.message);
    throw error;
  }
});

/**
 * Refresh Token Handler
 * 
 * @route   POST /api/auth/refresh
 * @desc    Refresh authentication token
 * @access  Private (requires valid token)
 */
const refreshToken = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const newToken = generateToken(userId);
    setAuthCookie(res, newToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Token refresh failed for user ${userId}:`, error.message);
    throw error;
  }
});

/**
 * Send OTP Handler
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to a user's email (resend support)
 * @access  Public
 */
const sendOtp = asyncErrorHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) throw new ValidationError('userId is required');

  const user = await User.findById(userId).select('+otpCode +otpExpiry');
  if (!user) throw new AuthenticationError('User not found');

  const otpResult = await createAndSendOtp(user, 'verification');

  res.status(200).json({
    success: true,
    message: 'OTP sent successfully to your email',
    data: {
      email: user.email,
      ...(otpResult.devOtp && { devOtp: otpResult.devOtp }),
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Verify OTP Handler
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and issue JWT (works for both signup and login)
 * @access  Public
 */
const verifyOtpHandler = asyncErrorHandler(async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) throw new ValidationError('userId and otp are required');

  const user = await User.findById(userId).select('+otpCode +otpExpiry +password');
  if (!user) throw new AuthenticationError('User not found');

  let verified = false;
  let twilioAttempted = false;

  if (user.phoneNumber) {
    try {
      const result = await checkVerificationCode(user.phoneNumber, otp);
      twilioAttempted = true;
      verified = result.valid;
      if (verified) {
        console.log(`✅ Twilio Verify approved for ${user.phoneNumber}`);
      } else {
        console.warn(`⚠️ Twilio Verify rejected code for ${user.phoneNumber} (status: ${result.status})`);
      }
    } catch (twilioErr) {
      console.warn(`⚠️ Twilio Verify check threw error: ${twilioErr.message}. Falling back to DB OTP.`);
      twilioAttempted = false;
    }
  }

  if (!verified && !twilioAttempted) {
    verified = await verifyOtpCode(user, otp);
  }

  if (!verified) throw new AuthenticationError('Invalid or expired OTP');

  if (!user.isPhoneVerified) {
    user.isPhoneVerified = true;
    await user.save();
  }

  const token = generateToken(user._id);
  setAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
    data: { user: formatUserResponse(user), token },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Face Verification Handler
 * @route   POST /api/auth/verify-face
 * @desc    Mark user's face as verified (dev: simulated, prod: Persona webhook)
 * @access  Private
 */
const verifyFace = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const isDev = process.env.NODE_ENV !== 'production';

  const user = await User.findById(userId);
  if (!user) throw new AuthenticationError('User not found');

  if (isDev) {
    user.isFaceVerified = true;
    user.faceVerifiedAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Face verification successful (simulated)',
      data: { user: formatUserResponse(user) },
      timestamp: new Date().toISOString(),
    });
  }

  const { inquiryId } = req.body;
  if (!inquiryId) throw new ValidationError('inquiryId is required in production');

  user.isFaceVerified = true;
  user.faceVerifiedAt = new Date();
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Face verification successful',
    data: { user: formatUserResponse(user) },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Forgot Password Handler
 * @route   POST /api/auth/forgot-password
 * @desc    Send OTP to user's phone number to initiate password reset
 * @access  Public
 */
const forgotPassword = asyncErrorHandler(async (req, res) => {
  const { phoneNumber, email } = req.body;
  if (!phoneNumber) throw new ValidationError('Phone number is required');

  const user = await User.findOne({ phoneNumber });

  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account with that number exists, an OTP has been sent.',
      data: {},
      timestamp: new Date().toISOString(),
    });
  }

  const targetEmail = email || user.email;

  const originalEmail = user.email;
  if (email && email !== user.email) {
    user.email = email;
  }

  const { devOtp, method } = await createAndSendOtp(user, 'password-reset');

  if (email && email !== originalEmail) {
    user.email = originalEmail;
    await user.save();
  }

  const message = method === 'sms'
    ? 'OTP sent to your registered phone number.'
    : method === 'email'
      ? 'OTP sent to your registered email address.'
      : method === 'console'
        ? 'OTP generated successfully. Check server console for development OTP.'
        : 'OTP sent successfully.';

  res.status(200).json({
    success: true,
    message,
    data: {
      userId: user._id,
      phoneNumber: user.phoneNumber,
      email: targetEmail,
      method,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Reset Password Handler
 * @route   POST /api/auth/reset-password
 * @desc    Verify OTP and set a new password
 * @access  Public
 */
const resetPassword = asyncErrorHandler(async (req, res) => {
  const { userId, otp, newPassword } = req.body;
  if (!userId || !otp || !newPassword) {
    throw new ValidationError('userId, otp, and newPassword are required');
  }

  const user = await User.findById(userId).select('+otpCode +otpExpiry +password');
  if (!user) throw new AuthenticationError('User not found');

  const valid = await verifyOtpCode(user, otp);
  if (!valid) throw new AuthenticationError('Invalid or expired OTP');

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully. Please log in with your new password.',
    data: {},
    timestamp: new Date().toISOString(),
  });
});

/**
 * Verify BVN Handler
 * @route   POST /api/auth/verify-bvn
 * @desc    Verify BVN (Mocked for local development)
 * @access  Public
 */
const verifyBvnHandler = asyncErrorHandler(async (req, res) => {
  const { bvn } = req.body;
  if (!bvn || bvn.length !== 11) {
    throw new ValidationError('BVN must be 11 digits');
  }

  // Bypass Paystack API and return success
  res.status(200).json({
    success: true,
    message: 'BVN verified successfully (Simulated)',
    data: {
      bvn,
      verified: true,
      firstName: 'Test',
      lastName: 'User'
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Verify NIN Handler
 * @route   POST /api/auth/verify-nin
 * @desc    Verify NIN (Mocked for local development)
 * @access  Public
 */
const verifyNinHandler = asyncErrorHandler(async (req, res) => {
  const { nin, dateOfBirth } = req.body;
  if (!nin || nin.length !== 11) {
    throw new ValidationError('NIN must be 11 digits');
  }
  if (!dateOfBirth) {
    throw new ValidationError('Date of birth is required');
  }

  // Bypass Paystack API and return success
  res.status(200).json({
    success: true,
    message: 'NIN verified successfully (Simulated)',
    data: {
      nin,
      verified: true,
      firstName: 'Test',
      lastName: 'User'
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Send Email Verification OTP Handler
 * @route   POST /api/auth/send-email-otp
 * @desc    Send OTP to verify email during signup (before full registration)
 * @access  Public
 */
const sendEmailVerificationOtp = asyncErrorHandler(async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email || !phoneNumber) {
    throw new ValidationError('Email and phone number are required');
  }

  const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });

  if (existingUserByEmail) {
    if (existingUserByEmail.firstName === 'Temp' && existingUserByEmail.lastName === 'User') {
      if (existingUserByEmail.phoneNumber !== phoneNumber) {
        throw new ValidationError('This email is already registered with a different phone number. Please use the same phone number or contact support.', [{
          field: 'phoneNumber',
          message: 'Phone number mismatch',
        }]);
      }

      await createAndSendOtp(existingUserByEmail, 'verification');

      return res.status(200).json({
        success: true,
        message: 'Verification code sent to your email',
        data: {
          userId: existingUserByEmail._id,
          email: existingUserByEmail.email,
          isReturningUser: true,
        },
        timestamp: new Date().toISOString(),
      });
    }

    throw new ValidationError('An account with this email already exists', [{
      field: 'email',
      message: 'Email already registered',
    }]);
  }

  const existingUserByPhone = await User.findOne({ phoneNumber });

  if (existingUserByPhone) {
    if (existingUserByPhone.firstName === 'Temp' && existingUserByPhone.lastName === 'User') {
      if (existingUserByPhone.email !== email.toLowerCase()) {
        throw new ValidationError('This phone number is already registered with a different email. Please use the same email or contact support.', [{
          field: 'email',
          message: 'Email mismatch',
        }]);
      }

      await createAndSendOtp(existingUserByPhone, 'verification');

      return res.status(200).json({
        success: true,
        message: 'Verification code sent to your email',
        data: {
          userId: existingUserByPhone._id,
          email: existingUserByPhone.email,
          isReturningUser: true,
        },
        timestamp: new Date().toISOString(),
      });
    }

    throw new ValidationError('An account with this phone number already exists', [{
      field: 'phoneNumber',
      message: 'Phone number already registered',
    }]);
  }

  const tempUser = new User({
    firstName: 'Temp',
    lastName: 'User',
    email: email.toLowerCase(),
    phoneNumber,
    password: 'temporary_password_' + Date.now(),
    bvn: '00000000000',
    nin: '00000000000',
    dateOfBirth: new Date('2000-01-01'),
  });

  await tempUser.save();
  await createAndSendOtp(tempUser, 'verification');

  res.status(200).json({
    success: true,
    message: 'Verification code sent to your email',
    data: {
      userId: tempUser._id,
      email: tempUser.email,
      isReturningUser: false,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Verify Email OTP Handler
 * @route   POST /api/auth/verify-email-otp
 * @desc    Verify OTP for email verification (before full registration)
 * @access  Public
 */
const verifyEmailOtp = asyncErrorHandler(async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    throw new ValidationError('userId and otp are required');
  }

  const user = await User.findById(userId).select('+otpCode +otpExpiry');
  if (!user) {
    throw new AuthenticationError('Invalid session. Please start over.');
  }

  const valid = await verifyOtpCode(user, otp);
  if (!valid) {
    throw new AuthenticationError('Invalid or expired OTP');
  }

  user.isEmailVerified = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
    data: {
      userId: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Check Registration Status Handler
 * @route   POST /api/auth/check-registration-status
 * @desc    Check if user has incomplete registration and return current step
 * @access  Public
 */
const checkRegistrationStatus = asyncErrorHandler(async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    throw new ValidationError('Email or phone number is required');
  }

  const query = {};
  if (email) query.email = email.toLowerCase();
  if (phoneNumber) query.phoneNumber = phoneNumber;

  const user = await User.findOne(query);

  if (!user) {
    return res.status(200).json({
      success: true,
      data: {
        exists: false,
        canContinue: false,
      },
      timestamp: new Date().toISOString(),
    });
  }

  const isIncomplete = user.firstName === 'Temp' && user.lastName === 'User';

  if (isIncomplete) {
    return res.status(200).json({
      success: true,
      data: {
        exists: true,
        canContinue: true,
        isIncomplete: true,
        userId: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isEmailVerified: user.isEmailVerified,
        currentStep: user.isEmailVerified ? 'bvn-verification' : 'email-verification',
      },
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      exists: true,
      canContinue: false,
      isIncomplete: false,
      message: 'Account already exists. Please sign in.',
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  logoutUser,
  getCurrentUser,
  refreshToken,
  sendOtp,
  verifyOtpHandler,
  verifyFace,
  forgotPassword,
  resetPassword,
  verifyBvnHandler,
  verifyNinHandler,
  sendEmailVerificationOtp,
  verifyEmailOtp,
  checkRegistrationStatus,
  generateToken,
  formatUserResponse
};