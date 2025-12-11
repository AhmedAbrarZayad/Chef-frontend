import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();

    const { data: users, isLoading, refetch } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            const res = await axiosSecure.get('/all-users');
            return res.data;
        },
    });

    const handleMakeFraud = async (userId, userName) => {
        const result = await Swal.fire({
            title: 'Mark as Fraud?',
            text: `Are you sure you want to mark "${userName}" as fraud?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, mark as fraud!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/update-fraud-status/${userId}`, {
                    fraudStatus: 'yes'
                });

                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'User has been marked as fraud.',
                        icon: 'success',
                        confirmButtonColor: '#000000'
                    });
                    refetch();
                }
            } catch {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update user status.',
                    icon: 'error',
                    confirmButtonColor: '#000000'
                });
            }
        }
    };

    const getRoleBadge = (role) => {
        const roleColors = {
            admin: 'bg-purple-100 text-purple-800 border-purple-300',
            chef: 'bg-orange-100 text-orange-800 border-orange-300',
            user: 'bg-blue-100 text-blue-800 border-blue-300'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${roleColors[role] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                {role?.toUpperCase() || 'USER'}
            </span>
        );
    };

    const getStatusBadge = (fraud) => {
        const isFraud = fraud === 'yes' || fraud === true;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                isFraud ? 'bg-red-100 text-red-800 border-red-300' : 'bg-green-100 text-green-800 border-green-300'
            }`}>
                {isFraud ? 'FRAUD' : 'ACTIVE'}
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

    if (!users || users.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No Users Found</h2>
                    <p className="text-gray-500">There are no users in the system yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Manage Users</h1>
                <p className="text-gray-600">View and manage all platform users</p>
                <div className="w-full h-px bg-gray-300 mt-4"></div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto bg-white border-2 border-black rounded-xl">
                <table className="w-full">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black">
                        {users.map((user, index) => (
                            <tr key={user._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img
                                            src={user.photoURL || 'https://via.placeholder.com/40'}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full border-2 border-black mr-3"
                                        />
                                        <span className="font-semibold text-gray-900">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getRoleBadge(user.role)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(user.fraud)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.role !== 'admin' && user.fraud === 'no' && (
                                        <button
                                            onClick={() => handleMakeFraud(user._id, user.name)}
                                            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            Make Fraud
                                        </button>
                                    )}
                                    {user.fraud === 'yes' && (
                                        <button
                                            disabled
                                            className="bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                                        >
                                            Already Fraud
                                        </button>
                                    )}
                                    {user.role === 'admin' && (
                                        <span className="text-gray-400 text-sm italic">Admin User</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {users.map((user) => (
                    <div key={user._id} className="bg-white border-2 border-black rounded-xl p-5">
                        <div className="flex items-center mb-4">
                            <img
                                src={user.photoURL || 'https://via.placeholder.com/40'}
                                alt={user.name}
                                className="w-12 h-12 rounded-full border-2 border-black mr-3"
                            />
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900">{user.name}</h3>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Role</p>
                                {getRoleBadge(user.role)}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                {getStatusBadge(user.fraud)}
                            </div>
                        </div>

                        {user.role !== 'admin' && user.fraud === 'no' && (
                            <button
                                onClick={() => handleMakeFraud(user._id, user.name)}
                                className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Make Fraud
                            </button>
                        )}
                        {user.fraud === 'yes' && (
                            <button
                                disabled
                                className="w-full bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                            >
                                Already Fraud
                            </button>
                        )}
                        {user.role === 'admin' && (
                            <div className="text-center text-gray-400 text-sm italic py-2">
                                Admin User - Cannot Mark as Fraud
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageUsers;