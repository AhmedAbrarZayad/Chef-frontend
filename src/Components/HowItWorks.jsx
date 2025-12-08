import React from 'react';
// Keeping the user-specified import path
import { motion } from 'motion/react'; 

const HowItWorks = () => {
    // Define the primary color utility classes for consistency
    const PRIMARY_COLOR_CLASS = 'bg-red-500';
    const PRIMARY_TEXT_CLASS = 'text-red-600';
    const HOVER_PRIMARY_COLOR_CLASS = 'hover:bg-red-600';

    const steps = [
        {
            icon: "🔍",
            title: "Browse Local Chefs",
            description: "Explore authentic home-cooked meals from talented local chefs in your neighborhood."
        },
        {
            icon: "🍽️",
            title: "Order Your Meal",
            description: "Choose your favorite dishes, customize your order, and schedule your delivery time."
        },
        {
            icon: "🚗",
            title: "Fast Delivery",
            description: "Fresh, homemade meals delivered right to your doorstep with care and quality."
        },
        {
            icon: "⭐",
            title: "Enjoy & Review",
            description: "Savor delicious food and share your experience to support local home chefs."
        }
    ];

    return (
        // Corrected bg-linear-to-b to use standard Tailwind gradient utility
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
                        Homemade Food, Simple Steps 🧑‍🍳
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Connect with local home chefs and enjoy authentic, homemade meals in just a few simple steps.
                    </p>
                </div>

                {/* Steps Grid - Cleaned up positioning and flow */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="relative flex flex-col items-center text-center group"
                            initial={{ opacity: 0, y: 50 }}
                            // Framer Motion for entrance animation
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                            {/* Step Card Container */}
                            <div className="bg-white rounded-2xl p-8 shadow-xl transition-shadow duration-300 h-full w-full flex flex-col items-center border border-gray-100 group-hover:shadow-2xl">
                                
                                {/* Step Number Badge (Positioned inside the card flow) */}
                                <div className={`w-14 h-14 ${PRIMARY_COLOR_CLASS} rounded-full flex items-center justify-center font-extrabold text-2xl text-white shadow-lg mb-6`}>
                                    {index + 1}
                                </div>
                                
                                {/* Icon */}
                                <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
                                    {step.icon}
                                </div>

                                {/* Title */}
                                <h3 className={`text-xl font-bold text-gray-900 mb-3 ${PRIMARY_TEXT_CLASS}`}>
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-700 text-base leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Connecting Line/Arrow (Hidden on mobile and last item) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 left-[calc(100%+4px)] transform -translate-y-1/2 w-8 h-0.5 bg-gray-300 z-10">
                                    {/* Arrowhead SVG */}
                                    <svg className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 ${PRIMARY_TEXT_CLASS}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center mt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">
                            Ready to skip the takeaway and taste home?
                        </h3>
                        <button 
                            className={`px-10 py-4 rounded-full font-semibold text-xl text-white ${PRIMARY_COLOR_CLASS} ${HOVER_PRIMARY_COLOR_CLASS} transition-all duration-300 shadow-2xl transform hover:scale-105`}
                        >
                            Explore Meals Near You
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;