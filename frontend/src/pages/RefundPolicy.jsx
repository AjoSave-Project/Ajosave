import React from 'react';
import { CheckCircle, AlertTriangle, Clock, DollarSign, ArrowRight, FileText } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const RefundPolicy = () => {
  const refundScenarios = [
    {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      title: "Eligible for Refund",
      items: [
        "Duplicate transactions within 24 hours",
        "Unauthorized transactions reported within 30 days",
        "Technical errors causing incorrect deductions",
        "Group cancellation before payout cycle begins",
        "Service failures affecting transaction completion"
      ]
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
      title: "Not Eligible for Refund",
      items: [
        "Voluntary group withdrawal after cycle starts",
        "Transactions completed as requested by user",
        "Payments made to incorrect group (user error)",
        "Refunds requested after 90 days",
        "Transactions with confirmed recipient confirmation"
      ]
    }
  ];

  const refundProcess = [
    {
      step: 1,
      title: "Submit Request",
      description: "Contact our support team with transaction details and reason for refund request",
      timeframe: "Immediate"
    },
    {
      step: 2,
      title: "Investigation",
      description: "Our team reviews the transaction and verifies eligibility",
      timeframe: "3-5 business days"
    },
    {
      step: 3,
      title: "Decision",
      description: "You'll receive notification of approval or denial with detailed explanation",
      timeframe: "Within 1 day"
    },
    {
      step: 4,
      title: "Processing",
      description: "Approved refunds are processed to original payment method",
      timeframe: "5-7 business days"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-deepBlue-800 mb-4">
              Refund Policy
            </h1>
            <p className="text-xl text-deepBlue-600 max-w-3xl mx-auto">
              We're committed to fair and transparent refund practices for all our users.
            </p>
            <div className="bg-deepBlue-50 rounded-lg p-6 mt-8">
              <p className="text-deepBlue-700">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>
              <p className="text-deepBlue-700 mt-2">
                This policy outlines when and how refunds are processed on the AjoSave platform.
              </p>
            </div>
          </div>

          {/* Quick Overview */}
          <div className="bg-white rounded-xl shadow-lg border border-deepBlue-100 p-8 mb-12">
            <h2 className="text-2xl font-semibold text-deepBlue-800 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3" />
              Quick Overview
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <Clock className="w-6 h-6 text-deepBlue-600 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-deepBlue-800 mb-1">Request Window</h3>
                  <p className="text-deepBlue-600">Up to 90 days from transaction date</p>
                </div>
              </div>
              <div className="flex items-start">
                <DollarSign className="w-6 h-6 text-green-600 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-deepBlue-800 mb-1">Processing Time</h3>
                  <p className="text-deepBlue-600">5-7 business days after approval</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-purple-600 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-deepBlue-800 mb-1">Refund Method</h3>
                  <p className="text-deepBlue-600">Original payment method used</p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Eligibility */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-deepBlue-800 mb-8 flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
              Refund Eligibility
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {refundScenarios.map((scenario, index) => (
                <div key={index} className="bg-white rounded-xl p-8 border border-deepBlue-100 shadow-lg">
                  <div className="flex items-center mb-6">
                    {scenario.icon}
                    <h3 className="text-xl font-semibold text-deepBlue-800 ml-3">
                      {scenario.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {scenario.items.map((item, idx) => (
                      <li key={idx} className="flex items-start text-deepBlue-600">
                        <span className="inline-block w-2 h-2 bg-deepBlue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* How Refunds Work */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-deepBlue-800 mb-8 flex items-center">
              <ArrowRight className="w-8 h-8 text-blue-600 mr-4" />
              How Refunds Work
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {refundProcess.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-6 border border-deepBlue-100 shadow-lg h-full">
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-deepBlue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-deepBlue-600 text-sm mb-3">
                        {item.description}
                      </p>
                      <div className="bg-deepBlue-50 rounded-lg p-2">
                        <p className="text-deepBlue-700 text-xs font-medium">
                          Timeline: {item.timeframe}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < refundProcess.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-deepBlue-200"></div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Detailed Policy */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-deepBlue-800 mb-8">Detailed Policy</h2>
            
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 border border-deepBlue-100 shadow-lg">
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">1. Refund Request Submission</h3>
                <p className="text-deepBlue-600 leading-relaxed mb-4">
                  To request a refund, email support@ajosave.com. 
                  You'll need to provide:
                </p>
                <ul className="list-disc pl-6 mb-4 text-deepBlue-600 space-y-1">
                  <li>Transaction ID and reference number</li>
                  <li>Date and amount of the transaction</li>
                  <li>Detailed reason for the refund request</li>
                  <li>Any supporting documentation or screenshots</li>
                </ul>
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="text-deepBlue-700 text-sm">
                    <strong>Important:</strong> Requests must be submitted within 90 days of the transaction date.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 border border-deepBlue-100 shadow-lg">
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">2. Investigation Process</h3>
                <p className="text-deepBlue-600 leading-relaxed mb-4">
                  Our support team will investigate your claim within 3-5 business days. During this period, we:
                </p>
                <ul className="list-disc pl-6 mb-4 text-deepBlue-600 space-y-1">
                  <li>Review transaction logs and payment records</li>
                  <li>Verify group membership and contribution history</li>
                  <li>Check for any technical issues or system errors</li>
                  <li>May request additional information if needed</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 border border-deepBlue-100 shadow-lg">
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">3. Special Cases</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-deepBlue-800 mb-2">Group Cancellation</h4>
                    <p className="text-deepBlue-600 text-sm">
                      If a group is cancelled before the payout cycle begins, all contributions are automatically 
                      refunded in full within 10 business days.
                    </p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-deepBlue-800 mb-2">Unauthorized Transactions</h4>
                    <p className="text-deepBlue-600 text-sm">
                      If you report an unauthorized transaction, we'll conduct a full security investigation. 
                      We may issue a provisional refund while investigating.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-deepBlue-800 mb-2">Technical Errors</h4>
                    <p className="text-deepBlue-600 text-sm">
                      If our system causes an error resulting in incorrect charges, we'll refund the difference 
                      immediately upon verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 border border-deepBlue-100 shadow-lg">
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">4. Appeals Process</h3>
                <p className="text-deepBlue-600 leading-relaxed mb-4">
                  If you disagree with our refund decision, you can appeal within 14 days. To appeal:
                </p>
                <ul className="list-disc pl-6 mb-4 text-deepBlue-600 space-y-1">
                  <li>Submit your appeal with additional evidence to support@ajosave.com</li>
                  <li>Include any new documentation that supports your claim</li>
                  <li>Explain why you believe the original decision was incorrect</li>
                </ul>
                <p className="text-deepBlue-600 text-sm">
                  Our management team will review your appeal and respond within 5 business days.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="mb-16">
            <div className="bg-deepBlue-600 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-3xl font-bold mb-6">Need Help with a Refund?</h2>
              <p className="text-deepBlue-100 mb-8 text-lg">
                Our support team is here to help you with any refund questions or requests.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold mb-3">Contact Methods</h3>
                  <div className="space-y-2">
                    <p className="text-deepBlue-200 text-sm">Email: support@ajosave.com</p>
                    <p className="text-deepBlue-200 text-sm">Phone: +234 800 AJOSAVE</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Response Times</h3>
                  <div className="space-y-2">
                    <p className="text-deepBlue-200 text-sm">Email: Within 24 hours</p>
                    <p className="text-deepBlue-200 text-sm">Phone: During business hours</p>
                    <p className="text-deepBlue-200 text-sm">Urgent issues: Same day</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-deepBlue-600 px-8 py-3 rounded-full font-semibold hover:bg-deepBlue-50 transition-colors">
                  Contact Support
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-deepBlue-600 transition-colors">
                  Back to Terms
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default RefundPolicy;
