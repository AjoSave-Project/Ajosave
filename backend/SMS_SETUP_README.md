# SMS OTP Setup for Forgot Password

## Overview

The forgot password feature now sends OTP via SMS to the user's phone number instead of email. This provides a more secure and convenient experience for users.

## How It Works

1. **User enters phone number** on forgot password screen
2. **Backend sends SMS OTP** to the registered phone number using Termii API
3. **User receives SMS** with 6-digit verification code
4. **User enters OTP** on reset password screen along with new password
5. **Password is reset** after successful OTP verification

## SMS Service Configuration

The SMS service is configured to use **Termii** (popular SMS provider in Nigeria):

### Environment Variables Required:
```env
TERMII_API_KEY=your_termii_api_key_here
TERMII_SENDER_ID=AjoSave
```

### Current Configuration:
- **API Key**: Already configured in `.env` file
- **Sender ID**: Set to "AjoSave" 
- **Provider**: Termii (https://termii.com)

## Fallback Mechanism

If SMS delivery fails, the system automatically falls back to email delivery to ensure users can still reset their passwords.

## Testing the SMS Feature

### 1. Test with Real Phone Number:
```bash
# Make a POST request to forgot password endpoint
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+2348012345678"}'
```

### 2. Check Logs:
Look for these log messages:
- `✅ SMS sent successfully to +2348012345678`
- `✅ Password reset OTP sent via SMS to +2348012345678`

### 3. Mobile App Testing:
1. Open mobile app
2. Go to Sign In → Forgot Password
3. Enter a registered phone number
4. Check your phone for SMS with OTP
5. Enter OTP and new password on reset screen

## SMS Message Format

**Password Reset SMS:**
```
Hi [FirstName], your AjoSave password reset code is: 123456. This code expires in 10 minutes. Do not share this code with anyone.
```

## Error Handling

- **SMS service not configured**: Falls back to email
- **Invalid phone number**: Returns generic success message (security)
- **SMS delivery failure**: Automatically falls back to email
- **Phone number not found**: Returns generic success message (prevents enumeration)

## Security Features

1. **OTP expires in 10 minutes**
2. **OTP is hashed before storage** (never stored in plain text)
3. **Rate limiting** prevents spam
4. **Phone number enumeration protection** (always returns success)
5. **Secure OTP generation** using crypto.randomBytes

## Production Considerations

1. **Monitor SMS costs** - each SMS has a cost
2. **Set up SMS delivery monitoring** 
3. **Configure proper rate limits** for SMS endpoints
4. **Test SMS delivery** in target regions
5. **Have email fallback ready** for SMS failures

## Troubleshooting

### SMS Not Received:
1. Check Termii API key is valid
2. Verify phone number format (+234...)
3. Check Termii account balance
4. Review server logs for errors
5. Test with different phone numbers

### Common Issues:
- **Invalid API key**: Check TERMII_API_KEY in .env
- **Insufficient balance**: Top up Termii account
- **Network issues**: Check internet connectivity
- **Phone number format**: Must be +234 format for Nigeria

## Next Steps

1. **Test thoroughly** with real phone numbers
2. **Monitor SMS delivery rates** 
3. **Set up alerts** for SMS failures
4. **Consider adding SMS for other features** (2FA, notifications)
5. **Implement SMS analytics** and reporting