const express = require('express');
const router = express.Router();
const {
  upload,
  verifyFaceWithBVNController,
  verifyFaceWithNINController,
  getFaceVerificationStatus,
} = require('../controllers/faceVerificationController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * Face Verification Routes
 * 
 * All routes require authentication
 */

// Verify face with BVN
router.post(
  '/verify-bvn',
  protect,
  upload.single('faceImage'),
  verifyFaceWithBVNController
);

// Verify face with NIN
router.post(
  '/verify-nin',
  protect,
  upload.single('faceImage'),
  verifyFaceWithNINController
);

// Get face verification status
router.get(
  '/status/:userId',
  protect,
  getFaceVerificationStatus
);

module.exports = router;
