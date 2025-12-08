import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useAuth } from '../Hooks/useAuth';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const OrderPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);
    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const quantity = watch('quantity', 1);

    const { data: meal, isLoading } = useQuery({
        queryKey: ['meal', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/meal/${id}`);
            return res.data;
        }
    });

    const onSubmit = async (data) => {
        const totalPrice = (meal.price * data.quantity).toFixed(2);

        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Confirm Order',
            html: `Your total price is <strong>$${totalPrice}</strong>.<br>Do you want to confirm the order?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, place order!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            setLoading(true);
            
            const orderData = {
                foodId: meal._id,
                mealName: meal.foodName,
                price: meal.price,
                quantity: parseInt(data.quantity),
                chefId: meal.chefId,
                paymentStatus: 'Pending',
                userEmail: user.email,
                userAddress: data.userAddress,
                orderStatus: 'pending',
                orderTime: new Date().toISOString()
            };

            try {
                const res = await axiosSecure.post('/addOrder', orderData);
                
                if (res.data.insertedId) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Order placed successfully!',
                        icon: 'success',
                        confirmButtonColor: '#f97316'
                    });
                    navigate('/');
                }
            } catch (error) {
                console.error('Error placing order:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to place order. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#f97316'
                });
            } finally {
                setLoading(false);
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

    if (!meal) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-2xl text-gray-600">Meal not found</p>
            </div>
        );
    }

    const totalPrice = (meal.price * (quantity || 1)).toFixed(2);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-black p-8">
                            <h1 className="text-3xl font-extrabold text-white mb-2">Place Your Order</h1>
                            <p className="text-gray-300">Review your order details and confirm</p>
                        </div>

                        {/* Order Summary */}
                        <div className="p-8 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Meal Image */}
                                <div className="relative h-64 rounded-xl overflow-hidden">
                                    <img 
                                        src={meal.foodImage} 
                                        alt={meal.foodName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Meal Details */}
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold text-gray-900">{meal.foodName}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-500 text-lg">⭐</span>
                                        <span className="font-semibold">{meal.rating.toFixed(1)}</span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-gray-600">
                                            <span className="font-semibold">Chef:</span> {meal.chefName}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-semibold">Delivery:</span> {meal.estimatedDeliveryTime}
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ${meal.price.toFixed(2)} <span className="text-sm text-gray-500">per item</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Form */}
                        <div className="p-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Auto-filled Fields (Read-only) */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Meal Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Meal Name
                                        </label>
                                        <input
                                            type="text"
                                            value={meal.foodName}
                                            readOnly
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Price per Item
                                        </label>
                                        <input
                                            type="text"
                                            value={`$${meal.price.toFixed(2)}`}
                                            readOnly
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Chef ID */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Chef ID
                                        </label>
                                        <input
                                            type="text"
                                            value={meal.chefId}
                                            readOnly
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
                                        />
                                    </div>

                                    {/* User Email */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Your Email
                                        </label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            readOnly
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* User Input Fields */}
                                <div className="space-y-6 pt-4 border-t border-gray-200">
                                    {/* Quantity */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Quantity <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="50"
                                            {...register('quantity', {
                                                required: 'Quantity is required',
                                                min: { value: 1, message: 'Minimum quantity is 1' },
                                                max: { value: 50, message: 'Maximum quantity is 50' }
                                            })}
                                            defaultValue={1}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                                            placeholder="Enter quantity"
                                        />
                                        {errors.quantity && (
                                            <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                                        )}
                                    </div>

                                    {/* Delivery Address */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Delivery Address <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            {...register('userAddress', {
                                                required: 'Delivery address is required',
                                                minLength: {
                                                    value: 10,
                                                    message: 'Address must be at least 10 characters'
                                                }
                                            })}
                                            rows="4"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none resize-none"
                                            placeholder="Enter your complete delivery address"
                                        />
                                        {errors.userAddress && (
                                            <p className="mt-1 text-sm text-red-600">{errors.userAddress.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Total Price Display */}
                                <div className="bg-orange-50 p-6 rounded-xl border-2 border-primary-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-semibold text-gray-700">Total Price:</span>
                                        <span className="text-3xl font-extrabold text-primary-600">${totalPrice}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {quantity || 1} item(s) × ${meal.price.toFixed(2)} = ${totalPrice}
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary-500 hover:bg-primary-600 text-black font-bold py-4 px-8 rounded-xl text-lg shadow-lg transition-all duration-200 border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Confirm Order
                                        </span>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderPage;