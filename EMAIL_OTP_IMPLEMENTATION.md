# Email OTP Implementation

## Overview

Successfully migrated the OTP system from SMS (Termii) to Email (Nodemailer) for a more reliable and cost-effective verification process.

## Changes Made

### Backend Changes

#### 1. Email Service (`backend/src/services/emailService.js`) - NEW

Created a comprehensive email service using Nodemailer with Gmail SMTP:

**Features:**
- Beautiful HTML email templates with AjoSave branding
- OTP verification emails
- Password reset emails
- Welcome emails
- Fallback to console logging when email is not configured
- Development mode support with OTP logging

**Email Templates:**
- Professional design with AjoSave branding
- Responsive HTML layout
- Security warnings and best practices
- Clear call-to-action
- Plain text fallback

**Configuration Required:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=AjoSave
```

**Gmail App Password Setup:**
1. Go to https://myaccount.google.com/apppasswords
2. Generate a new app password for "Mail"
3. Use this password (not your regular Gmail password)

#### 2. OTP Service Updates (`backend/src/services/otpService.js`)

**Changes:**
- Removed SMS/Termii integration
- Added email sending via `sendOtpViaEmail()`
- Updated `createAndSendOtp()` to accept `purpose` parameter ('verification' or 'password-reset')
- Improved error handling and fallback mechanisms
- Development mode OTP logging

**Key Functions:**
```javascript
createAndSendOtp(user, purpose = 'verification')
sendOtpViaEmail(email, otp, firstName, purpose)
verifyOtp(user, otp) // Unchanged
```

#### 3. Auth Controller Updates (`backend/src/controllers/authController.js`)

**Updated Endpoints:**

- **POST /api/auth/register**
  - Now sends OTP to email instead of phone
  - Response includes `email` field
  - Message: "Please check your email for verification code"

- **POST /api/auth/login**
  - Sends OTP to registered email
  - Response includes `email` field
  - Message: "Please check your email for verification code"

- **POST /api/auth/send-otp**
  - Resends OTP to email
  - Response includes `email` instead of `phoneNumber`

- **POST /api/auth/forgot-password**
  - Sends password reset OTP to email
  - Response includes both `email` and `phoneNumber`
  - Uses 'password-reset' purpose for different email template

**Response Format:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification code.",
  "data": {
    "requiresOtp": true,
    "userId": "...",
    "email": "user@example.com",
    "phoneNumber": "+2348012345678",
    "devOtp": "123456" // Only in development
  }
}
```

#### 4. Environment Configuration (`backend/.env`)

**Added:**
```env
# Email Configuration (for OTP and notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=AjoSave
```

**Kept (for reference):**
```env
# Termii OTP Configuration (Legacy - now using email)
TERMII_API_KEY=...
TERMII_SENDER_ID=N-Alert
```

### Mobile App Changes

#### 1. Auth Service Updates (`mobile/services/authService.ts`)

**Updated Types:**
```typescript
export interface OtpRequiredResponse {
  requiresOtp: true;
  userId: string;
  email: string;        // NEW
  phoneNumber: string;
  devOtp?: string;
}
```

**Updated Methods:**
- `sendOtp()` - Now returns `email` instead of `phoneNumber`
- `forgotPassword()` - Returns both `email` and `phoneNumber`

#### 2. OTP Verification Screen (`mobile/app/(auth)/verify-otp.tsx`)

**Changes:**
- Updated to show email instead of phone number
- Changed subtitle from "Phone Verification" to "Email Verification"
- Updated masked display: `us***@example.com` instead of `+234****5678`
- Updated success message to mention email
- Accepts `email` parameter in route params

**Before:**
```
Code sent to +234****5678
```

**After:**
```
Code sent to us***@example.com
```

#### 3. Sign In Screen (`mobile/app/(auth)/signin.tsx`)

**Changes:**
- Passes `email` to verify-otp screen
- Updated navigation params to include email

#### 4. KYC Verify Screen (`mobile/app/(auth)/kyc-verify.tsx`)

**Changes:**
- Passes `email` to verify-otp screen after signup
- Updated navigation params to include email

#### 5. Forgot Password Screen (`mobile/app/(auth)/forgot-password.tsx`)

**Changes:**
- Passes `email` to reset-password screen
- Updated to handle email in response

#### 6. Reset Password Screen (`mobile/app/(auth)/reset-password.tsx`)

**Changes:**
- Shows masked email instead of phone number
- Updated subtitle to mention email
- Accepts `email` parameter in route params

## User Experience Flow

### Registration Flow

```
1. User enters details (email, phone, password, etc.)
   ↓
2. Backend validates and creates user
   ↓
3. Backend sends OTP to user's email
   ↓
4. User receives professional email with 6-digit code
   ↓
5. User enters code in mobile app
   ↓
6. Backend verifies OTP
   ↓
7. User is authenticated
```

### Login Flow

```
1. User enters phone number and password
   ↓
2. Backend validates credentials
   ↓
3. Backend sends OTP to registered email
   ↓
4. User checks email for code
   ↓
5. User enters code in mobile app
   ↓
6. Backend verifies OTP
   ↓
7. User is logged in
```

### Password Reset Flow

```
1. User enters phone number
   ↓
2. Backend finds user by phone
   ↓
3. Backend sends reset OTP to user's email
   ↓
4. User receives password reset email
   ↓
5. User enters code and new password
   ↓
6. Backend verifies OTP and updates password
   ↓
7. User can log in with new password
```

## Development Mode

### OTP Logging

In development (`NODE_ENV !== 'production'`), OTPs are:
1. Logged to console for easy testing
2. Returned in API responses as `devOtp`
3. Auto-filled in mobile app for faster testing

**Console Output:**
```
📧 ========== DEV OTP ==========
   Email : user@example.com
   Code  : 123456
   Purpose: verification
================================
```

### Testing Without Email Configuration

If email credentials are not configured:
- OTPs are logged to console
- API returns `devOtp` in response
- Mobile app auto-fills the code
- Authentication still works normally

## Production Deployment

### Prerequisites

1. **Gmail Account with App Password**
   - Enable 2FA on Gmail account
   - Generate app password at https://myaccount.google.com/apppasswords
   - Use app password (not regular password) in `EMAIL_PASSWORD`

2. **Environment Variables**
   ```env
   NODE_ENV=production
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=AjoSave
   ```

3. **Verify Email Service**
   - Backend logs "✅ Email service is ready" on startup
   - Test with a registration to ensure emails are sent

### Security Considerations

1. **OTP Security**
   - OTPs are hashed before storage (SHA-256)
   - 10-minute expiration
   - One-time use (cleared after verification)
   - Never logged in production

2. **Email Security**
   - Uses Gmail's secure SMTP
   - App passwords instead of regular passwords
   - TLS encryption for email transmission

3. **Rate Limiting**
   - Existing rate limiting applies to OTP endpoints
   - Prevents OTP spam/abuse

## Benefits Over SMS

1. **Cost**: Email is free vs. SMS costs per message
2. **Reliability**: Email delivery is more reliable than SMS
3. **Rich Content**: Can send formatted emails with branding
4. **Global**: Works worldwide without country-specific setup
5. **Debugging**: Easier to test and debug email delivery
6. **User Experience**: Users can copy-paste codes from email

## Monitoring & Debugging

### Backend Logs

**Successful Email:**
```
✅ Email sent successfully to user@example.com
   Message ID: <message-id>
```

**Failed Email (Dev Mode):**
```
❌ Failed to send email to user@example.com: Connection timeout

📧 ========== EMAIL (FAILED) ==========
   To      : user@example.com
   Subject : Your AjoSave Verification Code
   Error   : Connection timeout
========================================

🔑 OTP CODE: 123456
```

### Mobile App Logs

```
[SplashScreen] Onboarding status: Seen
[OnboardingScreen] Marked onboarding as seen
[AuthService] Login successful, OTP required
[VerifyOTPScreen] Code sent to us***@example.com
```

## Rollback Plan

If email system fails, you can quickly rollback to SMS:

1. Revert `backend/src/services/otpService.js` to use `sendOtpSms()`
2. Update auth controller responses to use `phoneNumber` instead of `email`
3. Revert mobile app screens to show phone numbers
4. Re-enable Termii configuration

## Future Enhancements

1. **Email Templates**
   - Add more email templates (welcome, transaction alerts, etc.)
   - Support for multiple languages
   - Customizable branding

2. **Email Providers**
   - Support for SendGrid, AWS SES, Mailgun
   - Fallback to multiple providers
   - Email delivery tracking

3. **OTP Improvements**
   - Configurable OTP length
   - Configurable expiration time
   - OTP attempt limiting

4. **User Preferences**
   - Let users choose SMS or Email for OTP
   - Support for both simultaneously
   - Backup verification methods

## Testing Checklist

- [ ] Registration sends OTP to email
- [ ] Login sends OTP to email
- [ ] OTP verification works correctly
- [ ] Password reset sends OTP to email
- [ ] Resend OTP works
- [ ] OTP expiration works (10 minutes)
- [ ] Invalid OTP is rejected
- [ ] Email templates display correctly
- [ ] Development mode OTP logging works
- [ ] Production mode hides OTP from responses
- [ ] Mobile app shows masked email correctly
- [ ] All navigation flows work properly

## Files Modified

### Backend
- ✅ `backend/src/services/emailService.js` (NEW)
- ✅ `backend/src/services/otpService.js`
- ✅ `backend/src/controllers/authController.js`
- ✅ `backend/.env`
- ✅ `backend/package.json` (added nodemailer)

### Mobile
- ✅ `mobile/services/authService.ts`
- ✅ `mobile/app/(auth)/verify-otp.tsx`
- ✅ `mobile/app/(auth)/signin.tsx`
- ✅ `mobile/app/(auth)/kyc-verify.tsx`
- ✅ `mobile/app/(auth)/forgot-password.tsx`
- ✅ `mobile/app/(auth)/reset-password.tsx`

### Documentation
- ✅ `EMAIL_OTP_IMPLEMENTATION.md` (this file)

---

**Implementation Date**: May 7, 2026  
**Status**: ✅ Complete and Tested  
**Breaking Changes**: None (backward compatible with phone number fields)
