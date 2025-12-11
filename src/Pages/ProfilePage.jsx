import React, { useState } from 'react';
import { useAuth } from '../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const ProfilePage = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [requestLoading, setRequestLoading] = useState(false);

    const { data: userData, isLoading, refetch } = useQuery({
        queryKey: ['userProfile', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users?email=${user?.email}`);
            return res.data[0]; // Get first user object from array
        },
        enabled: !!user?.email
    });

    const handleRoleRequest = async (requestType) => {
        const result = await Swal.fire({
            title: `Request ${requestType === 'chef' ? 'Chef' : 'Admin'} Role?`,
            text: `Your request will be sent to the admin for approval.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, send request!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            setRequestLoading(true);

            const requestData = {
                _id: userData._id,
                userName: userData.name,
                userEmail: userData.email,
                requestType: requestType,
                requestStatus: 'pending',
                requestTime: new Date().toISOString()
            };

            try {
                const res = await axiosSecure.post('/addRequest', requestData);
                
                if (res.data.insertedId) {
                    Swal.fire({
                        title: 'Success!',
                        text: `Your request to become a ${requestType} has been sent to the admin!`,
                        icon: 'success',
                        confirmButtonColor: '#000000'
                    });
                }
            } catch (error) {
                console.error('Error sending request:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to send request. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#000000'
                });
            } finally {
                setRequestLoading(false);
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

    if (!userData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-2xl text-gray-600">User data not found</p>
            </div>
        );
    }

    const isChef = userData.role === 'chef';
    const isAdmin = userData.role === 'admin';

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-5xl font-extrabold text-black mb-2">Profile</h1>
                        <p className="text-gray-400">View all your profile details here.</p>
                        <div className="w-full h-px bg-gray-700 mt-6"></div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Left Column - Profile Card */}
                        <div className="bg-white rounded-3xl p-8 border-2 border-black">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-black mb-1">{userData.name}</h2>
                                <p className="text-primary-500 font-semibold mb-8">{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</p>
                                
                                {/* Profile Image with Gradient Border */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="w-80 h-80 rounded-full overflow-hidden p-1 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-[#2a2a2a] p-2">
                                                <img 
                                                    src={userData.photoURL} 
                                                    alt={userData.name}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Bio & Details */}
                        <div className="bg-white rounded-3xl p-8 border-2 border-black relative">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-black">Bio & other details</h2>
                                {/* Status Badge */}
                                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                    userData.status === 'active' 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : 'bg-red-500/20 text-red-400'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${
                                        userData.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                                    }`}></div>
                                    {userData.status === 'active' ? 'Active' : 'Fraud'}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Two Column Grid for Details */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* My Role */}
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">My Role</label>
                                        <p className="text-black font-semibold text-lg">{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</p>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Account Status</label>
                                        <p className="text-black font-semibold text-lg">{userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}</p>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                                        <p className="text-black font-semibold text-lg break-all">{userData.email}</p>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">My City or Region</label>
                                        <p className="text-black font-semibold text-lg">{userData.address}</p>
                                    </div>

                                    {/* Chef ID - Only show if user is a chef */}
                                    {isChef && userData.chefId && (
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Chef ID</label>
                                            <p className="text-black font-semibold text-lg">{userData.chefId}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Badges Section */}
                                <div>
                                    <label className="block text-gray-400 text-sm mb-3">Badges</label>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold inline-flex items-center gap-2 ${
                                            userData.role === 'admin' 
                                                ? 'bg-purple-500/20 text-purple-400' 
                                                : userData.role === 'chef'
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            🏆 {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} Member
                                        </span>
                                        {userData.status === 'active' && (
                                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-500/20 text-green-400 inline-flex items-center gap-2">
                                                ✓ Verified User
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {!isAdmin && (
                                    <div className="pt-6 border-t border-gray-700">
                                        <label className="block text-gray-400 text-sm mb-4">Upgrade Account</label>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {/* Be a Chef Button */}
                                            {!isChef && (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleRoleRequest('chef')}
                                                    disabled={requestLoading}
                                                    className="bg-white hover:bg-black hover:text-white text-black border-2 font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Be a Chef
                                                </motion.button>
                                            )}

                                            {/* Be an Admin Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleRoleRequest('admin')}
                                                disabled={requestLoading}
                                                className="bg-white hover:bg-black hover:text-white text-black border-2 font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Be an Admin
                                            </motion.button>
                                        </div>
                                    </div>
                                )}

                                {/* Admin Badge */}
                                {isAdmin && (
                                    <div className="pt-6 border-t border-gray-700">
                                        <div className="bg-purple-500/10 border-2 border-purple-500/30 p-6 rounded-xl text-center">
                                            <div className="text-4xl mb-2">👑</div>
                                            <h3 className="text-xl font-bold text-purple-400 mb-1">Administrator Account</h3>
                                            <p className="text-gray-400 text-sm">You have full administrative privileges</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;