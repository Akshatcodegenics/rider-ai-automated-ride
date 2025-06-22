
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              🚗 Rider
            </div>
            <p className="text-gray-400 mb-4">
              Your reliable ride-sharing partner for safe, fast, and affordable transportation with AI-powered features.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">🚙 For Riders</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/book-ride" className="hover:text-white transition-colors">🚗 Book a Ride</Link></li>
              <li><Link to="/ai-booking" className="hover:text-white transition-colors">🤖 AI Automated Booking</Link></li>
              <li><Link to="/payment" className="hover:text-white transition-colors">💳 Payment & Plans</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">🛡️ Safety Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">📞 Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">🚗 For Drivers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/driver-login" className="hover:text-white transition-colors">🚗 Drive with Rider</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">📋 Driver Requirements</a></li>
              <li><a href="#" className="hover:text-white transition-colors">💰 Earnings Calculator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">🎓 Driver Training</a></li>
              <li><a href="#" className="hover:text-white transition-colors">📞 Driver Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">🏢 Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">ℹ️ About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">💼 Careers</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">📰 Press & News</a></li>
              <li><a href="#" className="hover:text-white transition-colors">📈 Investors</a></li>
              <li><a href="#" className="hover:text-white transition-colors">🤝 Partnerships</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2024 Rider. All rights reserved. 🚀
          </p>
          <div className="flex space-x-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">🔒 Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">📜 Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">🍪 Cookies Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
