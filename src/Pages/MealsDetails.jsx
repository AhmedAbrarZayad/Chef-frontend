import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { motion } from 'motion/react';
import { useParams } from 'react-router';

const MealsDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { data: meal, isLoading } = useQuery({
        queryKey: ['mealDetails', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/meal/${id}`);
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg text-primary-500"></div>
            </div>
        );
    }

    if (!meal) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-2xl text-gray-600">Meal not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-orange-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2"
                >
                    {/* Header Section with Image */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Food Image */}
                        <div className="relative h-96 md:h-full">
                            <img
                                src={meal.foodImage}
                                alt={meal.foodName}
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Price & Rating Badges */}
                            <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-lg">
                                <span className="text-2xl font-bold text-green-600">
                                    ${meal.price.toFixed(2)}
                                </span>
                            </div>
                            <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                <span className="text-yellow-500 text-xl">⭐</span>
                                <span className="text-xl font-bold">{meal.rating.toFixed(1)}</span>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-8 md:p-12">
                            {/* Food Name */}
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                                {meal.foodName}
                            </h1>

                            {/* Chef Info */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-500">Prepared by</p>
                                        <p className="text-xl font-semibold text-indigo-700">{meal.chefName}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 ml-9">{meal.chefExperience}</p>
                                <p className="text-xs text-gray-400 ml-9 mt-1">Chef ID: {meal.chefId}</p>
                            </div>

                            {/* Delivery Info */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-500">Estimated Delivery Time</p>
                                        <p className="font-semibold text-gray-900">{meal.estimatedDeliveryTime}</p>
                                    </div>
                                </div>
                                
                                {meal.deliveryArea && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Delivery Area</p>
                                            <p className="font-semibold text-gray-900">{meal.deliveryArea}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Ingredients */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span>🥘</span> Ingredients
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {meal.ingredients.map((ingredient, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                                        >
                                            {ingredient}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Order Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-primary-500 hover:bg-primary-600 text-black font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-colors duration-200 flex items-center justify-center gap-3 border-2 border-black"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Order Now - ${meal.price.toFixed(2)}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MealsDetails;