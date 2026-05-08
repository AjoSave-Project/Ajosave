const { resolveBVN, verifyNIN } = require('../services/paystackIdentityService');
const User = require('../models/Users');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

/**
 * Verify BVN
 * POST /api/identity/verify-bvn
 */
const verifyBVNController = async (req, res) => {
  try {
    const { userId, bvn } = req.body;

    // Validate required fields
    if (!userId || !bvn) {
      return sendError(res, 'User ID and BVN are required', 400);
    }

    // Validate BVN format
    if (!/^\d{11}$/.test(bvn)) {
      return sendError(res, 'Invalid BVN format. BVN must be 11 digits.', 400);
    }

    // Validate userId is a valid MongoDB ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendError(res, 'Invalid user ID format', 400);
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Check if BVN is already verified
    if (user.bvnVerified) {
      return sendSuccess(res, {
        verified: true,
        message: 'BVN already verified',
        data: {
          bvn: user.bvn,
          verifiedAt: user.bvnVerifiedAt,
        },
      });
    }

    // Verify BVN with Paystack
    console.log(`[Identity] Verifying BVN for user ${userId}`);
    const verificationResult = await resolveBVN(bvn);

    if (verificationResult.verified) {
      // Update user with verified BVN
      user.bvn = bvn;
      user.bvnVerified = true;
      user.bvnVerifiedAt = new Date();
      user.bvnData = {
        firstName: verificationResult.data?.firstName,
        lastName: verificationResult.data?.lastName,
        dateOfBirth: verificationResult.data?.dateOfBirth,
        phoneNumber: verificationResult.data?.phoneNumber,
      };
      await user.save();

      console.log(`[Identity] BVN verified successfully for user ${userId}`);

      return sendSuccess(res, {
        verified: true,
        bvn: bvn,
        firstName: verificationResult.data?.firstName,
        lastName: verificationResult.data?.lastName,
        verifiedAt: user.bvnVerifiedAt,
      }, 'BVN verified successfully');
    } else {
      console.log(`[Identity] BVN verification failed for user ${userId}: ${verificationResult.message}`);
      return sendError(res, verificationResult.message || 'BVN verification failed', 400);
    }
  } catch (error) {
    console.error('[Identity] BVN verification error:', error);
    return sendError(res, error.message || 'BVN verification failed', 500);
  }
};

/**
 * Verify NIN
 * POST /api/identity/verify-nin
 */
const verifyNINController = async (req, res) => {
  try {
    const { userId, nin } = req.body;

    // Validate required fields
    if (!userId || !nin) {
      return sendError(res, 'User ID and NIN are required', 400);
    }

    // Validate NIN format
    if (!/^\d{11}$/.test(nin)) {
      return sendError(res, 'Invalid NIN format. NIN must be 11 digits.', 400);
    }

    // Validate userId is a valid MongoDB ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendError(res, 'Invalid user ID format', 400);
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Check if NIN is already verified
    if (user.ninVerified) {
      return sendSuccess(res, {
        verified: true,
        nin: user.nin,
        verifiedAt: user.ninVerifiedAt,
      }, 'NIN already verified');
    }

    // Verify NIN
    console.log(`[Identity] Verifying NIN for user ${userId}`);
    const verificationResult = await verifyNIN(nin);

    if (verificationResult.verified) {
      // Update user with verified NIN
      user.nin = nin;
      user.ninVerified = true;
      user.ninVerifiedAt = new Date();
      user.ninData = {
        firstName: verificationResult.data?.firstName,
        lastName: verificationResult.data?.lastName,
        dateOfBirth: verificationResult.data?.dateOfBirth,
        phoneNumber: verificationResult.data?.phoneNumber,
      };
      await user.save();

      console.log(`[Identity] NIN verified successfully for user ${userId}`);

      return sendSuccess(res, {
        verified: true,
        nin: nin,
        firstName: verificationResult.data?.firstName,
        lastName: verificationResult.data?.lastName,
        verifiedAt: user.ninVerifiedAt,
      }, 'NIN verified successfully');
    } else {
      console.log(`[Identity] NIN verification failed for user ${userId}: ${verificationResult.message}`);
      
      // Check if third-party service is required
      if (verificationResult.requiresThirdParty) {
        return sendError(res, 'NIN verification requires additional setup. Please contact support.', 501);
      }
      
      return sendError(res, verificationResult.message || 'NIN verification failed', 400);
    }
  } catch (error) {
    console.error('[Identity] NIN verification error:', error);
    return sendError(res, error.message || 'NIN verification failed', 500);
  }
};

/**
 * Get verification status
 * GET /api/identity/status/:userId
 */
const getVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('bvnVerified ninVerified bvnVerifiedAt ninVerifiedAt');
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, {
      bvnVerified: user.bvnVerified || false,
      ninVerified: user.ninVerified || false,
      bvnVerifiedAt: user.bvnVerifiedAt,
      ninVerifiedAt: user.ninVerifiedAt,
    }, 'Verification status retrieved');
  } catch (error) {
    console.error('[Identity] Get status error:', error);
    return sendError(res, 'Failed to get verification status', 500);
  }
};

module.exports = {
  verifyBVNController,
  verifyNINController,
  getVerificationStatus,
};
