import React from 'react';
import { motion } from 'framer-motion';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useAuth } from '../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const MyFavourites = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: favourites, isLoading, refetch } = useQuery({
        queryKey: ['favourites', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/favourites?userEmail=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    const handleDelete = async (userEmail, mealId, mealName) => {
        const result = await Swal.fire({
            title: 'Remove from Favorites?',
            text: `Are you sure you want to remove "${mealName}" from your favorites?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/removeFavourite?userEmail=${userEmail}&mealId=${mealId}`);
                
                Swal.fire({
                    title: 'Removed!',
                    text: 'Meal removed from favorites successfully.',
                    icon: 'success',
                    confirmButtonColor: '#000000'
                });
                
                refetch();
            } catch (error) {
                console.error('Error removing favorite:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to remove meal from favorites. Please try again.',
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

    if (!favourites || favourites.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No Favorites Yet</h2>
                    <p className="text-gray-500">You haven't added any meals to your favorites yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Favorite Meals</h1>
                <p className="text-gray-600">All your favorite meals in one place</p>
                <div className="w-full h-px bg-gray-300 mt-4"></div>
            </div>

            {/* Table for larger screens */}
            <div className="hidden md:block overflow-x-auto">
                <motion.table
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full bg-white rounded-2xl border-2 border-black overflow-hidden"
                >
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="px-6 py-4 text-left font-bold">Meal Name</th>
                            <th className="px-6 py-4 text-left font-bold">Chef Name</th>
                            <th className="px-6 py-4 text-left font-bold">Price</th>
                            <th className="px-6 py-4 text-left font-bold">Date Added</th>
                            <th className="px-6 py-4 text-center font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {favourites.map((favourite, index) => (
                            <motion.tr
                                key={favourite._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-gray-900">{favourite.mealName}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-700">{favourite.chefName}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-green-600 font-bold">${favourite.price.toFixed(2)}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-600 text-sm">
                                        {new Date(favourite.addedTime).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDelete(favourite.userEmail, favourite.mealId, favourite.mealName)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 inline-flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </motion.button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </motion.table>
            </div>

            {/* Card layout for mobile screens */}
            <div className="md:hidden space-y-4">
                {favourites.map((favourite, index) => (
                    <motion.div
                        key={favourite._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white rounded-2xl border-2 border-black p-4"
                    >
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Meal Name</p>
                                <p className="font-bold text-gray-900">{favourite.mealName}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Chef Name</p>
                                    <p className="text-sm text-gray-700">{favourite.chefName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Price</p>
                                    <p className="text-sm text-green-600 font-bold">${favourite.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Date Added</p>
                                <p className="text-sm text-gray-600">
                                    {new Date(favourite.addedTime).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDelete(favourite.userEmail, favourite.mealId, favourite.mealName)}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove from Favorites
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Total Count */}
            <div className="mt-8 text-center">
                <p className="text-gray-600">
                    Total Favorites: <span className="font-bold text-gray-900">{favourites.length}</span>
                </p>
            </div>
        </div>
    );
};

export default MyFavourites;