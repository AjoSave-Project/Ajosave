const twilio = require('twilio');
const config = require('../config/config');

/**
 * SMS Service — powered by Twilio
 *
 * Env vars required:
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_PHONE_NUMBER  (your Twilio number, e.g. +12345678900)
 */

let twilioClient = null;

const getTwilioClient = () => {
  if (twilioClient) return twilioClient;

  const { accountSid, authToken } = config.sms.twilio;

  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.');
  }

  twilioClient = twilio(accountSid, authToken);
  return twilioClient;
};

/**
 * Send SMS using Twilio
 *
 * @param {string} phoneNumber - Recipient phone number in E.164 format (e.g. +2348012345678)
 * @param {string} message     - SMS body
 * @returns {Promise<{success: boolean, messageId: string}>}
 */
const sendSMS = async (phoneNumber, message) => {
  const { phoneNumber: fromNumber } = config.sms.twilio;

  if (!fromNumber) {
    throw new Error('Twilio sender number not configured. Set TWILIO_PHONE_NUMBER.');
  }

  // Ensure number is in E.164 format (Twilio requirement)
  const to = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

  try {
    const client = getTwilioClient();
    const msg = await client.messages.create({
      body: message,
      from: fromNumber,
      to,
    });

    console.log(`✅ SMS sent via Twilio to ${to} — SID: ${msg.sid}`);
    return { success: true, messageId: msg.sid };
  } catch (error) {
    console.error(`❌ Twilio SMS failed for ${to}:`, error.message);
    throw error;
  }
};

/**
 * Send an OTP SMS
 *
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} otp         - 6-digit OTP code
 * @param {string} firstName   - User's first name
 * @param {string} purpose     - 'verification' | 'password-reset'
 */
const sendOtpSMS = async (phoneNumber, otp, firstName, purpose = 'verification') => {
  let message;

  if (purpose === 'password-reset') {
    message = `Hi ${firstName}, your AjoSave password reset code is: ${otp}. Valid for 10 minutes. Do not share this code.`;
  } else {
    message = `Hi ${firstName}, your AjoSave verification code is: ${otp}. Valid for 10 minutes. Welcome to AjoSave!`;
  }

  return await sendSMS(phoneNumber, message);
};

/**
 * Send a general notification SMS
 *
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} message     - Message content
 */
const sendNotificationSMS = async (phoneNumber, message) => {
  return await sendSMS(phoneNumber, message);
};

module.exports = { sendSMS, sendOtpSMS, sendNotificationSMS };
