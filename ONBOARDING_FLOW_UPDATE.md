# Onboarding Flow Update - Consolidated Identity Verification

## Summary
Successfully consolidated the BVN and NIN verification steps into a single identity verification step, reducing the onboarding flow from 4 steps to 3 steps.

## Updated Flow

### Previous Flow (4 Steps)
1. **create-account** - Email + Phone Number
2. **verify-contact** - OTP Verification
3. **verify-bvn** - BVN Only
4. **verify-nin** - NIN + Date of Birth
5. **complete-profile** - Name + Password + Final Submission

### New Flow (3 Steps)
1. **create-account** - Email + Phone Number (Step 1 of 3)
2. **verify-contact** - OTP Verification (Step 2 of 3)
3. **kyc-verify** - BVN + NIN + Date of Birth (Step 3 of 3) ✨ **CONSOLIDATED**
4. **complete-profile** - Name + Password + Final Submission

## Changes Made

### 1. Updated `kyc-verify.tsx`
- ✅ Consolidated BVN, NIN, and DOB into a single form
- ✅ Removed multi-step logic (was 2 steps, now 1 step)
- ✅ Removed back button and step navigation
- ✅ Updated to accept `userId`, `email`, `phoneNumber` from params
- ✅ Changed to navigate to `complete-profile` instead of calling signup
- ✅ Removed verification animation modal (moved to complete-profile)
- ✅ Updated subtitle to "Step 3 of 3: Identity Verification"
- ✅ Updated progress bar to 66% (2 of 3 steps completed)
- ✅ Cleaned up unused imports and state variables

### 2. Updated `verify-contact.tsx`
- ✅ Changed navigation from `verify-bvn` to `kyc-verify`
- ✅ Updated subtitle from "Step 2 of 4" to "Step 2 of 3"

### 3. Updated `create-account.tsx`
- ✅ Updated subtitle from "Step 1 of 4" to "Step 1 of 3"

### 4. Updated `complete-profile.tsx`
- ✅ Updated subtitle to "Final Step: Create Your Account"
- ✅ Added progress bar showing 100% completion
- ✅ Kept the verification animation modal (happens during final submission)

## Files Modified
- ✅ `mobile/app/(auth)/kyc-verify.tsx` - Major refactor
- ✅ `mobile/app/(auth)/verify-contact.tsx` - Navigation update
- ✅ `mobile/app/(auth)/create-account.tsx` - Step count update
- ✅ `mobile/app/(auth)/complete-profile.tsx` - Progress bar addition

## Files Now Unused (Can be deleted)
- `mobile/app/(auth)/verify-bvn.tsx` - Replaced by consolidated kyc-verify
- `mobile/app/(auth)/verify-nin.tsx` - Replaced by consolidated kyc-verify

## Benefits
1. **Faster Onboarding** - One less screen to navigate through
2. **Better UX** - All identity information collected in one place
3. **Clearer Progress** - 3 steps instead of 4 makes progress more obvious
4. **Less Friction** - Users don't have to click "Continue" between BVN and NIN

## Testing Checklist
- [ ] Test complete onboarding flow from start to finish
- [ ] Verify all form validations work (BVN 11 digits, NIN 11 digits, DOB required)
- [ ] Test back button navigation
- [ ] Verify progress bars show correct percentages
- [ ] Test error handling and display
- [ ] Verify successful navigation to complete-profile with all params
- [ ] Test final submission with verification animation
