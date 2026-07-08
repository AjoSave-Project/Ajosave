# Quick OTP Setup Guide

## Current Status
✅ **Development Mode Active** - OTP will be logged to console for testing
❌ **SMS Service** - Termii configuration needs fixing
❌ **Email Service** - Gmail credentials need setup

## For Testing (Current Setup)
The system will now work in development mode:
1. User submits forgot password request
2. OTP is generated and logged to server console
3. User can use the console OTP to reset password
4. Look for: `🔐 [DEV] OTP for +234...: 123456`

## To Fix SMS (Termii)
1. **Check Sender ID**: Log into your Termii dashboard
2. **Verify Sender ID**: Make sure "AjoSave" is approved as a sender ID
3. **Alternative**: Use "Termii" as sender ID (usually pre-approved)
4. **Update .env**: Change `TERMII_SENDER_ID=Termii` if needed

## To Fix Email (Gmail)
1. **Enable 2FA** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update .env**:
   ```env
   EMAIL_USER=otikanelson29@gmail.com
   EMAIL_PASSWORD=your-16-digit-app-password
   ```

## Quick Test Commands

### Test Forgot Password:
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+2349156219654", "email": "otikanelson29@gmail.com"}'
```

### Check Server Logs:
Look for the OTP in console output:
```
🔐 [DEV] OTP for +2349156219654: 123456
```

## Production Checklist
- [ ] Termii sender ID approved
- [ ] Gmail app password configured
- [ ] Remove development mode logging
- [ ] Test SMS delivery
- [ ] Test email delivery
- [ ] Monitor delivery rates

## Troubleshooting

### SMS Issues:
- **ApplicationSenderId not found**: Sender ID not approved in Termii
- **Insufficient balance**: Top up Termii account
- **Invalid phone format**: Must be +234 format

### Email Issues:
- **Invalid login**: Need Gmail app password, not regular password
- **Less secure apps**: Enable 2FA and use app password instead

### Development Mode:
- OTP always logged to console regardless of delivery success
- Use console OTP for testing
- Remove in production by updating NODE_ENV