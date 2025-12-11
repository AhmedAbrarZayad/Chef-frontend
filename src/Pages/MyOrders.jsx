import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useAuth } from '../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

const MyOrders = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 3;

    const { data, isLoading } = useQuery({
        queryKey: ['orders', user?.email, currentPage],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders?email=${user?.email}&page=${currentPage}&limit=${limit}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    const handlePayment = async (order) => {
        const paymentInfo = {
            id: order._id,
            senderEmail: user?.email,
            cost: order.price * order.quantity,
        }
        if(order.orderStatus === 'pending'){
            alert('Your order is still pending. Please wait until it is approved before making a payment.');   
            return;
        }
        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
        console.log('Checkout Session:', res.data);
        if (res.data && res.data.url) {
            window.location.href = res.data.url;
        }
    }

    const orders = data?.items || [];
    const totalPages = data?.totalPages || 0;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg text-primary-500"></div>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h2>
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                </div>
            </div>
        );
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Orders</h1>
                <p className="text-gray-600">Track and manage all your orders</p>
                <div className="w-full h-px bg-gray-300 mt-4"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {orders.map((order) => (
                    <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl border-2 border-black p-6 hover:shadow-xl transition-all duration-200"
                    >
                        {/* Order Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{order.mealName}</h3>
                                <p className="text-sm text-gray-500">Order ID: {order._id.slice(-8)}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                order.orderStatus === 'delivered' 
                                    ? 'bg-green-100 text-green-700' 
                                    : order.orderStatus === 'preparing'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {order.orderStatus.toUpperCase()}
                            </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="space-y-3 mb-4">
                            {/* Price and Quantity */}
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Price per Item</p>
                                    <p className="text-lg font-bold text-gray-900">${order.price.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-1">Quantity</p>
                                    <p className="text-lg font-bold text-gray-900">×{order.quantity}</p>
                                </div>
                            </div>

                            {/* Total Price */}
                            <div className="bg-primary-50 p-3 rounded-xl border border-primary-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700">Total Price:</span>
                                    <span className="text-xl font-extrabold text-primary-600">
                                        ${(order.price * order.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Chef Information */}
                            <div className="bg-gray-50 p-3 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Chef ID</p>
                                <p className="text-sm font-bold text-gray-900">{order.chefId}</p>
                            </div>

                            {/* Payment Status */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Payment Status:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    order.paymentStatus === 'Paid' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-orange-100 text-orange-700'
                                }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>

                            {/* Order Time */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Order Time:</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {new Date(order.orderTime).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>

                            {/* Delivery Address */}
                            <div className="pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                                <p className="text-sm text-gray-700">{order.userAddress}</p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200"
                            onClick={() => handlePayment(order)}
                        >
                            Pay Now
                        </motion.button>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-xl border-2 border-black font-bold hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-xl border-2 border-black font-bold transition-all duration-200 ${
                                currentPage === page
                                    ? 'bg-black text-white'
                                    : 'bg-white text-black hover:bg-black hover:text-white'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-xl border-2 border-black font-bold hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyOrders;