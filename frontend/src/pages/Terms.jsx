import React from 'react';
import { Shield, CheckCircle, Users, AlertTriangle, Lock, Heart } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-deepBlue-800 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-deepBlue-600 max-w-3xl mx-auto">
              Everything you need to know about using AjoSave safely and responsibly.
            </p>
            <div className="bg-deepBlue-50 rounded-lg p-6 mt-8">
              <p className="text-deepBlue-700">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>
              <p className="text-deepBlue-700 mt-2">
                These terms include our service agreement, privacy policy, security measures, 
                community guidelines, and trust & safety policies.
              </p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-xl shadow-lg border border-deepBlue-100 p-8 mb-12">
            <h2 className="text-2xl font-semibold text-deepBlue-800 mb-6">Quick Navigation</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="#service-terms" className="text-deepBlue-600 hover:text-deepBlue-800 transition-colors">• Service Terms & Conditions</a>
              <a href="#privacy-policy" className="text-deepBlue-600 hover:text-deepBlue-800 transition-colors">• Privacy & Data Protection</a>
              <a href="#security" className="text-deepBlue-600 hover:text-deepBlue-800 transition-colors">• Security & Safety</a>
              <a href="#community" className="text-deepBlue-600 hover:text-deepBlue-800 transition-colors">• Community Guidelines</a>
              <a href="#trust-safety" className="text-deepBlue-600 hover:text-deepBlue-800 transition-colors">• Trust & Safety</a>
              <a href="#contact" className="text-deepBlue-600 hover:text-deepBlue-800 transition-colors">• Contact Information</a>
            </div>
          </div>

          {/* Service Terms */}
          <section id="service-terms" className="mb-16">
            <div className="flex items-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
              <h2 className="text-3xl font-bold text-deepBlue-800">Service Terms & Conditions</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">1. About AjoSave</h3>
                <p className="text-deepBlue-600 mb-4 leading-relaxed">
                  AjoSave is a digital platform that brings traditional group savings (Ajo) into the modern age. 
                  We help communities save money together safely, transparently, and securely. By using our service, 
                  you agree to these terms and our commitment to building trust in community savings.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">2. Who Can Use AjoSave</h3>
                <p className="text-deepBlue-600 mb-4">To use AjoSave, you must:</p>
                <ul className="list-disc pl-6 mb-4 text-deepBlue-600 space-y-2">
                  <li>Be at least 18 years old</li>
                  <li>Be a resident of Nigeria with a valid Nigerian bank account</li>
                  <li>Provide accurate and complete information during registration</li>
                  <li>Have a valid phone number and complete our identity verification</li>
                  <li>Agree to follow our community guidelines and safety rules</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">3. How AjoSave Works</h3>
                <div className="bg-deepBlue-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-deepBlue-800 mb-2">Savings Groups</h4>
                  <p className="text-deepBlue-600 text-sm">
                    Join or create groups where members contribute regularly and take turns receiving the total pot. 
                    It's the traditional Ajo system, but safer and more transparent.
                  </p>
                </div>
                <div className="bg-deepBlue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-deepBlue-800 mb-2">Your Responsibilities</h4>
                  <p className="text-deepBlue-600 text-sm">
                    Make contributions on time, treat group members with respect, keep your account information 
                    up to date, and follow group rules.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">4. Fees and Charges</h3>
                <ul className="list-disc pl-6 mb-4 text-deepBlue-600 space-y-2">
                  <li><strong>Platform Fee:</strong> 2% of each contribution for platform maintenance and security</li>
                  <li><strong>Withdrawal Fee:</strong> ₦100 per withdrawal to your bank account</li>
                  <li><strong>Late Payment Fee:</strong> ₦500 for contributions made after the due date</li>
                  <li><strong>Early Exit Fee:</strong> 5% of remaining contributions if leaving a group early</li>
                </ul>
                <p className="text-deepBlue-600">All fees are clearly shown before you confirm any transaction.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">5. What You Can't Do</h3>
                <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
                  <ul className="list-disc pl-6 text-red-800 space-y-2">
                    <li>Use the platform for illegal activities or money laundering</li>
                    <li>Create multiple accounts or use false information</li>
                    <li>Attempt to defraud or manipulate other users</li>
                    <li>Harass, threaten, or abuse other members</li>
                    <li>Interfere with the platform's security or try to hack our systems</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">6. Account Suspension and Termination</h3>
                <p className="text-deepBlue-600 mb-4">
                  We may suspend or close your account if you violate these terms, engage in fraudulent activity, 
                  or repeatedly fail to make contributions. If your account is closed, you can withdraw any 
                  available balance after completing your group obligations.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy Policy */}
          <section id="privacy-policy" className="mb-16">
            <div className="flex items-center mb-6">
              <Lock className="w-8 h-8 text-blue-600 mr-4" />
              <h2 className="text-3xl font-bold text-deepBlue-800">Privacy & Data Protection</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">Information We Collect</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-deepBlue-800 mb-3">Personal Information</h4>
                    <ul className="text-deepBlue-600 text-sm space-y-1">
                      <li>• Name, phone number, and email</li>
                      <li>• Bank account details for payments</li>
                      <li>• Government ID for verification</li>
                      <li>• Profile photo and address</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-semibold text-deepBlue-800 mb-3">Usage Information</h4>
                    <ul className="text-deepBlue-600 text-sm space-y-1">
                      <li>• How you use the app</li>
                      <li>• Transaction history</li>
                      <li>• Device and location data</li>
                      <li>• Communication in groups</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">How We Use Your Information</h3>
                <ul className="list-disc pl-6 mb-4 text-deepBlue-600 space-y-2">
                  <li>Provide and improve our savings platform</li>
                  <li>Process payments and manage your account</li>
                  <li>Verify your identity and prevent fraud</li>
                  <li>Send important updates and notifications</li>
                  <li>Comply with legal requirements</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">Your Privacy Rights</h3>
                <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                  <p className="text-deepBlue-700">
                    <strong>We never sell your personal information.</strong> You can request access to your data, 
                    ask us to correct it, or delete your account at any time. Contact us at privacy@ajosave.com 
                    for any privacy-related questions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section id="security" className="mb-16">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-purple-600 mr-4" />
              <h2 className="text-3xl font-bold text-deepBlue-800">Security & Safety</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">How We Protect You</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="font-semibold text-deepBlue-800 mb-3 flex items-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Data Encryption
                    </h4>
                    <p className="text-deepBlue-600 text-sm">
                      All your data is encrypted with bank-level security. Your personal and financial 
                      information is protected 24/7.
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-semibold text-deepBlue-800 mb-3 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Fraud Monitoring
                    </h4>
                    <p className="text-deepBlue-600 text-sm">
                      Our system watches for suspicious activity and alerts you immediately if something 
                      doesn't look right.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">Keep Your Account Safe</h3>
                <ul className="list-disc pl-6 mb-4 text-deepBlue-600 space-y-2">
                  <li>Use a strong password and don't share it with anyone</li>
                  <li>Enable two-factor authentication for extra security</li>
                  <li>Keep your phone and app updated</li>
                  <li>Don't use public WiFi for sensitive transactions</li>
                  <li>Report suspicious activity immediately</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Community Guidelines */}
          <section id="community" className="mb-16">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-green-600 mr-4" />
              <h2 className="text-3xl font-bold text-deepBlue-800">Community Guidelines</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">Our Community Values</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-semibold text-deepBlue-800 mb-3 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-red-500" />
                      Respect & Integrity
                    </h4>
                    <p className="text-deepBlue-600 text-sm">
                      Treat all members with respect and be honest in all your interactions.
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-deepBlue-800 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-500" />
                      Inclusivity
                    </h4>
                    <p className="text-deepBlue-600 text-sm">
                      Welcome members from all backgrounds and treat everyone fairly.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">Community Rules</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Do This
                    </h4>
                    <ul className="text-deepBlue-600 text-sm space-y-1">
                      <li>• Pay your contributions on time</li>
                      <li>• Communicate openly and honestly</li>
                      <li>• Help resolve conflicts peacefully</li>
                      <li>• Report suspicious activity</li>
                      <li>• Support your group members</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Don't Do This
                    </h4>
                    <ul className="text-deepBlue-600 text-sm space-y-1">
                      <li>• Harass or threaten other members</li>
                      <li>• Share false information</li>
                      <li>• Try to defraud or scam others</li>
                      <li>• Discriminate against anyone</li>
                      <li>• Spam or send unwanted messages</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">Consequences for Rule Breaking</h3>
                <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
                  <p className="text-red-800 mb-3">
                    <strong>Warning</strong> → <strong>Account Suspension</strong> → <strong>Permanent Ban</strong>
                  </p>
                  <p className="text-deepBlue-600 text-sm">
                    Serious violations like fraud may result in immediate permanent ban and reporting to authorities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Trust & Safety */}
          <section id="trust-safety" className="mb-16">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-orange-600 mr-4" />
              <h2 className="text-3xl font-bold text-deepBlue-800">Trust & Safety</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">How We Build Trust</h3>
                <ul className="list-disc pl-6 mb-4 text-deepBlue-600 space-y-2">
                  <li><strong>Identity Verification:</strong> All users must verify their identity with government ID</li>
                  <li><strong>Secure Payments:</strong> All money is processed through licensed financial institutions</li>
                  <li><strong>Transparent Records:</strong> Every transaction is recorded and visible to group members</li>
                  <li><strong>Default Protection:</strong> We have systems to handle defaults and protect group members</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">What Happens If Someone Defaults</h3>
                <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
                  <p className="text-deepBlue-700 mb-3">
                    <strong>We take defaults seriously.</strong> Our system automatically tracks missed payments 
                    and applies escalating consequences:
                  </p>
                  <ul className="text-deepBlue-600 text-sm space-y-1">
                    <li>• Immediate notifications and grace period</li>
                    <li>• Account restrictions and penalties</li>
                    <li>• Reporting to credit bureaus</li>
                    <li>• Permanent blacklist for chronic defaults</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">Report Issues</h3>
                <p className="text-deepBlue-600 mb-4">
                  If you see suspicious activity, fraud, or someone violating our guidelines, report it immediately 
                  to our support team. We investigate all reports promptly and take appropriate action.
                </p>
              </div>
            </div>
          </section>

          {/* Legal Terms */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-deepBlue-800 mb-6">Legal Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-3">Limitation of Liability</h3>
                <p className="text-deepBlue-600 text-sm leading-relaxed">
                  AjoSave provides a platform for group savings but cannot guarantee that all members will fulfill 
                  their obligations. We work hard to prevent fraud and defaults, but you participate at your own risk. 
                  Our liability is limited to the maximum extent permitted by Nigerian law.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-3">Governing Law</h3>
                <p className="text-deepBlue-600 text-sm leading-relaxed">
                  These terms are governed by Nigerian law. Any disputes will be resolved in Lagos State courts.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-3">Changes to Terms</h3>
                <p className="text-deepBlue-600 text-sm leading-relaxed">
                  We may update these terms from time to time. We'll notify you of any major changes via email or 
                  in-app notification. Continued use of AjoSave means you accept the updated terms.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section id="contact" className="mb-16">
            <div className="bg-deepBlue-600 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-3xl font-bold mb-6">Questions? We're Here to Help</h2>
              <p className="text-deepBlue-100 mb-8 text-lg">
                If you have questions about these terms or need help with anything, our support team is ready to assist you.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">General Support</h3>
                  <p className="text-deepBlue-200 text-sm">support@ajosave.com</p>
                  <p className="text-deepBlue-200 text-sm">+234 800 AJOSAVE</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Privacy & Data</h3>
                  <p className="text-deepBlue-200 text-sm">privacy@ajosave.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Security Issues</h3>
                  <p className="text-deepBlue-200 text-sm">security@ajosave.com</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default Terms;