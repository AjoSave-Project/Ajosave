import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowLeft, Mail, Phone, FileText } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const RefundPolicy = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans antialiased">
      <HomeNavbar />

      <main className="container mx-auto px-4 py-12 lg:py-16 max-w-5xl">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => handleNavigation('/terms')}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-deepBlue-800 transition-colors gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Terms of Service
          </button>
          <span className="text-xs font-mono text-slate-400">DOC-REF-2026-V2</span>
        </div>

        {/* DOCUMENT CONTAINER */}
        <article className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-8 sm:p-12 lg:p-16 relative">
          
          {/* Document Top Meta Bar */}
          <header className="border-b border-slate-200 pb-8 mb-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-deepBlue-50 text-deepBlue-800 text-xs font-semibold border border-deepBlue-200/60">
                <FileText className="w-3.5 h-3.5" /> Policy Document
              </span>
              <div className="text-xs text-slate-500 font-mono space-x-4">
                <span>Effective Date: January 1, 2026</span>
                <span>•</span>
                <span>Last Updated: July 2026</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Refund Policy
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-3xl">
              We want to be clear about when refunds are possible, how to request one, and what to expect when you do. This page covers all of it.
            </p>
          </header>

          {/* Quick Overview Grid */}
          <section className="mb-12 bg-slate-50 border border-slate-200 rounded-lg p-6">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              At a glance
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-deepBlue-800 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Request window</h3>
                  <p className="text-xs text-slate-600 mt-0.5">Up to 90 days from the transaction date</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-deepBlue-800 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Processing time</h3>
                  <p className="text-xs text-slate-600 mt-0.5">5–7 business days after approval</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-deepBlue-800 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Where it goes</h3>
                  <p className="text-xs text-slate-600 mt-0.5">Back to your original payment source</p>
                </div>
              </div>
            </div>
          </section>

          {/* DOCUMENT BODY */}
          <div className="space-y-12 text-slate-700 leading-relaxed text-sm sm:text-base">

            {/* SECTION 1 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                1. When a refund is possible
              </h2>
              <p>
                Not every transaction can be reversed — group savings involve real commitments to real people. But some situations clearly warrant a refund, and we will process those quickly.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mt-4">
                {/* Eligible Column */}
                <div className="border border-emerald-200 bg-emerald-50/30 rounded-lg p-5">
                  <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> You are eligible if
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>The same transaction was charged twice within 48 hours.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>A transaction occurred without your authorisation and was reported within 30 days.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>A technical error on our end caused an incorrect deduction.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>Your group was dissolved before the first payout cycle started.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>A platform failure prevented a transaction from completing.</span>
                    </li>
                  </ul>
                </div>

                {/* Ineligible Column */}
                <div className="border border-amber-200 bg-amber-50/30 rounded-lg p-5">
                  <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> You are not eligible if
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>You chose to leave a group after a savings cycle had already started.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>The transaction completed exactly as you requested.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>You sent funds to the wrong group because of a mistake you made.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>More than 90 days have passed since the transaction date.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 2 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                2. How to request a refund
              </h2>
              <p>
                Submit your request with your transaction reference number and a short description of what went wrong. We will take it from there.
              </p>

              <div className="grid sm:grid-cols-4 gap-4 mt-4">
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                  <span className="text-xs font-mono font-bold text-deepBlue-800 uppercase">Step 01</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">Submit</h4>
                  <p className="text-xs text-slate-600 mt-1">Send us your transaction ID and what happened.</p>
                  <span className="inline-block mt-3 text-[10px] font-medium text-slate-500">Immediate</span>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                  <span className="text-xs font-mono font-bold text-deepBlue-800 uppercase">Step 02</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">Review</h4>
                  <p className="text-xs text-slate-600 mt-1">We check the transaction logs and group records.</p>
                  <span className="inline-block mt-3 text-[10px] font-medium text-slate-500">3–5 business days</span>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                  <span className="text-xs font-mono font-bold text-deepBlue-800 uppercase">Step 03</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">Decision</h4>
                  <p className="text-xs text-slate-600 mt-1">We notify you of the outcome — approved or declined.</p>
                  <span className="inline-block mt-3 text-[10px] font-medium text-slate-500">Within 24 hours</span>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                  <span className="text-xs font-mono font-bold text-deepBlue-800 uppercase">Step 04</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">Refund</h4>
                  <p className="text-xs text-slate-600 mt-1">Funds are returned to your original payment source.</p>
                  <span className="inline-block mt-3 text-[10px] font-medium text-slate-500">5–7 business days</span>
                </div>
              </div>
            </section>

            {/* SECTION 3 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                3. Special cases & appeals
              </h2>
              
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">3.1 If your group is dissolved before it starts</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  If a group is closed before the first payout rotation begins, every member's contribution is returned in full within 10 business days. No fees are deducted.
                </p>

                <h3 className="text-sm font-bold text-slate-900 pt-2">3.2 Appealing a declined request</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  If your refund was declined and you disagree with the decision, you can appeal within 14 days by sending additional supporting information to <span className="font-mono text-deepBlue-800">support@ajosave.com</span>. We will review it carefully. Appeals decisions are final.
                </p>
              </div>
            </section>

            {/* DOCUMENT FOOTER / CONTACT BOX */}
            <section className="mt-12 pt-8 border-t border-slate-200">
              <div className="bg-slate-900 text-white rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-lg font-bold">Need help with a refund?</h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Get in touch with our team. We aim to respond within one business day.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-deepBlue-400" /> ajosavesupport@gmail.com</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-deepBlue-400" /> +234 915 62 196 54</span>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigation('/contact')}
                  className="bg-deepBlue-600 hover:bg-deepBlue-500 text-white text-xs font-semibold px-5 py-3 rounded-lg transition-colors shrink-0"
                >
                  Contact Us
                </button>
              </div>
            </section>

          </div>
        </article>
      </main>

      <HomeFooter />
    </div>
  );
};

export default RefundPolicy;