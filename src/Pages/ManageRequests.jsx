import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const ManageRequests = () => {
    const axiosSecure = useAxiosSecure();

    const { data: requests, isLoading, refetch } = useQuery({
        queryKey: ['pendingRequests'],
        queryFn: async () => {
            const res = await axiosSecure.get('/pending-requests');
            return res.data;
        }
    });

    const handleApprove = async (request) => {
        const result = await Swal.fire({
            title: 'Approve Request?',
            html: `Approve <strong>${request.userName}</strong> to become a <strong>${request.requestType}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#22c55e',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, approve!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/approve-request/${request._id}`, {
                    requestType: request.requestType,
                    userId: request._id
                });

                if (res.data.success) {
                    Swal.fire({
                        title: 'Approved!',
                        text: `${request.userName} is now a ${request.requestType}`,
                        icon: 'success',
                        confirmButtonColor: '#000000'
                    });
                    refetch();
                }
            } catch (error) {
                console.error('Error approving request:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to approve request',
                    icon: 'error',
                    confirmButtonColor: '#000000'
                });
            }
        }
    };

    const handleReject = async (request) => {
        const result = await Swal.fire({
            title: 'Reject Request?',
            html: `Reject <strong>${request.userName}</strong>'s request to become a <strong>${request.requestType}</strong>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, reject',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/reject-request/${request._id}`);

                if (res.data.success) {
                    Swal.fire({
                        title: 'Rejected!',
                        text: 'Request has been rejected',
                        icon: 'success',
                        confirmButtonColor: '#000000'
                    });
                    refetch();
                }
            } catch (error) {
                console.error('Error rejecting request:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to reject request',
                    icon: 'error',
                    confirmButtonColor: '#000000'
                });
            }
        }
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
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Manage Requests</h1>
                <p className="text-gray-600">Review and manage user role upgrade requests</p>
                <div className="w-full h-px bg-gray-300 mt-4"></div>
            </div>

            {!requests || requests.length === 0 ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Pending Requests</h2>
                        <p className="text-gray-500">There are no role upgrade requests at the moment.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border-2 border-black overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wider">User Name</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wider">User Email</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wider">Request Type</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wider">Status</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wider">Request Time</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {requests.map((request, index) => (
                                    <motion.tr
                                        key={request._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                                            <div className="flex items-center">
                                                <div className="text-xs sm:text-sm font-semibold text-gray-900">{request.userName}</div>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                                            <div className="text-xs sm:text-sm text-gray-600">{request.userEmail}</div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                                                request.requestType === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {request.requestType.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                                            <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                                                {request.requestStatus.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                                            <div className="text-xs sm:text-sm text-gray-600">
                                                {new Date(request.requestTime).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleApprove(request)}
                                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
                                                >
                                                    Accept
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleReject(request)}
                                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
                                                >
                                                    Reject
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRequests;