import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import useAxiosSecure from '../Hooks/useAxiosSecure';

const PaymentSuccessful = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const axiosSecure = useAxiosSecure();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            // Call backend to update payment status
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
                .then(() => {
                    console.log('Payment processed successfully');
                })
                .catch(error => {
                    console.error('Error processing payment:', error);
                });
        }
    }, [sessionId, axiosSecure]);

    return (
        <div className="min-h-screen bg-linear-to-b from-green-50 to-white flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full"
            >
                <div className="bg-white rounded-3xl shadow-2xl border-2 border-black p-8 text-center">
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mb-6"
                    >
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto border-4 border-green-500">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Success Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Payment Successful!</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Your order has been confirmed and payment processed successfully.
                        </p>
                    </motion.div>

                    {/* Info Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8"
                    >
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xl font-bold text-green-800">What's Next?</h3>
                        </div>
                        <p className="text-gray-700">
                            You'll receive an email confirmation shortly. You can track your order status in the "My Orders" section.
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard/orders')}
                            className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            View My Orders
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className="bg-white hover:bg-gray-100 text-black font-bold py-4 px-8 rounded-xl border-2 border-black transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Back to Home
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccessful;