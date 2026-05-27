const config = require('../config/config');

// Use node-fetch for Node.js environments
let fetch;
try {
  // Try to use global fetch first (available in newer Node.js versions)
  fetch = globalThis.fetch;
  if (!fetch) {
    // Fallback to node-fetch for older Node.js versions
    const nodeFetch = require('node-fetch');
    fetch = nodeFetch.default || nodeFetch;
  }
} catch (e) {
  console.warn('⚠️ No fetch implementation available. SMS service will not work.');
}

/**
 * SMS Service for sending OTP via SMS
 * 
 * This service handles sending SMS messages for OTP verification.
 * Currently configured for Termii SMS service (popular in Nigeria).
 * 
 * To enable SMS functionality:
 * 1. Sign up for Termii account at https://termii.com
 * 2. Add your API key to environment variables as TERMII_API_KEY
 * 3. Add your sender ID as TERMII_SENDER_ID
 */

const TERMII_BASE_URL = 'https://api.ng.termii.com/api';

/**
 * Send SMS using Termii API
 * 
 * @param {string} phoneNumber - Recipient phone number (e.g., +2348012345678)
 * @param {string} message - SMS message content
 * @returns {Promise<Object>} Result object
 */
const sendSMS = async (phoneNumber, message) => {
  // Check if fetch is available
  if (!fetch) {
    console.warn('⚠️ Fetch not available. Skipping SMS send.');
    throw new Error('SMS service not available. Please contact support.');
  }

  // Check if SMS is configured
  if (!config.sms?.termii?.apiKey) {
    console.warn('⚠️ SMS service not configured. Skipping SMS send.');
    throw new Error('SMS service not configured. Please contact support.');
  }

  try {
    const payload = {
      to: phoneNumber,
      from: config.sms.termii.senderId || 'AjoSave',
      sms: message,
      type: 'plain',
      api_key: config.sms.termii.apiKey,
      channel: 'generic',
    };

    const response = await fetch(`${TERMII_BASE_URL}/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send SMS');
    }

    console.log(`✅ SMS sent successfully to ${phoneNumber}`);
    return { success: true, messageId: result.message_id };
  } catch (error) {
    console.error(`❌ SMS send failed for ${phoneNumber}:`, error.message);
    throw error;
  }
};

/**
 * Send OTP SMS
 * 
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} otp - 6-digit OTP code
 * @param {string} firstName - User's first name
 * @param {string} purpose - Purpose of OTP ('verification' or 'password-reset')
 * @returns {Promise<Object>} Result object
 */
const sendOtpSMS = async (phoneNumber, otp, firstName, purpose = 'verification') => {
  let message;
  
  if (purpose === 'password-reset') {
    message = `Hi ${firstName}, your AjoSave password reset code is: ${otp}. This code expires in 10 minutes. Do not share this code with anyone.`;
  } else {
    message = `Hi ${firstName}, your AjoSave verification code is: ${otp}. This code expires in 10 minutes. Welcome to AjoSave!`;
  }

  return await sendSMS(phoneNumber, message);
};

/**
 * Send general SMS notification
 * 
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} message - Message content
 * @returns {Promise<Object>} Result object
 */
const sendNotificationSMS = async (phoneNumber, message) => {
  return await sendSMS(phoneNumber, message);
};

module.exports = {
  sendSMS,
  sendOtpSMS,
  sendNotificationSMS,
};