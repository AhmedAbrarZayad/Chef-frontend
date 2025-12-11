import React from 'react';
import { useAuth } from '../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const OrderApproval = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();


    const { data: userData } = useQuery({
        queryKey: ['userProfile', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users?email=${user?.email}`);
            return res.data[0];
        },
        enabled: !!user?.email
    });

    const chefId = userData?._id;

    const { data: orders, isLoading, refetch } = useQuery({
        queryKey: ['pendingOrders', chefId],
        queryFn: async () => {
            const res = await axiosSecure.get('/pending-orders?chefId=' + chefId);
            return res.data;
        }
    });

    const handleStatusUpdate = async (orderId, newStatus, actionName) => {
        const result = await Swal.fire({
            title: `${actionName} Order?`,
            text: `Are you sure you want to ${actionName.toLowerCase()} this order?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Yes, ${actionName.toLowerCase()} it!`,
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/update-order-status/${orderId}`, {
                    orderStatus: newStatus
                });

                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: `Order ${actionName.toLowerCase()}ed successfully`,
                        confirmButtonColor: '#000000',
                    });
                    refetch();
                }
            } catch {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: `Failed to ${actionName.toLowerCase()} order`,
                });
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            accepted: 'bg-blue-100 text-blue-800 border-blue-300',
            delivered: 'bg-green-100 text-green-800 border-green-300',
            cancelled: 'bg-red-100 text-red-800 border-red-300'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    const getPaymentBadge = (status) => {
        const isPaid = status === 'paid';
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                isPaid ? 'bg-green-100 text-green-800 border-green-300' : 'bg-orange-100 text-orange-800 border-orange-300'
            }`}>
                {isPaid ? 'PAID' : 'PENDING'}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg text-primary-500"></div>
            </div>
        );
    }

    const chefOrders = orders?.filter(order => order.chefId === chefId) || [];

    if (!chefOrders || chefOrders.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h2>
                    <p className="text-gray-500">You don't have any orders at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Order Requests</h1>
                <p className="text-gray-600">Manage all your order requests</p>
                <div className="w-full h-px bg-gray-300 mt-4"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {chefOrders.map((order) => (
                    <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl border-2 border-black p-6 hover:shadow-xl transition-all duration-200"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{order.mealName}</h3>
                            <div className="flex flex-col gap-2 items-end">
                                {getStatusBadge(order.orderStatus)}
                                {getPaymentBadge(order.paymentStatus)}
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-700">Price:</span>
                                <span className="text-sm text-gray-600 font-bold">${order.price}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                                <span className="text-sm text-gray-600">{order.quantity}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-700">Total:</span>
                                <span className="text-sm text-gray-600 font-bold">${(order.price * order.quantity).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-semibold text-gray-700">Customer:</span>
                                <span className="text-sm text-gray-600 text-right">{order.userEmail}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-semibold text-gray-700">Address:</span>
                                <span className="text-sm text-gray-600 text-right max-w-[60%]">{order.userAddress}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-700">Order Time:</span>
                                <span className="text-sm text-gray-600">
                                    {new Date(order.orderTime).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => handleStatusUpdate(order._id, 'cancelled', 'Cancel')}
                                disabled={order.orderStatus !== 'pending'}
                                className="flex-1 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(order._id, 'accepted', 'Accept')}
                                disabled={order.orderStatus !== 'pending'}
                                className="flex-1 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(order._id, 'delivered', 'Deliver')}
                                disabled={order.orderStatus !== 'accepted'}
                                className="flex-1 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Deliver
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default OrderApproval;