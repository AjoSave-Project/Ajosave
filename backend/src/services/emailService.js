const nodemailer = require('nodemailer');

/**
 * Email Service
 * 
 * Handles sending emails using Nodemailer with Gmail SMTP
 * Supports OTP emails, welcome emails, and other transactional emails
 */

// Email configuration from environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
// Enforce using process.env.EMAIL_USER as fallback to avoid Gmail sender mismatch
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'AjoSave';

/**
 * Create and configure nodemailer transporter
 */
const createTransporter = () => {
  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.warn('⚠️  Email credentials not configured. EMAIL_USER or EMAIL_PASSWORD missing.');
    return null;
  }

  try {
    if (!nodemailer || typeof nodemailer.createTransport !== 'function') {
      console.error('❌ Nodemailer module not properly loaded');
      return null;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    console.log('✅ Email transporter created successfully');
    return transporter;
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error.message);
    return null;
  }
};

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

/**
 * Send OTP Email
 * 
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} firstName - User's first name for personalization
 * @returns {Promise<Object>} Result object with success status
 */
const sendOtpEmail = async (email, otp, firstName = 'User') => {
  // Placing the OTP code in the subject line dramatically improves inbox placement
  const subject = `${otp} is your AjoSave verification code`;
  
  // Use professional greeting if firstName is 'Temp' (signup flow) or generic 'User'
  const isGenericName = !firstName || firstName === 'Temp' || firstName === 'User';
  const greeting = isGenericName ? 'Welcome to AjoSave!' : `Hello ${firstName}!`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 10px;
        }
        .otp-box {
          background-color: #f3f4f6;
          border: 2px dashed #1e40af;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          color: #1e40af;
          letter-spacing: 8px;
          margin: 10px 0;
        }
        .warning {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">AjoSave</div>
          <p style="color: #6b7280; margin: 0;">Digital Community Saving Made Simple</p>
        </div>
        
        <h2 style="color: #1e40af;">${greeting}</h2>
        
        <p>You requested a verification code to access your AjoSave account. Use the code below to complete your verification:</p>
        
        <div class="otp-box">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Your Verification Code</p>
          <div class="otp-code">${otp}</div>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Valid for 10 minutes</p>
        </div>
        
        <p>Enter this code in the AjoSave app to continue.</p>
        
        <div class="warning">
          <strong>Security Notice:</strong><br>
          Never share this code with anyone. AjoSave staff will never ask for your verification code.
        </div>
        
        <p>If you didn't request this code, please ignore this email or contact our support team if you have concerns about your account security.</p>
        
        <div class="footer">
          <p><strong>AjoSave</strong></p>
          <p>Saving Together, Growing Together</p>
          <p style="font-size: 12px; color: #9ca3af;">
            This is an automated transactional message, please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
${greeting}

Your AjoSave verification code is: ${otp}

This code is valid for 10 minutes. Enter it in the AjoSave app to complete your verification.

Security Notice:
Never share this code with anyone. AjoSave staff will never ask for your verification code.

If you didn't request this code, please ignore this email.

---
AjoSave - Saving Together, Growing Together
  `;

  return await sendEmail(email, subject, textContent, htmlContent);
};

/**
 * Send Welcome Email
 */
const sendWelcomeEmail = async (email, firstName) => {
  const subject = 'Welcome to AjoSave! 🎉';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #1e40af;
          text-align: center;
          margin-bottom: 30px;
        }
        .feature {
          background-color: #f3f4f6;
          padding: 15px;
          margin: 10px 0;
          border-radius: 6px;
          border-left: 4px solid #1e40af;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">AjoSave</div>
        <h2 style="color: #1e40af;">Welcome, ${firstName}! 🎉</h2>
        <p>Thank you for joining AjoSave! We're excited to have you as part of our community savings platform.</p>
        <h3 style="color: #1e40af;">What's Next?</h3>
        <div class="feature">
          <strong>💰 Create or Join a Group</strong><br>
          Start saving with friends, family, or colleagues in a trusted savings group.
        </div>
        <div class="feature">
          <strong>🔒 Secure Savings</strong><br>
          Your funds are protected with bank-level security and transparent tracking.
        </div>
        <div class="feature">
          <strong>📊 Track Progress</strong><br>
          Monitor your savings, contributions, and payouts in real-time.
        </div>
        <p style="margin-top: 30px;">
          <strong>Happy Saving!</strong><br>
          The AjoSave Team
        </p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Welcome to AjoSave, ${firstName}! 🎉

Thank you for joining our community savings platform. We're excited to have you!

What's Next?
- Create or join a savings group
- Start contributing to your financial goals
- Track your progress in real-time

Happy Saving!
The AjoSave Team
  `;

  return await sendEmail(email, subject, textContent, htmlContent);
};

/**
 * Send Password Reset Email
 */
const sendPasswordResetEmail = async (email, otp, firstName = 'User') => {
  const subject = `${otp} is your AjoSave password reset code`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #1e40af;
          text-align: center;
          margin-bottom: 30px;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          color: #1e40af;
          letter-spacing: 8px;
          text-align: center;
          margin: 20px 0;
          padding: 20px;
          background-color: #f3f4f6;
          border-radius: 8px;
        }
        .warning {
          background-color: #fee2e2;
          border-left: 4px solid #ef4444;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">AjoSave</div>
        <h2 style="color: #1e40af;">Password Reset Request</h2>
        <p>Hello ${firstName},</p>
        <p>We received a request to reset your AjoSave password. Use the code below to proceed:</p>
        <div class="otp-code">${otp}</div>
        <p style="text-align: center; color: #6b7280; font-size: 14px;">Valid for 10 minutes</p>
        <div class="warning">
          <strong>Security Alert:</strong><br>
          If you didn't request a password reset, please ignore this email and ensure your account is secure.
        </div>
        <p style="margin-top: 30px;">
          <strong>Stay Safe!</strong><br>
          The AjoSave Team
        </p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Password Reset Request

Hello ${firstName},

We received a request to reset your AjoSave password. Use the code below to proceed:

${otp}

This code is valid for 10 minutes.

Security Alert:
If you didn't request a password reset, please ignore this email and ensure your account is secure.

Stay Safe!
The AjoSave Team
  `;

  return await sendEmail(email, subject, textContent, htmlContent);
};

/**
 * Generic Email Sender
 */
const sendEmail = async (to, subject, text, html) => {
  const transporter = getTransporter();
  
  if (!transporter) {
    const errorMsg = 'Email service is not configured. Please set EMAIL_USER and EMAIL_PASSWORD environment variables.';
    console.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    const mailOptions = {
      from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
      to,
      subject,
      text,
      html,
      // High priority headers for transactional email delivery
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
      },
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully to ${to}`);
    console.log(`   Message ID: ${info.messageId}`);
    
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully',
    };
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Verify email configuration
 */
const verifyEmailConfig = async () => {
  const transporter = getTransporter();
  
  if (!transporter) {
    return false;
  }

  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service verification failed:', error.message);
    return false;
  }
};

module.exports = {
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEmail,
  verifyEmailConfig,
};