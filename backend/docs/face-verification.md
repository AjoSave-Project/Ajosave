# Face Verification Backend - Setup & Usage

## Quick Start

### 1. Install Dependencies
Already installed: `multer`, `form-data`

### 2. Environment Variables

Add to your `.env` file:

```env
# Choose provider: smile_identity, dojah, or youverify
FACE_VERIFICATION_PROVIDER=smile_identity

# Smile Identity (Recommended)
SMILE_IDENTITY_API_KEY=your_api_key
SMILE_IDENTITY_PARTNER_ID=your_partner_id

# OR Dojah
# DOJAH_API_KEY=your_api_key
# DOJAH_APP_ID=your_app_id

# OR Youverify
# YOUVERIFY_API_KEY=your_api_key
```

### 3. API Endpoints

#### Verify Face with BVN
```
POST /api/face/verify-bvn
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- userId: string
- bvn: string
- faceImage: file (image/jpeg or image/png, max 5MB)
```

#### Verify Face with NIN
```
POST /api/face/verify-nin
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- userId: string
- nin: string
- faceImage: file (image/jpeg or image/png, max 5MB)
```

#### Get Face Verification Status
```
GET /api/face/status/:userId
Authorization: Bearer <token>
```

### 4. Response Format

Success:
```json
{
  "success": true,
  "data": {
    "verified": true,
    "message": "Face verified successfully",
    "confidence": 0.95,
    "data": {
      "verifiedAt": "2026-05-08T02:00:00.000Z",
      "matchScore": 0.95
    }
  }
}
```

Error:
```json
{
  "success": false,
  "message": "Face verification failed",
  "error": "Face does not match BVN photo"
}
```

## Third-Party Providers

### Smile Identity (Recommended)
- Sign up: https://www.smileidentity.com
- Pricing: ~₦200-500 per verification
- Features: BVN, NIN, liveness detection

### Dojah
- Sign up: https://dojah.io
- Pricing: ~₦300-600 per verification
- Features: BVN, NIN, comprehensive KYC

### Youverify
- Contact: https://youverify.co
- Pricing: Enterprise (custom)
- Features: Full background checks

## Testing

Use test credentials from your provider's sandbox environment.

## Security Notes

1. Face images are automatically deleted after verification
2. Only verification status is stored in database
3. All API calls require authentication
4. File size limited to 5MB
5. Only image files accepted (JPEG, PNG)

## Database Schema

User model already includes:
```javascript
{
  isFaceVerified: Boolean,
  faceVerifiedAt: Date
}
```

## Error Handling

Common errors:
- `400`: Invalid request (missing fields, wrong file type)
- `401`: Unauthorized (invalid token)
- `404`: User not found
- `500`: Server error or third-party API failure

## Production Checklist

- [ ] Set up third-party provider account
- [ ] Add API credentials to environment variables
- [ ] Test with sandbox credentials
- [ ] Set up monitoring for API costs
- [ ] Configure rate limiting if needed
- [ ] Update privacy policy
- [ ] Train support team
