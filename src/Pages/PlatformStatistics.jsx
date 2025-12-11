import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PlatformStatistics = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch all statistics
    const { data: paymentData } = useQuery({
        queryKey: ['totalPayments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/total-payments');
            return res.data;
        }
    });

    const { data: userData } = useQuery({
        queryKey: ['totalUsers'],
        queryFn: async () => {
            const res = await axiosSecure.get('/total-users');
            return res.data;
        }
    });

    const { data: pendingOrdersData } = useQuery({
        queryKey: ['pendingOrders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/pending-orders-count');
            return res.data;
        }
    });

    const { data: deliveredOrdersData } = useQuery({
        queryKey: ['deliveredOrders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/delivered-orders-count');
            return res.data;
        }
    });

    const { data: chartData, isLoading } = useQuery({
        queryKey: ['chartData'],
        queryFn: async () => {
            const res = await axiosSecure.get('/statistics-chart-data');
            return res.data;
        }
    });

    const COLORS = {
        primary: ['#3b82f6', '#8b5cf6', '#ec4899'],
        orders: ['#f59e0b', '#10b981', '#3b82f6'],
        payments: ['#22c55e', '#eab308']
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg text-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Platform Statistics</h1>
                <p className="text-gray-600">Overview of key platform metrics and performance</p>
                <div className="w-full h-px bg-gray-300 mt-4"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Payment Amount */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white border-2 border-black shadow-lg"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold opacity-90 mb-1">Total Payment Amount</h3>
                    <p className="text-3xl font-extrabold">${paymentData?.totalPaymentAmount?.toFixed(2) || '0.00'}</p>
                    <p className="text-xs opacity-75 mt-2">{paymentData?.totalPayments || 0} transactions</p>
                </motion.div>

                {/* Total Users */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white border-2 border-black shadow-lg"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold opacity-90 mb-1">Total Users</h3>
                    <p className="text-3xl font-extrabold">{userData?.totalUsers || 0}</p>
                    <p className="text-xs opacity-75 mt-2">Registered members</p>
                </motion.div>

                {/* Pending Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white border-2 border-black shadow-lg"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold opacity-90 mb-1">Orders Pending</h3>
                    <p className="text-3xl font-extrabold">{pendingOrdersData?.pendingOrders || 0}</p>
                    <p className="text-xs opacity-75 mt-2">Awaiting completion</p>
                </motion.div>

                {/* Delivered Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white border-2 border-black shadow-lg"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold opacity-90 mb-1">Orders Delivered</h3>
                    <p className="text-3xl font-extrabold">{deliveredOrdersData?.deliveredOrders || 0}</p>
                    <p className="text-xs opacity-75 mt-2">Successfully completed</p>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl p-6 border-2 border-black"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData?.orderStatus || []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData?.orderStatus?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS.orders[index % COLORS.orders.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* User Roles Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl p-6 border-2 border-black"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">User Roles Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData?.userRoles || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Payment Status Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 border-2 border-black lg:col-span-2"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Status Overview</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData?.paymentStatus || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#22c55e" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
};

export default PlatformStatistics;