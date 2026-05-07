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
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'AjoSave';

/**
 * Create and configure nodemailer transporter
 */
const createTransporter = () => {
  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.warn('⚠️  Email credentials not configured. Emails will be logged to console only.');
    return null;
  }

  return nodemailer.createTransporter({
    service: 'gmail', // Use Gmail SMTP
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD, // Use App Password, not regular password
    },
  });
};

const transporter = createTransporter();

/**
 * Send OTP Email
 * 
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} firstName - User's first name for personalization
 * @returns {Promise<Object>} Result object with success status
 */
const sendOtpEmail = async (email, otp, firstName = 'User') => {
  const subject = 'Your AjoSave Verification Code';
  
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
        .button {
          display: inline-block;
          background-color: #1e40af;
          color: #ffffff;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">AjoSave</div>
          <p style="color: #6b7280; margin: 0;">Digital Community Saving Made Simple</p>
        </div>
        
        <h2 style="color: #1e40af;">Hello ${firstName}!</h2>
        
        <p>You requested a verification code to access your AjoSave account. Use the code below to complete your verification:</p>
        
        <div class="otp-box">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Your Verification Code</p>
          <div class="otp-code">${otp}</div>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Valid for 10 minutes</p>
        </div>
        
        <p>Enter this code in the AjoSave app to continue.</p>
        
        <div class="warning">
          <strong>⚠️ Security Notice:</strong><br>
          Never share this code with anyone. AjoSave staff will never ask for your verification code.
        </div>
        
        <p>If you didn't request this code, please ignore this email or contact our support team if you have concerns about your account security.</p>
        
        <div class="footer">
          <p><strong>AjoSave</strong></p>
          <p>Saving Together, Growing Together</p>
          <p style="font-size: 12px; color: #9ca3af;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Hello ${firstName}!

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
 * 
 * @param {string} email - Recipient email address
 * @param {string} firstName - User's first name
 * @returns {Promise<Object>} Result object with success status
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
        
        <p>If you have any questions, our support team is here to help!</p>
        
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

If you have any questions, our support team is here to help!

Happy Saving!
The AjoSave Team
  `;

  return await sendEmail(email, subject, textContent, htmlContent);
};

/**
 * Send Password Reset Email
 * 
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} firstName - User's first name
 * @returns {Promise<Object>} Result object with success status
 */
const sendPasswordResetEmail = async (email, otp, firstName = 'User') => {
  const subject = 'Reset Your AjoSave Password';
  
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
          <strong>⚠️ Security Alert:</strong><br>
          If you didn't request a password reset, please ignore this email and ensure your account is secure.
        </div>
        
        <p>For security reasons, this code will expire in 10 minutes.</p>
        
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
 * 
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content
 * @param {string} html - HTML content
 * @returns {Promise<Object>} Result object with success status
 */
const sendEmail = async (to, subject, text, html) => {
  // If no transporter (no email config), throw error
  if (!transporter) {
    console.error('❌ Email service not configured. Please set EMAIL_USER and EMAIL_PASSWORD environment variables.');
    throw new Error('Email service is not configured. Please contact support.');
  }

  try {
    const mailOptions = {
      from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
      to,
      subject,
      text,
      html,
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
 * 
 * @returns {Promise<boolean>} True if email is configured and working
 */
const verifyEmailConfig = async () => {
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
