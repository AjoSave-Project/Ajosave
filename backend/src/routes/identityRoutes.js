const express = require('express');
const router = express.Router();
const {
  verifyBVNController,
  verifyNINController,
  getVerificationStatus,
} = require('../controllers/identityVerificationController');

/**
 * Identity Verification Routes
 * Base path: /api/identity
 */

/**
 * @route   POST /api/identity/verify-bvn
 * @desc    Verify BVN using Paystack
 * @access  Public (during registration)
 * @body    { userId, bvn }
 */
router.post('/verify-bvn', verifyBVNController);

/**
 * @route   POST /api/identity/verify-nin
 * @desc    Verify NIN
 * @access  Public (during registration)
 * @body    { userId, nin }
 */
router.post('/verify-nin', verifyNINController);

/**
 * @route   GET /api/identity/status/:userId
 * @desc    Get verification status for a user
 * @access  Public (during registration)
 */
router.get('/status/:userId', getVerificationStatus);

module.exports = router;
