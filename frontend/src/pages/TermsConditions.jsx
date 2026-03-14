import React from 'react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-deepBlue-800 mb-8">Terms & Conditions</h1>
          
          <div className="bg-deepBlue-50 rounded-lg p-6 mb-8">
            <p className="text-deepBlue-700">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <p className="text-deepBlue-700 mt-2">
              These Terms and Conditions ("Terms") govern your use of AjoSave's digital savings platform. 
              By using our service, you agree to these terms.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-deepBlue-600 mb-4">
                By accessing or using AjoSave's platform, you agree to be bound by these Terms and Conditions 
                and our Privacy Policy. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">2. Eligibility</h2>
              <p className="text-deepBlue-600 mb-4">To use AjoSave, you must:</p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Be at least 18 years old</li>
                <li>Be a resident of Nigeria</li>
                <li>Have a valid Nigerian bank account</li>
                <li>Provide accurate and complete information</li>
                <li>Have a valid phone number and email address</li>
                <li>Pass our identity verification process</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">3. Account Registration</h2>
              <p className="text-deepBlue-600 mb-4">
                When creating an account, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information as needed</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">4. How AjoSave Works</h2>
              
              <h3 className="text-xl font-medium text-deepBlue-700 mb-3">Savings Groups</h3>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Groups consist of verified members who contribute regularly</li>
                <li>Each member receives the total collection amount in rotation</li>
                <li>Payment schedules and amounts are agreed upon by group members</li>
                <li>All transactions are processed through our secure platform</li>
              </ul>

              <h3 className="text-xl font-medium text-deepBlue-700 mb-3">Member Obligations</h3>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Make contributions on time as agreed</li>
                <li>Participate actively and respectfully in group activities</li>
                <li>Maintain accurate profile and payment information</li>
                <li>Follow group rules and community guidelines</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">5. Fees and Charges</h2>
              <p className="text-deepBlue-600 mb-4">
                AjoSave charges the following fees:
              </p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li><strong>Platform Fee:</strong> 2% of each contribution for platform maintenance</li>
                <li><strong>Transaction Fees:</strong> Standard bank charges apply for transfers</li>
                <li><strong>Late Payment Fee:</strong> ₦500 for contributions made after the due date</li>
                <li><strong>Early Exit Fee:</strong> 5% of remaining contributions if leaving before payout</li>
              </ul>
              <p className="text-deepBlue-600 mb-4">
                All fees are clearly disclosed before you join a group. We reserve the right to modify 
                fees with 30 days' notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibent text-deepBlue-800 mb-4">6. Payment Terms</h2>
              
              <h3 className="text-xl font-medium text-deepBlue-700 mb-3">Contributions</h3>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Contributions must be made by the agreed deadline</li>
                <li>Payments are processed automatically from your linked bank account</li>
                <li>Failed payments may result in late fees or group removal</li>
                <li>All contributions are final and non-refundable once processed</li>
              </ul>

              <h3 className="text-xl font-medium text-deepBlue-700 mb-3">Payouts</h3>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Payouts are made according to the predetermined schedule</li>
                <li>Funds are transferred directly to your registered bank account</li>
                <li>Payout processing may take 1-3 business days</li>
                <li>You must have a valid bank account to receive payouts</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">7. Prohibited Activities</h2>
              <p className="text-deepBlue-600 mb-4">You may not:</p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Use the platform for illegal activities or money laundering</li>
                <li>Create multiple accounts or use false information</li>
                <li>Attempt to manipulate or defraud other users</li>
                <li>Interfere with the platform's security or functionality</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Use automated systems to access the platform</li>
                <li>Reverse engineer or copy our software</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">8. Risk Disclosure</h2>
              <p className="text-deepBlue-600 mb-4">
                By using AjoSave, you acknowledge and accept the following risks:
              </p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Group members may default on their contributions</li>
                <li>Technical issues may temporarily affect service availability</li>
                <li>Economic conditions may impact member participation</li>
                <li>Regulatory changes may affect our operations</li>
                <li>Your funds are not guaranteed by government deposit insurance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">9. Limitation of Liability</h2>
              <p className="text-deepBlue-600 mb-4">
                AjoSave's liability is limited to the maximum extent permitted by law. We are not liable for:
              </p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Actions or omissions of other group members</li>
                <li>Technical failures beyond our reasonable control</li>
                <li>Losses due to your failure to secure your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">10. Dispute Resolution</h2>
              <p className="text-deepBlue-600 mb-4">
                In case of disputes:
              </p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Contact our support team first for resolution</li>
                <li>Participate in good faith in mediation if requested</li>
                <li>Disputes will be resolved under Nigerian law</li>
                <li>Lagos State courts have exclusive jurisdiction</li>
                <li>Class action lawsuits are waived where legally permissible</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">11. Account Termination</h2>
              
              <h3 className="text-xl font-medium text-deepBlue-700 mb-3">By You</h3>
              <p className="text-deepBlue-600 mb-4">
                You may close your account at any time, subject to completing your group obligations 
                and paying any outstanding fees.
              </p>

              <h3 className="text-xl font-medium text-deepBlue-700 mb-3">By Us</h3>
              <p className="text-deepBlue-600 mb-4">
                We may suspend or terminate your account for:
              </p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Violation of these Terms</li>
                <li>Fraudulent or suspicious activity</li>
                <li>Repeated payment failures</li>
                <li>Providing false information</li>
                <li>Legal or regulatory requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">12. Changes to Terms</h2>
              <p className="text-deepBlue-600 mb-4">
                We may modify these Terms at any time. Material changes will be communicated via:
              </p>
              <ul className="list-disc pl-6 mb-4 text-deepBlue-600">
                <li>Email notification to your registered address</li>
                <li>In-app notifications</li>
                <li>Updates on our website</li>
              </ul>
              <p className="text-deepBlue-600 mb-4">
                Continued use of our service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">13. Governing Law</h2>
              <p className="text-deepBlue-600 mb-4">
                These Terms are governed by the laws of the Federal Republic of Nigeria. 
                Any disputes will be resolved in the courts of Lagos State, Nigeria.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-deepBlue-800 mb-4">14. Contact Information</h2>
              <p className="text-deepBlue-600 mb-4">
                For questions about these Terms, contact us:
              </p>
              <div className="bg-deepBlue-50 rounded-lg p-4">
                <p className="text-deepBlue-700"><strong>Email:</strong> legal@ajosave.com</p>
                <p className="text-deepBlue-700"><strong>Phone:</strong> +234 800 AJOSAVE</p>
                <p className="text-deepBlue-700"><strong>Address:</strong> AjoSave Legal Department, Lagos, Nigeria</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default TermsConditions;