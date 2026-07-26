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
    // httpOnly: true,     // Already set in config
    // secure: true,       // Already set in config for production
    // sameSite: 'strict', // Already set in config
    // maxAge: 3600000     // Already set in config (1 hour)
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
    // Note: BVN, NIN, and password are intentionally excluded for security
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
    // Log registration error
    console.error(`❌ Registration failed for ${normalizedEmail}:`, error.message);
    
    // Re-throw the error to be handled by global error handler
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
    // Find user by phone number or email
    let user;
    if (phoneNumber) {
      user = await User.findOne({ phoneNumber }).select('+password');
    } else {
      user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    }

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Verify password using the method defined in User model
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      console.warn(`🚫 Invalid password attempt for user: ${user._id}`);
      throw new AuthenticationError('Invalid credentials');
    }

    // NEW: Check if wallet exists, create if it doesn't
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

    // Update last login time (optional)
    user.lastLoginAt = new Date();
    await user.save();

    // Send OTP for 2FA
    const otpResult = await createAndSendOtp(user, 'verification');


    res.status(200).json({
      success: true,
      message: 'Credentials verified. Please enter the verification code sent to your phone.',
      data: {
        requiresOtp: true,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userId: user._id,
        // Only included in development builds for the dev auto-fill banner
        ...(otpResult.devOtp && { devOtp: otpResult.devOtp }),
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Log login error
    console.error(`❌ Login failed for ${phoneNumber || email}:`, error.message);
    
    // Re-throw the error to be handled by global error handler
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
    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      throw new AuthenticationError('User not found. Please login again');
    }

    // Check if user is already verified
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

    // Update user verification status and address
    user.isVerified = true;
    user.address = address.trim();
    user.verifiedAt = new Date();

    // Save updated user
    const updatedUser = await user.save();

    // Log successful verification


    // Send success response
    res.status(200).json({
      success: true,
      message: 'Verification completed successfully',
      data: {
        user: formatUserResponse(updatedUser)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Log verification error
    console.error(`❌ Verification failed for user ${userId}:`, error.message);
    
    // Re-throw the error to be handled by global error handler
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
    // Clear authentication cookie
    clearAuthCookie(res);

    // Optionally update last logout time
    if (req.user) {
      req.user.lastLogoutAt = new Date();
      await req.user.save();
    }

    // Log successful logout


    // Send success response
    res.status(200).json({
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Log logout error
    console.error(`❌ Logout failed for user ${userId}:`, error.message);
    
    // Even if there's an error, clear the cookie and respond successfully
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
    // Get user from database (req.user might be outdated)
    const user = await User.findById(userId);

    if (!user) {
      throw new AuthenticationError('User not found. Please login again');
    }

    // Send user information
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
    // Generate new token
    const newToken = generateToken(userId);

    // Set new authentication cookie
    setAuthCookie(res, newToken);



    // Send success response
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

  // If user has a phone number, try Twilio Verify first (SMS flow)
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
      // Twilio service error (network, config, trial restrictions) — fall back to DB hash
      console.warn(`⚠️ Twilio Verify check threw error: ${twilioErr.message}. Falling back to DB OTP.`);
      twilioAttempted = false; // treat as if SMS wasn't attempted so we don't double-penalise
    }
  }

  // Fallback to locally-stored hash — used when:
  //  a) no phone number on account, or
  //  b) Twilio threw a service error (not a wrong-code rejection)
  if (!verified && !twilioAttempted) {
    verified = await verifyOtpCode(user, otp);
  }

  if (!verified) throw new AuthenticationError('Invalid or expired OTP');

  // Mark phone as verified
  if (!user.isPhoneVerified) {
    user.isPhoneVerified = true;
    await user.save();
  }

  // Issue token
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
    // Dev simulation — mark as verified immediately
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

  // Production: This endpoint is called by Persona webhook after real verification
  // The Persona inquiry ID would be validated here
  const { inquiryId } = req.body;
  if (!inquiryId) throw new ValidationError('inquiryId is required in production');

  // TODO: Validate inquiryId with Persona API before marking verified
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

  // Always respond with success to prevent phone number enumeration
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account with that number exists, an OTP has been sent.',
      data: {},
      timestamp: new Date().toISOString(),
    });
  }

  // Use provided email if available, otherwise use user's registered email
  const targetEmail = email || user.email;
  
  // Temporarily update user email if a different email was provided
  const originalEmail = user.email;
  if (email && email !== user.email) {
    user.email = email;
  }

  const { devOtp, method } = await createAndSendOtp(user, 'password-reset');

  // Restore original email if it was temporarily changed
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
      method, // Include delivery method so frontend knows where user should check
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
 * @desc    Verify BVN using Paystack API
 * @access  Public
 */
const verifyBvnHandler = asyncErrorHandler(async (req, res) => {
  const { bvn } = req.body;
  if (!bvn || bvn.length !== 11) {
    throw new ValidationError('BVN must be 11 digits');
  }

  const result = await verifyBVN(bvn);

  if (!result.verified) {
    throw new ValidationError('BVN verification failed: ' + result.message);
  }

  res.status(200).json({
    success: true,
    message: 'BVN verified successfully',
    data: result.data,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Verify NIN Handler
 * @route   POST /api/auth/verify-nin
 * @desc    Verify NIN using Paystack API
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

  const result = await verifyNIN(nin, dateOfBirth);

  if (!result.verified) {
    throw new ValidationError('NIN verification failed: ' + result.message);
  }

  res.status(200).json({
    success: true,
    message: 'NIN verified successfully',
    data: result.data,
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

  // Check if user already exists with this email
  const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
  
  if (existingUserByEmail) {
    // If it's an incomplete registration (temp user)
    if (existingUserByEmail.firstName === 'Temp' && existingUserByEmail.lastName === 'User') {
      // Verify the phone number matches
      if (existingUserByEmail.phoneNumber !== phoneNumber) {
        throw new ValidationError('This email is already registered with a different phone number. Please use the same phone number or contact support.', [{
          field: 'phoneNumber',
          message: 'Phone number mismatch',
        }]);
      }
      
      // Resend OTP to existing temp user
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
    
    // If it's a complete registration, return error
    throw new ValidationError('An account with this email already exists', [{
      field: 'email',
      message: 'Email already registered',
    }]);
  }

  // Check if user already exists with this phone number
  const existingUserByPhone = await User.findOne({ phoneNumber });
  
  if (existingUserByPhone) {
    // If it's an incomplete registration (temp user)
    if (existingUserByPhone.firstName === 'Temp' && existingUserByPhone.lastName === 'User') {
      // Verify the email matches
      if (existingUserByPhone.email !== email.toLowerCase()) {
        throw new ValidationError('This phone number is already registered with a different email. Please use the same email or contact support.', [{
          field: 'email',
          message: 'Email mismatch',
        }]);
      }
      
      // Resend OTP to existing temp user
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
    
    // If it's a complete registration, return error
    throw new ValidationError('An account with this phone number already exists', [{
      field: 'phoneNumber',
      message: 'Phone number already registered',
    }]);
  }

  // Create a temporary user document for OTP verification
  const tempUser = new User({
    firstName: 'Temp',
    lastName: 'User',
    email: email.toLowerCase(),
    phoneNumber,
    password: 'temporary_password_' + Date.now(), // Will be replaced during actual registration
    bvn: '00000000000', // Placeholder
    nin: '00000000000', // Placeholder
    dateOfBirth: new Date('2000-01-01'), // Placeholder
  });

  await tempUser.save();

  // Send OTP
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

  // Mark email as verified
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

  // Check if it's an incomplete registration
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

  // Complete registration exists
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
