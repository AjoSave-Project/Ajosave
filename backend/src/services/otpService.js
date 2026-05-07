const crypto = require('crypto');
const { sendOtpEmail, sendPasswordResetEmail } = require('./emailService');

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
 * Send OTP via Email
 * 
 * @param {string} email - User's email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} firstName - User's first name
 * @param {string} purpose - Purpose of OTP ('verification' or 'password-reset')
 * @returns {Promise<Object>} Result object
 */
const sendOtpViaEmail = async (email, otp, firstName, purpose = 'verification') => {
  try {
    let result;
    if (purpose === 'password-reset') {
      result = await sendPasswordResetEmail(email, otp, firstName);
    } else {
      result = await sendOtpEmail(email, otp, firstName);
    }

    return { success: true };
  } catch (emailErr) {
    console.error(`⚠️ Email delivery failed for ${email}:`, emailErr.message);
    throw emailErr;
  }
};

/**
 * Create and store OTP on user document, then send via email.
 * OTP is only sent via email - never returned in response.
 * 
 * @param {Object} user - User document
 * @param {string} purpose - Purpose of OTP ('verification' or 'password-reset')
 * @returns {Promise<Object>} Object with expiry
 */
const createAndSendOtp = async (user, purpose = 'verification') => {
  const otp = generateOtp();
  const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  user.otpCode = hashOtp(otp);
  user.otpExpiry = expiry;
  await user.save();

  try {
    await sendOtpViaEmail(user.email, otp, user.firstName, purpose);
    console.log(`✅ OTP sent successfully to ${user.email}`);
    return { expiry };
  } catch (emailErr) {
    console.error(`⚠️ Failed to send OTP email:`, emailErr.message);
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
