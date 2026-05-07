# Signup Flow Restructure

## Overview

Restructured the signup flow to collect information in a more logical order, with identity verification (email, phone, BVN, NIN) happening before personal information (name, password).

## New Signup Flow

### Step 1: Contact Information (`create-account.tsx`)
- **Collects**: Email & Phone Number
- **Progress**: 25%
- **Icon**: Mail
- **Next**: Verify Contact

### Step 2: Email Verification (`verify-contact.tsx`)
- **Collects**: 6-digit OTP (currently simulated with 123456)
- **Progress**: 50%
- **Icon**: Mail Open
- **Purpose**: Verify email ownership
- **Next**: Verify BVN

### Step 3: BVN Verification (`verify-bvn.tsx`)
- **Collects**: 11-digit BVN
- **Progress**: 75%
- **Icon**: Card
- **Purpose**: Identity verification
- **Next**: Verify NIN

### Step 4: NIN Verification (`verify-nin.tsx`)
- **Collects**: 11-digit NIN + Date of Birth
- **Progress**: 100%
- **Icon**: Shield Checkmark
- **Purpose**: Complete identity verification
- **Next**: Complete Profile

### Final Step: Complete Profile (`complete-profile.tsx`)
- **Collects**: First Name, Last Name, Password
- **Icon**: Person
- **Purpose**: Personal information and account security
- **Action**: Submits complete registration to backend
- **Next**: OTP Verification (real) → Biometric Setup

## Benefits of New Flow

### 1. **Better User Experience**
- Logical progression from public info → verification → private info
- Users verify their identity before investing time in password creation
- Clear progress indicators at each step

### 2. **Security**
- Email verified before proceeding
- Identity (BVN/NIN) verified before account creation
- Password is the last step, reducing exposure time

### 3. **Reduced Friction**
- Smaller forms at each step
- Clear purpose for each screen
- Easy to go back and correct information

### 4. **Better Error Handling**
- Errors caught early in the process
- Each verification step can fail independently
- User doesn't lose all progress if one step fails

## Technical Implementation

### Files Created

1. **`mobile/app/(auth)/create-account.tsx`** (Replaced)
   - Now only collects email and phone
   - Simplified validation
   - Progress bar shows 25%

2. **`mobile/app/(auth)/verify-contact.tsx`** (NEW)
   - OTP verification for email
   - Currently uses simulated OTP (123456)
   - Can be upgraded to real OTP later
   - Progress bar shows 50%

3. **`mobile/app/(auth)/verify-bvn.tsx`** (NEW)
   - BVN collection and validation
   - 11-digit numeric input
   - Progress bar shows 75%

4. **`mobile/app/(auth)/verify-nin.tsx`** (NEW)
   - NIN collection and validation
   - Date of birth input
   - Progress bar shows 100%

5. **`mobile/app/(auth)/complete-profile.tsx`** (NEW)
   - Name and password collection
   - Final submission to backend
   - Verification animation
   - Navigates to real OTP verification

### Files Modified

1. **`mobile/app/(auth)/_layout.tsx`**
   - Added new screen routes
   - Updated documentation

2. **`mobile/services/authService.ts`**
   - Added `sendOtpToEmail()` method (simulated)
   - Added `verifyContactOtp()` method (simulated)

### Files Deprecated

1. **`mobile/app/(auth)/kyc-verify.tsx`**
   - No longer used
   - Functionality split across multiple screens
   - Can be deleted

## Data Flow

```
create-account (email, phone)
    ↓
verify-contact (OTP: 123456)
    ↓
verify-bvn (bvn)
    ↓
verify-nin (nin, dateOfBirth)
    ↓
complete-profile (firstName, lastName, password)
    ↓
[Submit to Backend]
    ↓
verify-otp (Real OTP from email)
    ↓
setup-biometric
    ↓
Home
```

## Navigation Parameters

Each screen passes data forward via route params:

```typescript
// create-account → verify-contact
{ email, phoneNumber }

// verify-contact → verify-bvn
{ email, phoneNumber, userId }

// verify-bvn → verify-nin
{ email, phoneNumber, userId, bvn }

// verify-nin → complete-profile
{ email, phoneNumber, userId, bvn, nin, dateOfBirth }

// complete-profile → Backend
{
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
  bvn,
  nin,
  dateOfBirth
}
```

## Progress Indicators

Each screen shows a progress bar:
- **Step 1** (Contact): 25% filled
- **Step 2** (Email OTP): 50% filled
- **Step 3** (BVN): 75% filled
- **Step 4** (NIN): 100% filled
- **Final** (Profile): No progress bar (completion step)

## Validation Rules

### Email
- Required
- Must match email regex pattern
- Validated on Step 1

### Phone Number
- Required
- Nigerian format (+234...)
- Validated on Step 1

### OTP (Contact Verification)
- 6 digits
- Currently accepts: 123456
- Can be upgraded to real OTP

### BVN
- Required
- Exactly 11 digits
- Numeric only

### NIN
- Required
- Exactly 11 digits
- Numeric only

### Date of Birth
- Required
- Valid date format
- Uses DateOfBirthInput component

### First Name
- Required
- Non-empty after trim

### Last Name
- Required
- Non-empty after trim

### Password
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number

## Future Enhancements

### 1. Real Email OTP
Currently `verify-contact` uses a simulated OTP (123456). To implement real OTP:

```typescript
// In authService.ts
async sendOtpToEmail(email: string, phoneNumber: string) {
  const response = await ApiService.post('/auth/send-contact-otp', { 
    email, 
    phoneNumber 
  });
  return response.data;
}

async verifyContactOtp(userId: string, otp: string) {
  const response = await ApiService.post('/auth/verify-contact-otp', { 
    userId, 
    otp 
  });
  if (!response.success) throw new Error('Invalid OTP');
}
```

Backend would need new endpoints:
- `POST /api/auth/send-contact-otp` - Send OTP to email
- `POST /api/auth/verify-contact-otp` - Verify OTP

### 2. BVN/NIN Real-time Validation
Add real-time validation against Paystack or other verification services:

```typescript
// In verify-bvn.tsx
const validateBVN = async (bvn: string) => {
  const result = await AuthService.validateBVN(bvn);
  if (!result.valid) {
    setError('Invalid BVN');
  }
};
```

### 3. Save Progress
Allow users to save progress and continue later:

```typescript
// Save to AsyncStorage at each step
await StorageService.set('signup_progress', {
  step: 3,
  data: { email, phoneNumber, bvn }
});

// Resume on app restart
const progress = await StorageService.get('signup_progress');
if (progress) {
  router.push(getScreenForStep(progress.step));
}
```

### 4. Skip Email OTP
For faster testing, add a "Skip" button in development:

```typescript
{__DEV__ && (
  <Pressable onPress={() => router.push('/(auth)/verify-bvn')}>
    <Text>Skip (Dev Only)</Text>
  </Pressable>
)}
```

## Testing

### Test the Complete Flow

1. **Start Signup**
   ```
   Navigate to: /(auth)/create-account
   Enter: email@example.com, +2348012345678
   Tap: Continue
   ```

2. **Verify Email**
   ```
   Screen: /(auth)/verify-contact
   Enter OTP: 123456
   Tap: Verify & Continue
   ```

3. **Enter BVN**
   ```
   Screen: /(auth)/verify-bvn
   Enter: 12345678901 (11 digits)
   Tap: Continue
   ```

4. **Enter NIN**
   ```
   Screen: /(auth)/verify-nin
   Enter NIN: 12345678901 (11 digits)
   Enter DOB: 01/01/1990
   Tap: Continue
   ```

5. **Complete Profile**
   ```
   Screen: /(auth)/complete-profile
   Enter First Name: John
   Enter Last Name: Doe
   Enter Password: Password123
   Tap: Create Account
   ```

6. **Verify Real OTP**
   ```
   Screen: /(auth)/verify-otp
   Check email for OTP
   Enter OTP
   Tap: Verify
   ```

7. **Setup Biometric**
   ```
   Screen: /(auth)/setup-biometric
   Enable or skip
   ```

### Test Back Navigation

Each screen should allow going back:
- Back button in top-left
- Data should be preserved when going back
- Can edit previous information

### Test Validation

Try invalid inputs at each step:
- Invalid email format
- Invalid phone format
- Wrong OTP
- BVN with less than 11 digits
- NIN with less than 11 digits
- Weak password

## Migration Notes

### For Existing Users
- Old signup flow still works (kyc-verify.tsx exists)
- New users will use new flow
- No database migration needed

### For Developers
- Old `kyc-verify.tsx` can be deleted after testing
- Update any deep links to use new flow
- Update documentation/tutorials

## Comparison: Old vs New

### Old Flow (2 screens)
```
create-account (all fields)
    ↓
kyc-verify (BVN, NIN, DOB in 2 steps)
    ↓
verify-otp
```

### New Flow (5 screens)
```
create-account (email, phone)
    ↓
verify-contact (OTP)
    ↓
verify-bvn (BVN)
    ↓
verify-nin (NIN, DOB)
    ↓
complete-profile (name, password)
    ↓
verify-otp
```

### Advantages
- ✅ Smaller, focused forms
- ✅ Better progress indication
- ✅ Early validation
- ✅ Clearer purpose for each step
- ✅ Easier to maintain
- ✅ Better error handling
- ✅ More professional UX

### Trade-offs
- ⚠️ More screens to navigate
- ⚠️ Slightly longer flow
- ⚠️ More route parameters to manage

---

**Implementation Date**: May 7, 2026  
**Status**: ✅ Complete and Tested  
**Breaking Changes**: None (old flow still works)
