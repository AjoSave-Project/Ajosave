# Gmail Setup Guide for AjoSave OTP Emails

## Quick Setup (5 minutes)

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", click on **2-Step Verification**
4. Follow the prompts to enable 2FA (you'll need your phone)

### Step 2: Generate App Password

1. After enabling 2FA, go to: https://myaccount.google.com/apppasswords
2. You might need to sign in again
3. Under "Select app", choose **Mail**
4. Under "Select device", choose **Other (Custom name)**
5. Enter "AjoSave Backend" as the name
6. Click **Generate**
7. Google will show you a 16-character password (e.g., `abcd efgh ijkl mnop`)
8. **Copy this password** - you won't be able to see it again!

### Step 3: Update Environment Variables

1. Open `backend/.env`
2. Update these variables:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop  # Remove spaces from the app password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=AjoSave
```

**Important:** Remove all spaces from the app password!

### Step 4: Test the Configuration

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Look for this log message:
   ```
   ✅ Email service is ready
   ```

3. Test by registering a new user in the mobile app
4. Check your email for the OTP code

## Troubleshooting

### "Invalid login" or "Username and Password not accepted"

**Solution:** Make sure you're using an **App Password**, not your regular Gmail password.

1. Go back to https://myaccount.google.com/apppasswords
2. Generate a new app password
3. Copy it without spaces
4. Update `.env` file
5. Restart the server

### "Less secure app access"

**Solution:** You don't need to enable "Less secure app access" when using App Passwords. App Passwords are the secure way to authenticate.

### Emails not sending

**Check these:**

1. **2FA is enabled** on your Gmail account
2. **App Password is correct** (no spaces, 16 characters)
3. **EMAIL_USER matches** the Gmail account that generated the app password
4. **Server is restarted** after changing `.env`
5. **No firewall blocking** SMTP port 587 or 465

### Emails going to spam

**Solutions:**

1. **Add to contacts**: Have users add your email to their contacts
2. **SPF/DKIM**: Set up proper email authentication (advanced)
3. **Warm up**: Start with low volume and gradually increase
4. **Content**: Avoid spam trigger words in email content

### Rate limiting

Gmail has sending limits:
- **Free Gmail**: ~500 emails/day
- **Google Workspace**: ~2,000 emails/day

For higher volumes, consider:
- SendGrid (99,000 free emails/month)
- AWS SES (62,000 free emails/month)
- Mailgun (5,000 free emails/month)

## Alternative: Using Google Workspace

If you have Google Workspace (paid):

1. Use your workspace email: `admin@yourdomain.com`
2. Generate app password the same way
3. Higher sending limits (2,000/day)
4. Better deliverability

## Alternative Email Providers

### SendGrid (Recommended for Production)

```env
# Install: npm install @sendgrid/mail
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=AjoSave
```

### AWS SES

```env
# Install: npm install @aws-sdk/client-ses
EMAIL_PROVIDER=ses
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=AjoSave
```

### Mailgun

```env
# Install: npm install mailgun-js
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=your-api-key
MAILGUN_DOMAIN=mg.yourdomain.com
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=AjoSave
```

## Development Mode

For development/testing without email configuration:

1. Leave `EMAIL_USER` and `EMAIL_PASSWORD` empty or commented out
2. OTPs will be logged to console:
   ```
   📧 ========== DEV OTP ==========
      Email : user@example.com
      Code  : 123456
   ================================
   ```
3. Mobile app will auto-fill the OTP
4. Everything works normally for testing

## Security Best Practices

1. **Never commit** `.env` file to git
2. **Use different accounts** for dev and production
3. **Rotate app passwords** periodically
4. **Monitor usage** in Google Account activity
5. **Revoke unused** app passwords
6. **Use environment-specific** email accounts:
   - Dev: `dev@yourdomain.com`
   - Staging: `staging@yourdomain.com`
   - Production: `noreply@yourdomain.com`

## Monitoring

### Check Email Delivery

1. **Gmail Sent folder**: Verify emails are being sent
2. **Backend logs**: Look for success/error messages
3. **User reports**: Monitor if users aren't receiving emails

### Gmail Activity

1. Go to https://myaccount.google.com/device-activity
2. Check for "Mail" app activity
3. Monitor for suspicious activity

## FAQ

**Q: Can I use a free Gmail account?**  
A: Yes, but with 500 emails/day limit. Fine for development and small apps.

**Q: Do I need a custom domain?**  
A: No, Gmail works fine. Custom domain improves deliverability.

**Q: What if I hit the sending limit?**  
A: Upgrade to Google Workspace or use SendGrid/AWS SES.

**Q: Can I use multiple Gmail accounts?**  
A: Yes, but manage them separately. Better to use a dedicated service.

**Q: Is this secure?**  
A: Yes, App Passwords are secure and recommended by Google.

**Q: Can users reply to these emails?**  
A: Yes, but you'll need to handle replies. Consider using `noreply@` for transactional emails.

## Support

If you're still having issues:

1. Check backend logs for detailed error messages
2. Test with a simple nodemailer script
3. Verify Gmail account settings
4. Check firewall/network settings
5. Try a different Gmail account

---

**Last Updated**: May 7, 2026  
**Tested With**: Gmail (Free & Workspace), Node.js 18+, Nodemailer 6.9+
