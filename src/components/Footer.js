import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="w-full bg-[#FEFFD2] text-gray-800">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-[#FF7D29]">PK ESTATE</h3>
                        <p className="text-gray-600">
                            Your trusted partner in real estate solutions. We help you find the perfect property for your needs.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-[#FF7D29] hover:text-gray-800 transition">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-[#FF7D29] hover:text-gray-800 transition">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-[#FF7D29] hover:text-gray-800 transition">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-[#FF7D29] hover:text-gray-800 transition">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-[#FF7D29]">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-[#FF7D29] transition">Home</a></li>
                            <li><a href="#" className="hover:text-[#FF7D29] transition">Properties</a></li>
                            <li><a href="#" className="hover:text-[#FF7D29] transition">Services</a></li>
                            <li><a href="#" className="hover:text-[#FF7D29] transition">About Us</a></li>
                            <li><a href="#" className="hover:text-[#FF7D29] transition">Contact</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-[#FF7D29]">Services</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-[#FF7D29] transition">Property Sales</a></li>
                            <li><a href="#" className="hover:text-[#FF7D29] transition">Rental Management</a></li>
                            <li><a href="#" className="hover:text-[#FF7D29] transition">Valuation</a></li>
                            <li><a href="#" className="hover:text-[#FF7D29] transition">Investment Consulting</a></li>
                            <li><a href="#" className="hover:text-[#FF7D29] transition">Legal Services</a></li>
                        </ul>
                    </div>


                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-[#FF7D29]">Contact Us</h4>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <FaMapMarkerAlt className="text-[#FF7D29] mt-1" />
                                <p>123 Estate Avenue, Property City, PC 12345</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaPhone className="text-[#FF7D29]" />
                                <p>+1 (234) 567-8900</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaEnvelope className="text-[#FF7D29]" />
                                <p>info@pkestate.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="bg-[#FF7D29] py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-[#FEFFD2] text-sm">
                            &copy; {new Date().getFullYear()} PK ESTATE. All rights reserved.
                        </p>
                        <div className="flex space-x-4 mt-2 md:mt-0">
                            <a href="#" className="text-[#FEFFD2] hover:text-white text-sm transition">Privacy Policy</a>
                            <a href="#" className="text-[#FEFFD2] hover:text-white text-sm transition">Terms of Service</a>
                            <a href="#" className="text-[#FEFFD2] hover:text-white text-sm transition">Sitemap</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;