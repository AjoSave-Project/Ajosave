import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
    alert('Thank you for reaching out! Our support team will get back to you shortly.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <HomeNavbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-br from-blue-950 via-deepBlue-900 to-blue-900 text-white py-16 text-center relative overflow-hidden">
        {/* Architectural grid lines background (from About page) */}
        <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-12 pointer-events-none opacity-[0.04]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-blue-300 h-full last:border-r-0" />
          ))}
        </div>

        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-4 tracking-tight">Contact Our Team</h1>
          <p className="text-blue-100/90 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Have questions about group savings, payouts, or account verification? Send us a message or connect directly.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12">

          {/* Left: Contact Form Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/40">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-8">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              <div>
                <label htmlFor="name" className="block font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block font-semibold text-slate-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-slate-700"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="account">Account & KYC Issues</option>
                  <option value="group">Group Management</option>
                  <option value="payment">Payment & Payouts</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block font-semibold text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Right: Quick Channels & Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Direct Contact Cards */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                Direct Channels
              </h3>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Us</h4>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">ajosavesupport@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Call or WhatsApp</h4>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">+234 809 19 334 5365</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Support Hours</h4>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">Mon – Fri: 8:00 AM – 6:00 PM WAT</p>
                </div>
              </div>
            </div>

            {/* Instant WhatsApp Support CTA */}
            <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <h3 className="text-lg font-bold text-white">Need Quick Help?</h3>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Chat directly with our team on WhatsApp for instant assistance regarding active group savings.
                </p>
                <button
                  onClick={() => window.open('https://wa.me/234809193345365', '_blank')}
                  className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md"
                >
                  Start Live Chat
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>

      <HomeFooter />
    </div>
  );
};

export default Contact;