import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { motion } from 'framer-motion'; // Assuming you meant framer-motion for the motion library based on usage
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../Hooks/useAuth';

const MealsDetails = () => {
    const {user} = useAuth();
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    
    // Fetch Meal Details
    const { data: meal, isLoading } = useQuery({
        queryKey: ['mealDetails', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/meal/${id}`);
            return res.data;
        }
    });

    // Fetch Reviews
    const { data: reviews, isLoading: reviewsLoading, refetch } = useQuery({
        queryKey: ['reviews', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/reviews/${id}`);
            // Sort reviews by date descending or some relevant order if needed
            return res.data;
        }
    })

    // Handle review submission
    const handleReviewSubmit = async (data) => {
        if (!user) {
            alert('Please login to submit a review');
            return;
        }

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        const reviewData = {
            foodId: id,
            reviewerName: user.displayName || 'Anonymous',
            reviewerImage: user.photoURL || 'https://via.placeholder.com/48',
            rating: rating,
            comment: data.reviewText,
            date: new Date().toISOString()
        };

        try {
            const res = await axiosSecure.post('/addReview', reviewData);
            if (res.data.insertedId) {
                alert('Review submitted successfully!');
                reset();
                setRating(0);
                refetch();
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        }
    }

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
            <div className="container mx-auto px-4 max-w-7xl"> 
                
                {/* Main Two-Column Layout for Image/Details and Reviews/Comments */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    
                    {/* LEFT COLUMN: Meal Details (takes 3/5 width on large screens) */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2"
                        >
                            {/* The original two-column internal structure for image and details is maintained */}
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
                                        whileHover={{ scale: 1.02 }} // Reduced scale effect for better feel
                                        whileTap={{ scale: 0.98 }}
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

                    {/* RIGHT COLUMN: Review Section (takes 2/5 width on large screens) */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-3xl shadow-2xl border-2 overflow-hidden"
                        >
                            
                            {/* Add Review Form (Top Section) */}
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span>✍️</span> Add Your Review
                                </h3>
                                <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-3">
                                    <div>
                                        {/* You'll need to use state for the form inputs here */}
                                        <textarea
                                            placeholder="Share your thoughts on this meal..."
                                            className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-primary-500 focus:border-primary-500 transition duration-150"
                                            rows="3"
                                            {...register("reviewText", { required: true })}
                                        ></textarea>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        {/* Interactive Rating Stars Input */}
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm text-gray-500 mr-2">Your Rating:</span>
                                            {[...Array(5)].map((_, i) => (
                                                <span 
                                                    key={i} 
                                                    className={`text-xl cursor-pointer transition-colors ${
                                                        i < (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                                                    }`}
                                                    onClick={() => setRating(i + 1)}
                                                    onMouseEnter={() => setHoveredRating(i + 1)}
                                                    onMouseLeave={() => setHoveredRating(0)}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200 text-sm"
                                        >
                                            Post Review
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Customer Reviews List */}
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span>💬</span> Customer Reviews 
                                    {reviews && reviews.length > 0 && (
                                        <span className="text-base text-gray-500">({reviews.length})</span>
                                    )}
                                </h2>
                            </div>
                            
                            <div className="max-h-[600px] overflow-y-auto">
                                {reviewsLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="loading loading-spinner loading-md text-primary-500"></div>
                                    </div>
                                ) : reviews && reviews.length > 0 ? (
                                    <div className="divide-y divide-gray-200">
                                        {reviews.map((review, index) => (
                                            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex gap-3">
                                                    {/* Reviewer Image */}
                                                    <img 
                                                        src={review.reviewerImage || 'https://via.placeholder.com/48'} 
                                                        alt={review.reviewerName}
                                                        className="w-10 h-10 rounded-full object-cover shrink-0"
                                                    />
                                                    
                                                    {/* Review Content */}
                                                    <div className="flex-1">
                                                        <div className="bg-gray-100 rounded-xl px-3 py-2 mb-1">
                                                            <p className="font-semibold text-gray-900 text-sm mb-0.5">
                                                                {review.reviewerName}
                                                            </p>
                                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                                {review.comment}
                                                            </p>
                                                        </div>
                                                        
                                                        {/* Meta Info */}
                                                        <div className="flex items-center gap-3 px-1">
                                                            {/* Rating Stars */}
                                                            <div className="flex items-center gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <span key={i} className={`text-xs ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                                                        ★
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            
                                                            {/* Date */}
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(review.date).toLocaleDateString('en-US', { 
                                                                    year: 'numeric', 
                                                                    month: 'short', 
                                                                    day: 'numeric' 
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 px-4">
                                        <div className="text-5xl mb-3">📝</div>
                                        <p className="text-gray-500 font-semibold">No reviews yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Be the first to share your experience!</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealsDetails;