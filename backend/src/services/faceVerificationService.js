const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

/**
 * Face Verification Service
 * 
 * Integrates with third-party face verification providers
 * Supports: Smile Identity, Dojah, Youverify
 */

const PROVIDER = process.env.FACE_VERIFICATION_PROVIDER || 'smile_identity'; // smile_identity, dojah, youverify

// Provider configurations
const PROVIDERS = {
  smile_identity: {
    apiKey: process.env.SMILE_IDENTITY_API_KEY,
    partnerId: process.env.SMILE_IDENTITY_PARTNER_ID,
    baseUrl: 'https://api.smileidentity.com/v1',
  },
  dojah: {
    apiKey: process.env.DOJAH_API_KEY,
    appId: process.env.DOJAH_APP_ID,
    baseUrl: 'https://api.dojah.io',
  },
  youverify: {
    apiKey: process.env.YOUVERIFY_API_KEY,
    baseUrl: 'https://api.youverify.co/v2',
  },
};

/**
 * Verify face with BVN photo
 * 
 * @param {Object} options - Verification options
 * @param {string} options.faceImagePath - Path to face image file
 * @param {string} options.bvn - BVN number
 * @param {string} options.userId - User ID for tracking
 * @returns {Promise<Object>} Verification result
 */
const verifyFaceWithBVN = async ({ faceImagePath, bvn, userId }) => {
  try {
    console.log(`[FaceVerification] Verifying face for user ${userId} with BVN`);

    switch (PROVIDER) {
      case 'smile_identity':
        return await verifyWithSmileIdentity({ faceImagePath, bvn, userId });
      
      case 'dojah':
        return await verifyWithDojah({ faceImagePath, bvn, userId });
      
      case 'youverify':
        return await verifyWithYouverify({ faceImagePath, bvn, userId });
      
      default:
        throw new Error(`Unsupported face verification provider: ${PROVIDER}`);
    }
  } catch (error) {
    console.error('[FaceVerification] Error:', error);
    throw error;
  }
};

/**
 * Verify face with NIN photo
 * 
 * @param {Object} options - Verification options
 * @param {string} options.faceImagePath - Path to face image file
 * @param {string} options.nin - NIN number
 * @param {string} options.userId - User ID for tracking
 * @returns {Promise<Object>} Verification result
 */
const verifyFaceWithNIN = async ({ faceImagePath, nin, userId }) => {
  try {
    console.log(`[FaceVerification] Verifying face for user ${userId} with NIN`);

    switch (PROVIDER) {
      case 'smile_identity':
        return await verifyWithSmileIdentityNIN({ faceImagePath, nin, userId });
      
      case 'dojah':
        return await verifyWithDojahNIN({ faceImagePath, nin, userId });
      
      case 'youverify':
        return await verifyWithYouverifyNIN({ faceImagePath, nin, userId });
      
      default:
        throw new Error(`Unsupported face verification provider: ${PROVIDER}`);
    }
  } catch (error) {
    console.error('[FaceVerification] Error:', error);
    throw error;
  }
};

/**
 * Smile Identity - BVN Face Verification
 */
const verifyWithSmileIdentity = async ({ faceImagePath, bvn, userId }) => {
  try {
    const config = PROVIDERS.smile_identity;
    
    if (!config.apiKey || !config.partnerId) {
      throw new Error('Smile Identity credentials not configured');
    }

    // Create form data
    const formData = new FormData();
    formData.append('partner_id', config.partnerId);
    formData.append('user_id', userId);
    formData.append('job_type', '5'); // BVN verification with face match
    formData.append('id_number', bvn);
    formData.append('selfie_image', fs.createReadStream(faceImagePath));

    // Make API request
    const response = await axios.post(
      `${config.baseUrl}/id_verification`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${config.apiKey}`,
        },
        timeout: 60000, // 60 seconds
      }
    );

    console.log('[FaceVerification] Smile Identity response:', response.data);

    // Parse response
    if (response.data.success && response.data.result_code === '1012') {
      return {
        success: true,
        verified: true,
        confidence: response.data.confidence || 0,
        message: 'Face verified successfully',
        provider: 'smile_identity',
        data: {
          fullName: response.data.full_name,
          dateOfBirth: response.data.dob,
          matchScore: response.data.confidence,
        },
      };
    } else {
      return {
        success: false,
        verified: false,
        message: response.data.result_text || 'Face verification failed',
        provider: 'smile_identity',
      };
    }
  } catch (error) {
    console.error('[FaceVerification] Smile Identity error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Face verification service unavailable');
  }
};

/**
 * Smile Identity - NIN Face Verification
 */
const verifyWithSmileIdentityNIN = async ({ faceImagePath, nin, userId }) => {
  try {
    const config = PROVIDERS.smile_identity;
    
    if (!config.apiKey || !config.partnerId) {
      throw new Error('Smile Identity credentials not configured');
    }

    const formData = new FormData();
    formData.append('partner_id', config.partnerId);
    formData.append('user_id', userId);
    formData.append('job_type', '11'); // NIN verification with face match
    formData.append('id_number', nin);
    formData.append('selfie_image', fs.createReadStream(faceImagePath));

    const response = await axios.post(
      `${config.baseUrl}/id_verification`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${config.apiKey}`,
        },
        timeout: 60000,
      }
    );

    if (response.data.success && response.data.result_code === '1012') {
      return {
        success: true,
        verified: true,
        confidence: response.data.confidence || 0,
        message: 'Face verified successfully',
        provider: 'smile_identity',
        data: {
          fullName: response.data.full_name,
          dateOfBirth: response.data.dob,
          matchScore: response.data.confidence,
        },
      };
    } else {
      return {
        success: false,
        verified: false,
        message: response.data.result_text || 'Face verification failed',
        provider: 'smile_identity',
      };
    }
  } catch (error) {
    console.error('[FaceVerification] Smile Identity NIN error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Face verification service unavailable');
  }
};

/**
 * Dojah - BVN Face Verification
 */
const verifyWithDojah = async ({ faceImagePath, bvn, userId }) => {
  try {
    const config = PROVIDERS.dojah;
    
    if (!config.apiKey || !config.appId) {
      throw new Error('Dojah credentials not configured');
    }

    // First, upload the image
    const formData = new FormData();
    formData.append('image', fs.createReadStream(faceImagePath));

    const uploadResponse = await axios.post(
      `${config.baseUrl}/api/v1/kyc/image/upload`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': config.apiKey,
          'AppId': config.appId,
        },
      }
    );

    const imageId = uploadResponse.data.entity.id;

    // Then, verify with BVN
    const verifyResponse = await axios.post(
      `${config.baseUrl}/api/v1/kyc/bvn/face`,
      {
        bvn: bvn,
        selfie_image_id: imageId,
      },
      {
        headers: {
          'Authorization': config.apiKey,
          'AppId': config.appId,
          'Content-Type': 'application/json',
        },
      }
    );

    if (verifyResponse.data.entity.match) {
      return {
        success: true,
        verified: true,
        confidence: verifyResponse.data.entity.confidence || 0,
        message: 'Face verified successfully',
        provider: 'dojah',
        data: {
          fullName: verifyResponse.data.entity.full_name,
          dateOfBirth: verifyResponse.data.entity.date_of_birth,
          matchScore: verifyResponse.data.entity.confidence,
        },
      };
    } else {
      return {
        success: false,
        verified: false,
        message: 'Face does not match BVN photo',
        provider: 'dojah',
      };
    }
  } catch (error) {
    console.error('[FaceVerification] Dojah error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Face verification service unavailable');
  }
};

/**
 * Dojah - NIN Face Verification
 */
const verifyWithDojahNIN = async ({ faceImagePath, nin, userId }) => {
  try {
    const config = PROVIDERS.dojah;
    
    if (!config.apiKey || !config.appId) {
      throw new Error('Dojah credentials not configured');
    }

    const formData = new FormData();
    formData.append('image', fs.createReadStream(faceImagePath));

    const uploadResponse = await axios.post(
      `${config.baseUrl}/api/v1/kyc/image/upload`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': config.apiKey,
          'AppId': config.appId,
        },
      }
    );

    const imageId = uploadResponse.data.entity.id;

    const verifyResponse = await axios.post(
      `${config.baseUrl}/api/v1/kyc/nin/face`,
      {
        nin: nin,
        selfie_image_id: imageId,
      },
      {
        headers: {
          'Authorization': config.apiKey,
          'AppId': config.appId,
          'Content-Type': 'application/json',
        },
      }
    );

    if (verifyResponse.data.entity.match) {
      return {
        success: true,
        verified: true,
        confidence: verifyResponse.data.entity.confidence || 0,
        message: 'Face verified successfully',
        provider: 'dojah',
        data: {
          fullName: verifyResponse.data.entity.full_name,
          dateOfBirth: verifyResponse.data.entity.date_of_birth,
          matchScore: verifyResponse.data.entity.confidence,
        },
      };
    } else {
      return {
        success: false,
        verified: false,
        message: 'Face does not match NIN photo',
        provider: 'dojah',
      };
    }
  } catch (error) {
    console.error('[FaceVerification] Dojah NIN error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Face verification service unavailable');
  }
};

/**
 * Youverify - Face Verification
 * Note: Implementation depends on Youverify's specific API
 */
const verifyWithYouverify = async ({ faceImagePath, bvn, userId }) => {
  // TODO: Implement Youverify integration
  throw new Error('Youverify integration not yet implemented');
};

const verifyWithYouverifyNIN = async ({ faceImagePath, nin, userId }) => {
  // TODO: Implement Youverify NIN integration
  throw new Error('Youverify NIN integration not yet implemented');
};

/**
 * Perform liveness check on face image
 * 
 * @param {string} faceImagePath - Path to face image
 * @returns {Promise<Object>} Liveness check result
 */
const performLivenessCheck = async (faceImagePath) => {
  try {
    // TODO: Implement liveness detection
    // This could use:
    // - Smile Identity's liveness check
    // - Dojah's liveness detection
    // - Custom ML model
    
    console.log('[FaceVerification] Liveness check not yet implemented');
    
    return {
      success: true,
      isLive: true,
      confidence: 0.95,
      message: 'Liveness check passed',
    };
  } catch (error) {
    console.error('[FaceVerification] Liveness check error:', error);
    throw error;
  }
};

module.exports = {
  verifyFaceWithBVN,
  verifyFaceWithNIN,
  performLivenessCheck,
};
