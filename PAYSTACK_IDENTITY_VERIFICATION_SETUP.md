# Paystack Identity Verification Setup Guide

## Overview
This guide explains how to implement BVN and NIN verification using Paystack APIs in the AjoSave application.

## ✅ What's Been Implemented

### Backend

1. **Paystack Identity Service** (`backend/src/services/paystackIdentityService.js`)
   - `resolveBVN()` - Verify and get BVN details
   - `verifyBVN()` - Match BVN with user details
   - `verifyNIN()` - Placeholder for NIN verification (requires third-party service)
   - `verifyAccountWithBVN()` - Verify bank account with BVN
   - `getBanks()` - Get list of supported banks

2. **Identity Verification Controller** (`backend/src/controllers/identityVerificationController.js`)
   - `POST /api/identity/verify-bvn` - Verify BVN
   - `POST /api/identity/verify-nin` - Verify NIN
   - `GET /api/identity/status/:userId` - Get verification status

3. **User Model Updates** (`backend/src/models/Users.js`)
   - Added `bvnVerified`, `bvnVerifiedAt`, `bvnData` fields
   - Added `ninVerified`, `ninVerifiedAt`, `ninData` fields

4. **Routes** (`backend/src/routes/identityRoutes.js`)
   - Identity verification routes registered

5. **Server Configuration** (`backend/server.js`)
   - Identity routes added to Express app

### Frontend (Mobile)

1. **Auth Service** (`mobile/services/authService.ts`)
   - `verifyBVN()` - Call BVN verification API
   - `verifyNIN()` - Call NIN verification API
   - `getVerificationStatus()` - Check verification status

2. **Verification Screen** (`mobile/app/(auth)/verify-identity-field.tsx`)
   - Integrated with real API calls
   - Shows loading states with progress steps
   - Displays success/failure modals
   - Auto-navigates back with results

3. **KYC Form** (`mobile/app/(auth)/kyc-verify.tsx`)
   - Inline verification buttons for BVN and NIN
   - Visual feedback for verification status
   - Prevents form submission until both verified

## 🔑 Paystack API Keys

Your Paystack keys are already configured in `.env`:
```env
PAYSTACK_SECRET_KEY=sk_test_6861e282bc112e55b5a42f81013f898b29831768
PAYSTACK_PUBLIC_KEY=pk_test_ea0d848cec6a2e81e72725d69efed66b8cee91cc
```

⚠️ **Note:** These are TEST keys. For production, you'll need to:
1. Complete Paystack KYC verification
2. Get LIVE API keys from Paystack dashboard
3. Update `.env` with live keys

## 📋 BVN Verification Flow

### How It Works

1. **User enters BVN** (11 digits)
2. **Taps arrow button** to verify
3. **Frontend calls** `POST /api/identity/verify-bvn`
4. **Backend calls** Paystack `/bank/resolve_bvn/{bvn}` endpoint
5. **Paystack returns** BVN details:
   - First name
   - Last name
   - Date of birth
   - Phone number
6. **Backend saves** verification status to database
7. **Frontend shows** success/failure modal
8. **User continues** to next step

### API Endpoint

```http
POST /api/identity/verify-bvn
Content-Type: application/json

{
  "userId": "user_id_here",
  "bvn": "12345678901"
}
```

### Response (Success)

```json
{
  "success": true,
  "data": {
    "verified": true,
    "message": "BVN verified successfully",
    "data": {
      "bvn": "12345678901",
      "firstName": "John",
      "lastName": "Doe",
      "verifiedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Response (Failure)

```json
{
  "success": false,
  "message": "BVN not found or invalid",
  "error": "VERIFICATION_FAILED"
}
```

## 🆔 NIN Verification

### Current Status

⚠️ **NIN verification is NOT directly supported by Paystack.**

The current implementation returns a placeholder response indicating that a third-party service is required.

### Recommended Third-Party Services

1. **Dojah** (https://dojah.io)
   - Nigerian identity verification
   - Supports NIN, BVN, Driver's License, etc.
   - Easy API integration
   - Pricing: Pay-as-you-go

2. **Smile Identity** (https://smileidentity.com)
   - Pan-African identity verification
   - Supports multiple ID types
   - KYC and AML compliance
   - Pricing: Contact for quote

3. **Youverify** (https://youverify.co)
   - Nigerian-focused verification
   - NIN, BVN, CAC, etc.
   - Compliance-ready
   - Pricing: Tiered plans

### How to Integrate NIN Verification

1. **Choose a provider** (e.g., Dojah)

2. **Sign up and get API keys**

3. **Update `.env`**:
   ```env
   DOJAH_API_KEY=your_dojah_api_key
   DOJAH_APP_ID=your_dojah_app_id
   ```

4. **Create Dojah service** (`backend/src/services/dojahService.js`):
   ```javascript
   const axios = require('axios');

   const dojahClient = axios.create({
     baseURL: 'https://api.dojah.io',
     headers: {
       'Authorization': process.env.DOJAH_API_KEY,
       'AppId': process.env.DOJAH_APP_ID,
     },
   });

   const verifyNIN = async (nin) => {
     const response = await dojahClient.post('/api/v1/kyc/nin', { nin });
     return response.data;
   };

   module.exports = { verifyNIN };
   ```

5. **Update `paystackIdentityService.js`**:
   ```javascript
   const { verifyNIN: dojahVerifyNIN } = require('./dojahService');

   const verifyNIN = async (nin, options = {}) => {
     try {
       const result = await dojahVerifyNIN(nin);
       
       return {
         success: true,
         verified: true,
         message: 'NIN verified successfully',
         data: {
           nin: nin,
           firstName: result.firstname,
           lastName: result.lastname,
           dateOfBirth: result.birthdate,
           phoneNumber: result.phone,
         },
       };
     } catch (error) {
       return {
         success: false,
         verified: false,
         message: 'NIN verification failed',
         data: null,
       };
     }
   };
   ```

## 🧪 Testing

### Test BVN Numbers

Paystack provides test BVN numbers for development:

```
Valid Test BVN: 22222222222
Invalid Test BVN: 11111111111
```

### Testing Flow

1. **Start backend server**:
   ```bash
   cd backend
   npm start
   ```

2. **Start mobile app**:
   ```bash
   cd mobile
   npm start
   ```

3. **Test BVN verification**:
   - Go to KYC verification screen
   - Enter test BVN: `22222222222`
   - Tap arrow button
   - Should show success modal

4. **Test NIN verification**:
   - Currently returns "not configured" message
   - Integrate third-party service to enable

### API Testing with cURL

```bash
# Test BVN verification
curl -X POST http://localhost:5000/api/identity/verify-bvn \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "bvn": "22222222222"
  }'

# Check verification status
curl http://localhost:5000/api/identity/status/USER_ID_HERE
```

## 🚀 Production Deployment

### Before Going Live

1. **Complete Paystack KYC**
   - Submit business documents
   - Verify business details
   - Get approval from Paystack

2. **Get Live API Keys**
   - Go to Paystack Dashboard
   - Navigate to Settings > API Keys & Webhooks
   - Copy LIVE secret key

3. **Update Environment Variables**
   ```env
   PAYSTACK_SECRET_KEY=sk_live_YOUR_LIVE_KEY
   PAYSTACK_PUBLIC_KEY=pk_live_YOUR_LIVE_KEY
   NODE_ENV=production
   ```

4. **Integrate NIN Verification**
   - Choose and integrate third-party service
   - Test thoroughly in staging environment

5. **Security Checklist**
   - ✅ API keys stored in environment variables
   - ✅ BVN/NIN data encrypted in database
   - ✅ HTTPS enabled for all API calls
   - ✅ Rate limiting configured
   - ✅ Error messages don't leak sensitive data

## 📊 Monitoring & Logging

### What to Monitor

1. **Verification Success Rate**
   - Track BVN/NIN verification success vs failure
   - Alert if success rate drops below threshold

2. **API Response Times**
   - Monitor Paystack API latency
   - Set timeout alerts

3. **Error Rates**
   - Track specific error types
   - Monitor for API quota limits

### Logging

The service logs important events:
```
[Paystack] Verifying BVN: 222********
[Paystack] BVN verification successful
[Identity] BVN verified successfully for user 123abc
```

## 💰 Pricing

### Paystack Identity Verification

- **BVN Resolution**: ₦50 per lookup
- **BVN Match**: ₦50 per verification
- **Account Resolution**: Free

### Third-Party NIN Verification

- **Dojah**: ~₦100-200 per verification
- **Smile Identity**: Contact for pricing
- **Youverify**: Tiered pricing based on volume

## 🔒 Security Best Practices

1. **Never log full BVN/NIN**
   ```javascript
   // ❌ Bad
   console.log(`Verifying BVN: ${bvn}`);
   
   // ✅ Good
   console.log(`Verifying BVN: ${bvn.substring(0, 3)}********`);
   ```

2. **Encrypt sensitive data**
   - Use MongoDB field-level encryption
   - Or encrypt before storing

3. **Limit API access**
   - Use rate limiting
   - Implement request throttling
   - Monitor for abuse

4. **Validate input**
   - Check BVN/NIN format before API call
   - Prevent injection attacks

## 📞 Support

### Paystack Support
- Email: support@paystack.com
- Docs: https://paystack.com/docs/identity-verification/
- Slack: Paystack Developer Community

### Need Help?
- Check Paystack documentation
- Review error logs
- Contact Paystack support for API issues
- Consult third-party provider docs for NIN verification

## 🎯 Next Steps

1. ✅ Test BVN verification with test numbers
2. ⏳ Choose and integrate NIN verification provider
3. ⏳ Complete Paystack KYC for live keys
4. ⏳ Test in staging environment
5. ⏳ Deploy to production
6. ⏳ Monitor verification metrics
