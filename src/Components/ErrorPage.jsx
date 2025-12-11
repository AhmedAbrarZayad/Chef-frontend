import React from 'react';
import { useNavigate, useRouteError } from 'react-router';
import { motion } from 'framer-motion';

const ErrorPage = () => {
    const navigate = useNavigate();
    const error = useRouteError();

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl border-4 border-black p-8 sm:p-12 shadow-2xl text-center"
                >
                    {/* Error Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-red-100 rounded-full flex items-center justify-center border-4 border-red-500">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Error Title */}
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4"
                    >
                        Oops!
                    </motion.h1>

                    {/* Error Message */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-xl sm:text-2xl text-gray-700 mb-2"
                    >
                        Something went wrong
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-gray-500 mb-8 text-sm sm:text-base"
                    >
                        {error?.statusText || error?.message || "We couldn't process your request. Please try again."}
                    </motion.p>

                    {/* Error Details (Optional - for debugging) */}
                    {error?.status && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="mb-8 p-4 bg-gray-50 rounded-xl border-2 border-gray-200"
                        >
                            <p className="text-sm text-gray-600">
                                <span className="font-bold">Error Code:</span> {error.status}
                            </p>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 border-2 border-black shadow-lg"
                        >
                            Go to Home
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="bg-white hover:bg-gray-50 text-black font-bold py-3 px-8 rounded-xl transition-all duration-200 border-2 border-black"
                        >
                            Go Back
                        </motion.button>
                    </motion.div>

                    {/* Support Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="mt-8 pt-8 border-t-2 border-gray-200"
                    >
                        <p className="text-sm text-gray-500">
                            Need help?{' '}
                            <a href="mailto:support@chef.com" className="text-primary-500 hover:text-primary-600 font-semibold underline">
                                Contact Support
                            </a>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default ErrorPage;