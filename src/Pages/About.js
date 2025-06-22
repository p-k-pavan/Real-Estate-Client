import React from 'react';
import { FaHome, FaUsers, FaChartLine, FaHandshake } from 'react-icons/fa';

const About = () => {
    return (
        <div className="min-h-screen bg-[#FEFFD2] text-gray-800">
            <div className="bg-[#FF7D29] py-16 text-center text-[#FEFFD2]">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">About PK Estate</h1>
                    <p className="text-xl">
                        Your trusted partner for all real estate needs
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-[#FF7D29] mb-6">Our Story</h2>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <p className="mb-4">
                                Founded in 2010, PK Estate has grown from a small local agency to a leading real
                                estate service provider. We've helped thousands of clients find their dream homes
                                and make smart property investments.
                            </p>
                            <p>
                                Our team of experienced professionals combines market knowledge with personalized
                                service to deliver exceptional results for buyers, sellers, and investors.
                            </p>
                        </div>
                        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">[Company Image]</span>
                        </div>
                    </div>
                </section>

                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-[#FF7D29] mb-8 text-center">Why Choose Us</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <FaHome className="text-3xl text-[#FF7D29] mx-auto mb-4" />
                            <h3 className="font-bold mb-2">Wide Selection</h3>
                            <p className="text-sm">500+ properties across all price ranges</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <FaUsers className="text-3xl text-[#FF7D29] mx-auto mb-4" />
                            <h3 className="font-bold mb-2">Expert Team</h3>
                            <p className="text-sm">10+ years average experience</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <FaChartLine className="text-3xl text-[#FF7D29] mx-auto mb-4" />
                            <h3 className="font-bold mb-2">Market Insight</h3>
                            <p className="text-sm">Data-driven pricing strategies</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <FaHandshake className="text-3xl text-[#FF7D29] mx-auto mb-4" />
                            <h3 className="font-bold mb-2">Trusted Service</h3>
                            <p className="text-sm">95% client satisfaction rate</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-[#FF7D29] mb-6">Our Mission</h2>
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <p className="mb-4">
                            At PK Estate, we believe everyone deserves a place to call home. Our mission is to
                            make the property journey simple, transparent, and rewarding for all our clients.
                        </p>
                        <p>
                            Whether you're buying your first home, selling an investment property, or looking
                            for professional management services, we're here to guide you every step of the way.
                        </p>
                    </div>
                </section>
            </div>

            <div className="bg-[#FF7D29] py-12 text-[#FEFFD2]">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to find your dream property?</h2>
                    <button className="bg-[#FEFFD2] text-[#FF7D29] px-6 py-2 rounded-full font-bold hover:bg-[#e8e9c0] transition">
                        Contact Us Today
                    </button>
                </div>
            </div>
        </div>
    );
};

export default About;