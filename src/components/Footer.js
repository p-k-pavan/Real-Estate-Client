import React from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-[#FEFFD2] text-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Socials */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#FF7D29]">PK ESTATE</h3>
            <p className="text-gray-600">
              Your trusted partner in real estate solutions. We help you find the perfect property for your needs.
            </p>

            <div className="flex space-x-4">
              {/* External links must have full valid hrefs */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#FF7D29] hover:text-gray-800 transition"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-[#FF7D29] hover:text-gray-800 transition"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#FF7D29] hover:text-gray-800 transition"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#FF7D29] hover:text-gray-800 transition"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#FF7D29]">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-[#FF7D29] transition">Home</Link></li>
              <li><Link to="/properties" className="hover:text-[#FF7D29] transition">Properties</Link></li>
              <li><Link to="/services" className="hover:text-[#FF7D29] transition">Services</Link></li>
              <li><Link to="/about" className="hover:text-[#FF7D29] transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#FF7D29] transition">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#FF7D29]">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/services/sales" className="hover:text-[#FF7D29] transition">Property Sales</Link></li>
              <li><Link to="/services/rentals" className="hover:text-[#FF7D29] transition">Rental Management</Link></li>
              <li><Link to="/services/valuation" className="hover:text-[#FF7D29] transition">Valuation</Link></li>
              <li><Link to="/services/investment" className="hover:text-[#FF7D29] transition">Investment Consulting</Link></li>
              <li><Link to="/services/legal" className="hover:text-[#FF7D29] transition">Legal Services</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#FF7D29]">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-[#FF7D29] mt-1" />
                <p>123 Estate Avenue, Property City, PC 12345</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-[#FF7D29]" />
                <a href="tel:+12345678900" className="hover:text-[#FF7D29] transition">+1 (234) 567-8900</a>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-[#FF7D29]" />
                <a href="mailto:info@pkestate.com" className="hover:text-[#FF7D29] transition">info@pkestate.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#FF7D29] py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#FEFFD2] text-sm">
              &copy; {new Date().getFullYear()} PK ESTATE. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link to="/privacy-policy" className="text-[#FEFFD2] hover:text-white text-sm transition">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-[#FEFFD2] hover:text-white text-sm transition">Terms of Service</Link>
              <Link to="/sitemap" className="text-[#FEFFD2] hover:text-white text-sm transition">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
