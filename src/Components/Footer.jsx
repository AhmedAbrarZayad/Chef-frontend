import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Contact Details */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="mr-2">📍</span>
                                <p className="text-gray-300">123 Chef Street, Food City, FC 12345</p>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2">📞</span>
                                <p className="text-gray-300">+1 (555) 123-4567</p>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2">✉️</span>
                                <p className="text-gray-300">info@chefrestaurant.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Working Hours */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Working Hours</h3>
                        <div className="space-y-2 text-gray-300">
                            <div>
                                <p className="font-semibold">Monday - Friday:</p>
                                <p>11:00 AM - 10:00 PM</p>
                            </div>
                            <div>
                                <p className="font-semibold">Saturday:</p>
                                <p>10:00 AM - 11:00 PM</p>
                            </div>
                            <div>
                                <p className="font-semibold">Sunday:</p>
                                <p>10:00 AM - 9:00 PM</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#menu">Menu</a></li>
                        </ul>
                    </div>

                    {/* Social Media Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                        <p className="text-gray-300 mb-4">Stay connected with us on social media</p>
                        <div className="flex space-x-4">
                            <a 
                                href="https://facebook.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                                aria-label="Facebook"
                            >
                                <span className="text-xl">f</span>
                            </a>
                            <a 
                                href="https://instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                                aria-label="Instagram"
                            >
                                <span className="text-xl">📷</span>
                            </a>
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                                aria-label="Twitter"
                            >
                                <span className="text-xl">𝕏</span>
                            </a>
                            <a 
                                href="https://youtube.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                                aria-label="YouTube"
                            >
                                <span className="text-xl">▶️</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright Information */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center">
                    <p className="text-gray-400">
                        © {new Date().getFullYear()} Chef Restaurant. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Designed with ❤️ for food lovers
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;