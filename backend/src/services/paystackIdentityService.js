const axios = require('axios');

/**
 * Paystack Identity Verification Service
 * 
 * Handles BVN and NIN verification using Paystack Identity API
 * Documentation: https://paystack.com/docs/identity-verification/
 */

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Axios instance with Paystack configuration
const paystackClient = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

/**
 * Verify BVN (Bank Verification Number)
 * 
 * @param {string} bvn - 11-digit BVN
 * @param {Object} options - Additional verification options
 * @param {string} options.firstName - First name to match
 * @param {string} options.lastName - Last name to match
 * @param {string} options.dateOfBirth - Date of birth in YYYY-MM-DD format
 * @param {string} options.phoneNumber - Phone number to match
 * @returns {Promise<Object>} Verification result
 */
const verifyBVN = async (bvn, options = {}) => {
  try {
    // Validate BVN format
    if (!bvn || !/^\d{11}$/.test(bvn)) {
      throw new Error('Invalid BVN format. BVN must be 11 digits.');
    }

    console.log(`[Paystack] Verifying BVN: ${bvn.substring(0, 3)}********`);

    // Paystack BVN verification endpoint
    const response = await paystackClient.post('/bvn/match', {
      bvn,
      account_number: options.accountNumber,
      bank_code: options.bankCode,
      first_name: options.firstName,
      last_name: options.lastName,
      // Note: Paystack may require additional fields depending on your verification level
    });

    if (response.data.status) {
      console.log('[Paystack] BVN verification successful');
      return {
        success: true,
        verified: true,
        message: 'BVN verified successfully',
        data: {
          bvn: bvn,
          firstName: response.data.data?.first_name,
          lastName: response.data.data?.last_name,
          dateOfBirth: response.data.data?.dob,
          phoneNumber: response.data.data?.mobile,
          isMatch: response.data.data?.is_blacklisted === false,
        },
      };
    } else {
      console.log('[Paystack] BVN verification failed:', response.data.message);
      return {
        success: false,
        verified: false,
        message: response.data.message || 'BVN verification failed',
        data: null,
      };
    }
  } catch (error) {
    console.error('[Paystack] BVN verification error:', error.response?.data || error.message);
    
    // Handle specific Paystack errors
    if (error.response?.status === 400) {
      return {
        success: false,
        verified: false,
        message: error.response.data?.message || 'Invalid BVN or verification details',
        data: null,
      };
    }

    if (error.response?.status === 401) {
      throw new Error('Paystack authentication failed. Please check API keys.');
    }

    if (error.response?.status === 429) {
      return {
        success: false,
        verified: false,
        message: 'Too many verification requests. Please try again later.',
        data: null,
      };
    }

    throw new Error(error.response?.data?.message || 'BVN verification service unavailable');
  }
};

/**
 * Resolve BVN (Get BVN details without matching)
 * 
 * @param {string} bvn - 11-digit BVN
 * @returns {Promise<Object>} BVN details
 */
const resolveBVN = async (bvn) => {
  try {
    // Validate BVN format
    if (!bvn || !/^\d{11}$/.test(bvn)) {
      throw new Error('Invalid BVN format. BVN must be 11 digits.');
    }

    console.log(`[Paystack] Resolving BVN: ${bvn.substring(0, 3)}********`);

    // Paystack BVN resolve endpoint
    const response = await paystackClient.get(`/bank/resolve_bvn/${bvn}`);

    if (response.data.status) {
      console.log('[Paystack] BVN resolved successfully');
      return {
        success: true,
        verified: true,
        message: 'BVN resolved successfully',
        data: {
          bvn: bvn,
          firstName: response.data.data?.first_name,
          lastName: response.data.data?.last_name,
          dateOfBirth: response.data.data?.dob,
          phoneNumber: response.data.data?.mobile,
          formattedDob: response.data.data?.formatted_dob,
        },
      };
    } else {
      return {
        success: false,
        verified: false,
        message: response.data.message || 'BVN not found',
        data: null,
      };
    }
  } catch (error) {
    console.error('[Paystack] BVN resolve error:', error.response?.data || error.message);
    
    if (error.response?.status === 400 || error.response?.status === 404) {
      return {
        success: false,
        verified: false,
        message: 'BVN not found or invalid',
        data: null,
      };
    }

    if (error.response?.status === 401) {
      throw new Error('Paystack authentication failed. Please check API keys.');
    }

    throw new Error(error.response?.data?.message || 'BVN resolution service unavailable');
  }
};

/**
 * Verify NIN (National Identification Number)
 * 
 * Note: Paystack may not directly support NIN verification.
 * You may need to use alternative services like:
 * - Dojah (https://dojah.io)
 * - Smile Identity (https://smileidentity.com)
 * - Youverify (https://youverify.co)
 * 
 * @param {string} nin - 11-digit NIN
 * @param {Object} options - Additional verification options
 * @returns {Promise<Object>} Verification result
 */
const verifyNIN = async (nin, options = {}) => {
  try {
    // Validate NIN format
    if (!nin || !/^\d{11}$/.test(nin)) {
      throw new Error('Invalid NIN format. NIN must be 11 digits.');
    }

    console.log(`[Paystack] NIN verification requested: ${nin.substring(0, 3)}********`);

    // Note: Paystack doesn't have a direct NIN verification endpoint
    // You'll need to integrate with a third-party service
    
    // For now, return a placeholder response
    // TODO: Integrate with NIN verification service (Dojah, Smile Identity, etc.)
    
    console.warn('[Paystack] NIN verification not implemented. Please integrate with a third-party service.');
    
    return {
      success: false,
      verified: false,
      message: 'NIN verification service not configured. Please contact support.',
      data: null,
      requiresThirdParty: true,
    };
  } catch (error) {
    console.error('[Paystack] NIN verification error:', error.message);
    throw new Error('NIN verification service unavailable');
  }
};

/**
 * Verify Account Number with BVN
 * Useful for confirming that a bank account belongs to the BVN holder
 * 
 * @param {string} accountNumber - Bank account number
 * @param {string} bankCode - Bank code (e.g., '058' for GTBank)
 * @param {string} bvn - 11-digit BVN
 * @returns {Promise<Object>} Verification result
 */
const verifyAccountWithBVN = async (accountNumber, bankCode, bvn) => {
  try {
    console.log(`[Paystack] Verifying account ${accountNumber} with BVN`);

    const response = await paystackClient.post('/bvn/match', {
      bvn,
      account_number: accountNumber,
      bank_code: bankCode,
    });

    if (response.data.status) {
      return {
        success: true,
        verified: true,
        message: 'Account verified with BVN',
        data: {
          accountNumber,
          bankCode,
          accountName: response.data.data?.account_name,
          isMatch: response.data.data?.is_blacklisted === false,
        },
      };
    } else {
      return {
        success: false,
        verified: false,
        message: response.data.message || 'Account verification failed',
        data: null,
      };
    }
  } catch (error) {
    console.error('[Paystack] Account verification error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Account verification service unavailable');
  }
};

/**
 * Get list of supported banks
 * Useful for bank selection in the UI
 * 
 * @returns {Promise<Array>} List of banks
 */
const getBanks = async () => {
  try {
    const response = await paystackClient.get('/bank');
    
    if (response.data.status) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      throw new Error('Failed to fetch banks');
    }
  } catch (error) {
    console.error('[Paystack] Get banks error:', error.response?.data || error.message);
    throw new Error('Failed to fetch banks list');
  }
};

module.exports = {
  verifyBVN,
  resolveBVN,
  verifyNIN,
  verifyAccountWithBVN,
  getBanks,
};
