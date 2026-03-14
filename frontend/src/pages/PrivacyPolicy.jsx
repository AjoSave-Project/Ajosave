import React from 'react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-deepBlue-800 mb-8">Privacy Policy</h1>
          
          <div className="bg-deepBlue-50 rounded-lg p-6 mb-8">
            <p className="text-deepBlue-700">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <p className="text-deepBlue-700 mt-2">
              This Privacy Policy describes how AjoSave ("we," "our," or "us") collects, uses, and protects your information when you use our service.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-deepBlue-700 mb-3">Personal Information</h3>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Name, email address, and phone number</li>
                <li>Government-issued identification (BVN, NIN)</li>
                <li>Date of birth and residential address</li>
                <li>Bank account information for transactions</li>
                <li>Profile photos and verification documents</li>
              </ul>

              <h3 className="text-xl font-medium text-deepBlue-700 mb-3">Usage Information</h3>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Device information and IP address</li>
                <li>App usage patterns and preferences</li>
                <li>Transaction history and group activities</li>
                <li>Communication records with our support team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Provide and maintain our savings platform services</li>
                <li>Process transactions and manage group activities</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Send important notifications about your account</li>
                <li>Improve our services and develop new features</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">3. Information Sharing</h2>
              <p className="text-deepBlue-600 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li><strong>With group members:</strong> Basic profile information for group participation</li>
                <li><strong>Service providers:</strong> Trusted partners who help us operate our platform</li>
                <li><strong>Legal compliance:</strong> When required by law or to protect our rights</li>
                <li><strong>Business transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">4. Data Security</h2>
              <p className="text-deepBlue-600 mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure servers with regular security audits</li>
                <li>Multi-factor authentication for account access</li>
                <li>Regular security training for our staff</li>
                <li>Compliance with Nigerian data protection laws</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">5. Your Rights</h2>
              <p className="text-deepBlue-600 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability to another service</li>
                <li>File complaints with regulatory authorities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">6. Data Retention</h2>
              <p className="text-deepBlue-600 mb-4">
                We retain your information for as long as necessary to provide our services and comply with legal obligations. 
                Specifically:
              </p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Account information: Until account deletion + 7 years for regulatory compliance</li>
                <li>Transaction records: 7 years as required by financial regulations</li>
                <li>Communication records: 3 years for customer service purposes</li>
                <li>Marketing data: Until you opt-out or 2 years of inactivity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">7. Cookies and Tracking</h2>
              <p className="text-deepBlue-600 mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Essential cookies for platform functionality</li>
                <li>Analytics cookies to understand usage patterns</li>
                <li>Preference cookies to remember your settings</li>
                <li>Security cookies to protect against fraud</li>
              </ul>
              <p className="text-deepBlue-600 mb-4">
                You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">8. Children's Privacy</h2>
              <p className="text-deepBlue-600 mb-4">
                Our service is not intended for individuals under 18 years of age. We do not knowingly collect 
                personal information from children under 18. If you believe we have collected information from 
                a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">9. International Transfers</h2>
              <p className="text-deepBlue-600 mb-4">
                Your information may be transferred to and processed in countries other than Nigeria. 
                We ensure appropriate safeguards are in place to protect your data in accordance with 
                this Privacy Policy and applicable laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">10. Changes to This Policy</h2>
              <p className="text-deepBlue-600 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by email or through our platform. Your continued use of our service after such 
                changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">11. Contact Us</h2>
              <p className="text-deepBlue-600 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-deepBlue-50 rounded-lg p-4">
                <p className="text-deepBlue-700"><strong>Email:</strong> privacy@ajosave.com</p>
                <p className="text-deepBlue-700"><strong>Phone:</strong> +234 800 AJOSAVE</p>
                <p className="text-deepBlue-700"><strong>Address:</strong> AjoSave Privacy Office, Lagos, Nigeria</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default PrivacyPolicy;