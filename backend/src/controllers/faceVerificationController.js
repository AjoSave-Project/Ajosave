const { verifyFaceWithBVN, verifyFaceWithNIN, performLivenessCheck } = require('../services/faceVerificationService');
const User = require('../models/Users');
const { successResponse, errorResponse } = require('../utils/responseHelpers');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/faces');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `face-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
});

/**
 * Upload and verify face with BVN
 * POST /api/face/verify-bvn
 */
const verifyFaceWithBVNController = async (req, res) => {
  let uploadedFilePath = null;

  try {
    const { userId, bvn } = req.body;

    // Validate required fields
    if (!userId || !bvn) {
      return errorResponse(res, 'User ID and BVN are required', 400);
    }

    // Check if file was uploaded
    if (!req.file) {
      return errorResponse(res, 'Face image is required', 400);
    }

    uploadedFilePath = req.file.path;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Check if BVN matches
    if (user.bvn !== bvn) {
      return errorResponse(res, 'BVN does not match user record', 400);
    }

    // Check if BVN is verified
    if (!user.bvnVerified) {
      return errorResponse(res, 'BVN must be verified before face verification', 400);
    }

    // Perform liveness check
    console.log(`[FaceVerification] Performing liveness check for user ${userId}`);
    const livenessResult = await performLivenessCheck(uploadedFilePath);
    
    if (!livenessResult.isLive) {
      return errorResponse(res, 'Liveness check failed. Please ensure you are taking a live photo.', 400);
    }

    // Verify face with BVN
    console.log(`[FaceVerification] Verifying face with BVN for user ${userId}`);
    const verificationResult = await verifyFaceWithBVN({
      faceImagePath: uploadedFilePath,
      bvn: bvn,
      userId: userId,
    });

    // Clean up uploaded file
    await fs.unlink(uploadedFilePath);
    uploadedFilePath = null;

    if (verificationResult.verified) {
      // Update user record
      user.isFaceVerified = true;
      user.faceVerifiedAt = new Date();
      await user.save();

      console.log(`[FaceVerification] Face verified successfully for user ${userId}`);

      return successResponse(res, {
        verified: true,
        message: 'Face verified successfully',
        confidence: verificationResult.confidence,
        data: {
          verifiedAt: user.faceVerifiedAt,
          matchScore: verificationResult.confidence,
        },
      });
    } else {
      console.log(`[FaceVerification] Face verification failed for user ${userId}: ${verificationResult.message}`);
      return errorResponse(res, verificationResult.message || 'Face verification failed', 400);
    }
  } catch (error) {
    console.error('[FaceVerification] Error:', error);

    // Clean up uploaded file on error
    if (uploadedFilePath) {
      try {
        await fs.unlink(uploadedFilePath);
      } catch (unlinkError) {
        console.error('[FaceVerification] Error deleting file:', unlinkError);
      }
    }

    return errorResponse(res, error.message || 'Face verification failed', 500);
  }
};

/**
 * Upload and verify face with NIN
 * POST /api/face/verify-nin
 */
const verifyFaceWithNINController = async (req, res) => {
  let uploadedFilePath = null;

  try {
    const { userId, nin } = req.body;

    if (!userId || !nin) {
      return errorResponse(res, 'User ID and NIN are required', 400);
    }

    if (!req.file) {
      return errorResponse(res, 'Face image is required', 400);
    }

    uploadedFilePath = req.file.path;

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (user.nin !== nin) {
      return errorResponse(res, 'NIN does not match user record', 400);
    }

    if (!user.ninVerified) {
      return errorResponse(res, 'NIN must be verified before face verification', 400);
    }

    // Perform liveness check
    const livenessResult = await performLivenessCheck(uploadedFilePath);
    
    if (!livenessResult.isLive) {
      return errorResponse(res, 'Liveness check failed. Please ensure you are taking a live photo.', 400);
    }

    // Verify face with NIN
    const verificationResult = await verifyFaceWithNIN({
      faceImagePath: uploadedFilePath,
      nin: nin,
      userId: userId,
    });

    // Clean up uploaded file
    await fs.unlink(uploadedFilePath);
    uploadedFilePath = null;

    if (verificationResult.verified) {
      user.isFaceVerified = true;
      user.faceVerifiedAt = new Date();
      await user.save();

      return successResponse(res, {
        verified: true,
        message: 'Face verified successfully',
        confidence: verificationResult.confidence,
        data: {
          verifiedAt: user.faceVerifiedAt,
          matchScore: verificationResult.confidence,
        },
      });
    } else {
      return errorResponse(res, verificationResult.message || 'Face verification failed', 400);
    }
  } catch (error) {
    console.error('[FaceVerification] Error:', error);

    if (uploadedFilePath) {
      try {
        await fs.unlink(uploadedFilePath);
      } catch (unlinkError) {
        console.error('[FaceVerification] Error deleting file:', unlinkError);
      }
    }

    return errorResponse(res, error.message || 'Face verification failed', 500);
  }
};

/**
 * Get face verification status
 * GET /api/face/status/:userId
 */
const getFaceVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('isFaceVerified faceVerifiedAt');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, {
      isFaceVerified: user.isFaceVerified || false,
      faceVerifiedAt: user.faceVerifiedAt,
    });
  } catch (error) {
    console.error('[FaceVerification] Get status error:', error);
    return errorResponse(res, 'Failed to get face verification status', 500);
  }
};

module.exports = {
  upload,
  verifyFaceWithBVNController,
  verifyFaceWithNINController,
  getFaceVerificationStatus,
};
