import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle } from 'lucide-react';
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
    alert('Thank you for your message! We\'ll get back to you soon.');
  };


  return (
    <div className="min-h-screen bg-white home-page-scrollbar">
      <HomeNavbar />
      
      <div className="container mx-auto px-4 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-deepBlue-800 mb-6 overflow-hidden">
            <span className="block animate-slideUpReveal">Contact Us</span>
          </h1>
        </div>


        {/* Contact Form & Map Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-deepBlue-100">
            <h2 className="text-2xl font-bold text-deepBlue-800 mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-deepBlue-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-deepBlue-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-deepBlue-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="account">Account Issues</option>
                  <option value="group">Group Management</option>
                  <option value="payment">Payment Issues</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-deepBlue-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-deepBlue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-deepBlue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="space-y-1">
            {/* Quick Help */}
            <div className="bg-gradient-to-r from-deepBlue-50 to-deepBlue-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-deepBlue-800 mb-4 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2" />
                Need Quick Help?
              </h3>
              <p className="text-deepBlue-700 mb-4">
                For immediate assistance, start a chat on whatsapp.
              </p>
              <div className="space-y-1">
                <button className="w-full bg-deepBlue-600 text-white py-2 px-4 rounded-lg hover:bg-deepBlue-700 transition-colors">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default Contact;