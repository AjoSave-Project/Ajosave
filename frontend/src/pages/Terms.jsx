import { FileText, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  }
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans antialiased scrollbar-brand">
      <HomeNavbar />

      <main className="container mx-auto px-4 py-12 lg:py-16 max-w-5xl">

        {/* DOCUMENT CONTAINER */}
        <article className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-8 sm:p-12 lg:p-16 relative">

          {/* Navigation Breadcrumb */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => handleNavigation('/home')}
              className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-deepBlue-800 transition-colors gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back home
            </button>
            <span className="text-xs font-mono text-slate-400">DOC-REF-2026-V2</span>
          </div>

          {/* Header */}
          <header className="border-b border-slate-200 pb-8 mb-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-deepBlue-50 text-deepBlue-800 text-xs font-semibold border border-deepBlue-200/60">
                <FileText className="w-3.5 h-3.5" /> Legal Document
              </span>
              <div className="text-xs text-slate-500 font-mono space-x-4">
                <span>Version 3.1</span>
                <span>•</span>
                <span>Jurisdiction: Federal Republic of Nigeria</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Terms of Service
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-3xl">
              These are the rules that govern how AjoSave works and what you can expect from us. Please read them before you create an account. By signing up, you agree to everything here.
            </p>
          </header>

          {/* Quick Navigation / Table of Contents */}
          <nav className="mb-12 bg-slate-50 border border-slate-200 rounded-lg p-6">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Contents
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4 text-xs font-medium text-slate-700">
              <a href="#section-1" className="hover:text-deepBlue-800 transition-colors">1. Who Can Use AjoSave</a>
              <a href="#section-2" className="hover:text-deepBlue-800 transition-colors">2. Fees</a>
              <a href="#section-3" className="hover:text-deepBlue-800 transition-colors">3. Your Data & Privacy</a>
              <a href="#section-4" className="hover:text-deepBlue-800 transition-colors">4. Keeping Your Account Safe</a>
              <a href="#section-5" className="hover:text-deepBlue-800 transition-colors">5. How to Behave in a Group</a>
              <a href="#section-6" className="hover:text-deepBlue-800 transition-colors">6. What Happens if Someone Defaults</a>
            </div>
          </nav>

          {/* DOCUMENT SECTIONS */}
          <div className="space-y-12 text-slate-700 leading-relaxed text-sm sm:text-base">

            {/* SECTION 1 */}
            <section id="section-1" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                1. Who Can Use AjoSave
              </h2>
              <p>
                AjoSave is a digital platform for community savings groups. We help people create groups, track contributions, manage rotations, and receive payouts — all in one place.
              </p>

              <div className="bg-slate-50 border-l-2 border-deepBlue-800 p-4 rounded-r-md my-4 space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-900">To create an account you must</h3>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Be at least 18 years old.</li>
                  <li>Reside in Nigeria and hold a valid Bank Verification Number (BVN) or National Identification Number (NIN).</li>
                  <li>Have an active account with a licensed Nigerian commercial bank.</li>
                </ul>
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="section-2" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                2. Fees
              </h2>
              <p>
                We are transparent about what we charge and when. All fees are applied automatically and shown clearly before any transaction completes.
              </p>

              <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Fee</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">When it applies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-semibold">Platform fee</td>
                      <td className="p-3 font-mono">2.0%</td>
                      <td className="p-3">Deducted per contribution to cover platform infrastructure and security.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Bank withdrawal fee</td>
                      <td className="p-3 font-mono">₦100</td>
                      <td className="p-3">Charged once per payout when funds are sent to an external bank account.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Late payment fee</td>
                      <td className="p-3 font-mono">₦500</td>
                      <td className="p-3">Applied when a contribution is made after the group's grace period.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Early exit fee</td>
                      <td className="p-3 font-mono">5.0%</td>
                      <td className="p-3">Calculated on remaining contributions if you leave an active group early.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 3 */}
            <section id="section-3" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                3. Your Data & Privacy
              </h2>
              <p>
                We collect personal information — your name, phone number, and government ID — only to verify your identity and process transactions. This is required to keep groups safe for everyone.
              </p>
              <p>
                We operate in line with the Nigeria Data Protection Regulation (NDPR). We do not sell your data to anyone.
              </p>
            </section>

            {/* SECTION 4 */}
            <section id="section-4" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                4. Keeping Your Account Safe
              </h2>
              <p>
                All data on AjoSave is transmitted over encrypted connections. You are responsible for keeping your login credentials private, including any two-factor authentication codes. If you think your account has been compromised, contact us immediately.
              </p>
            </section>

            {/* SECTION 5 */}
            <section id="section-5" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                5. How to Behave in a Group
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 my-4">
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> What we expect from you
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pay on time. Communicate honestly with your group. Report anything suspicious to our team. Groups work because members show up for each other.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> What will get you removed
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Impersonating another person, attempting to defraud group members, harassment, or any deliberate misuse of the platform. Violations result in immediate account suspension and may be referred for legal action.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 6 */}
            <section id="section-6" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                6. What Happens if Someone Defaults
              </h2>
              <p>
                Missing a payment affects the whole group. Here is how we handle it:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1">
                <li>The app sends reminders before every due date to reduce the chance of a missed payment.</li>
                <li>If a payment is missed, the group is notified immediately and the member's wallet is restricted.</li>
                <li>Unresolved defaults may result in permanent account suspension and formal recovery action.</li>
              </ul>
            </section>

            {/* LEGAL DISCLAIMER */}
            <section className="mt-12 pt-8 border-t border-slate-200 text-xs text-slate-500 space-y-2">
              <p className="font-bold text-slate-700">Governing law</p>
              <p>
                These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes will be handled by the courts of Lagos State, Nigeria.
              </p>
            </section>

          </div>
        </article>
      </main>

      <HomeFooter />
    </div>
  );
};

export default Terms;