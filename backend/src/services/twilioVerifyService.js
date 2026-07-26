const twilio = require('twilio');
const config = require('../config/config');

/**
 * Twilio Verify Service
 *
 * Uses Twilio Verify API to send and check OTPs via SMS.
 * Twilio handles OTP generation, delivery, expiry, and rate-limiting —
 * no need to store OTP hashes in the database for SMS flows.
 *
 * Required env vars:
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_VERIFY_SERVICE_SID  (from Twilio Console → Verify → Services)
 */

let client = null;

const getClient = () => {
  if (client) return client;
  const { accountSid, authToken } = config.sms.twilio;
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN).');
  }
  client = twilio(accountSid, authToken);
  return client;
};

const getServiceSid = () => {
  const sid = config.sms.twilio.verifyServiceSid;
  if (!sid) {
    throw new Error('TWILIO_VERIFY_SERVICE_SID is not configured.');
  }
  return sid;
};

/**
 * Send a verification code via Twilio Verify (SMS channel).
 *
 * @param {string} phoneNumber - E.164 format, e.g. +2348012345678
 * @returns {Promise<{success: boolean, status: string}>}
 */
const sendVerificationCode = async (phoneNumber) => {
  // Ensure E.164 format
  const to = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

  const verification = await getClient()
    .verify.v2.services(getServiceSid())
    .verifications.create({ to, channel: 'sms' });

  console.log(`✅ Twilio Verify: code sent to ${to} — status: ${verification.status}`);
  return { success: true, status: verification.status };
};

/**
 * Check a verification code via Twilio Verify.
 *
 * @param {string} phoneNumber - E.164 format
 * @param {string} code        - The OTP the user entered
 * @returns {Promise<{valid: boolean, status: string}>}
 */
const checkVerificationCode = async (phoneNumber, code) => {
  const to = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

  const result = await getClient()
    .verify.v2.services(getServiceSid())
    .verificationChecks.create({ to, code });

  console.log(`🔍 Twilio Verify check for ${to} — status: ${result.status}`);
  return { valid: result.status === 'approved', status: result.status };
};

module.exports = { sendVerificationCode, checkVerificationCode };
