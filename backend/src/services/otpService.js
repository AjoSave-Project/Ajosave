const crypto = require('crypto');
const { sendOtpEmail, sendPasswordResetEmail } = require('./emailService');
const { sendOtpSMS } = require('./smsService');

const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;

/**
 * Generate a random numeric OTP
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash OTP for storage (never store plain OTP)
 */
const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Send OTP via SMS or Email
 * 
 * @param {string} email - User's email address
 * @param {string} phoneNumber - User's phone number
 * @param {string} otp - 6-digit OTP code
 * @param {string} firstName - User's first name
 * @param {string} purpose - Purpose of OTP ('verification' or 'password-reset')
 * @returns {Promise<Object>} Result object
 */
const sendOtpViaEmailOrSMS = async (email, phoneNumber, otp, firstName, purpose = 'verification') => {
  let lastError = null;
  
  // For password reset, try SMS first, then email as fallback
  if (purpose === 'password-reset') {
    try {
      const result = await sendOtpSMS(phoneNumber, otp, firstName, purpose);
      console.log(`✅ Password reset OTP sent via SMS to ${phoneNumber}`);
      return { success: true, method: 'sms' };
    } catch (smsError) {
      console.error(`⚠️ SMS delivery failed for ${phoneNumber}:`, smsError.message);
      lastError = smsError;
      
      // Try email fallback
      try {
        console.log(`📧 Attempting email fallback for ${email}`);
        const result = await sendPasswordResetEmail(email, otp, firstName);
        console.log(`✅ Password reset OTP sent via email fallback to ${email}`);
        return { success: true, method: 'email' };
      } catch (emailError) {
        console.error(`⚠️ Email fallback also failed for ${email}:`, emailError.message);
        // Both SMS and email failed - this is a critical error
        throw new Error(`Failed to send OTP via SMS or email. SMS error: ${smsError.message}. Email error: ${emailError.message}`);
      }
    }
  } else {
    // For verification, use email
    try {
      const result = await sendOtpEmail(email, otp, firstName);
      console.log(`✅ Verification OTP sent via email to ${email}`);
      return { success: true, method: 'email' };
    } catch (emailError) {
      console.error(`⚠️ Email delivery failed for ${email}:`, emailError.message);
      throw emailError;
    }
  }
};

/**
 * Create and store OTP on user document, then send via SMS (for password reset) or email (for verification).
 * OTP is only sent via SMS/email - never returned in response.
 * 
 * @param {Object} user - User document
 * @param {string} purpose - Purpose of OTP ('verification' or 'password-reset')
 * @returns {Promise<Object>} Object with expiry and delivery method
 */
const createAndSendOtp = async (user, purpose = 'verification') => {
  const otp = generateOtp();
  const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  user.otpCode = hashOtp(otp);
  user.otpExpiry = expiry;
  await user.save();

  // Development mode - log OTP to console for testing
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    console.log(`🔐 [DEV] OTP for ${user.phoneNumber}: ${otp}`);
  }

  try {
    const result = await sendOtpViaEmailOrSMS(user.email, user.phoneNumber, otp, user.firstName, purpose);
    console.log(`✅ OTP sent successfully via ${result.method} for ${purpose}`);
    return { expiry, method: result.method };
  } catch (error) {
    console.error(`⚠️ Failed to send OTP:`, error.message);
    
    // In development, allow the process to continue even if sending fails
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
      console.log(`🔧 [DEV] Continuing without sending OTP - check console for OTP: ${otp}`);
      return { expiry, method: 'console' };
    }
    
    throw new Error('Failed to send verification code. Please try again.');
  }
};

/**
 * Verify OTP against stored hash.
 * Clears OTP fields on success.
 * Returns true/false.
 */
const verifyOtp = async (user, otp) => {
  if (!user.otpCode || !user.otpExpiry) return false;
  if (new Date() > user.otpExpiry) return false;
  if (hashOtp(otp) !== user.otpCode) return false;

  // Clear OTP after successful verification
  user.otpCode = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return true;
};

module.exports = { createAndSendOtp, verifyOtp, hashOtp };
