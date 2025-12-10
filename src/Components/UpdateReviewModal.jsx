import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';

const UpdateReviewModal = ({ isOpen, onClose, review, onUpdate, isUpdating }) => {
    const [hoveredStar, setHoveredStar] = useState(0);
    
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            rating: review?.rating || 0,
            comment: review?.comment || ''
        }
    });

    const selectedRating = watch('rating');

    useEffect(() => {
        if (review) {
            setValue('rating', review.rating);
            setValue('comment', review.comment);
        }
    }, [review, setValue]);

    const handleStarClick = (rating) => {
        setValue('rating', rating);
    };

    const onSubmit = (data) => {
        onUpdate({
            ...data,
            reviewId: review._id
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-3xl shadow-2xl border-2 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        {/* Modal Header */}
                        <div className="bg-black p-6 sticky top-0 z-10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-extrabold text-white">Update Review</h2>
                                <button
                                    onClick={onClose}
                                    className="text-white hover:text-gray-300 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                            {/* Meal Info Display */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-sm text-gray-600">Editing review for:</p>
                                <p className="text-lg font-bold text-gray-900">Food ID: {review?.foodId?.slice(-8)}</p>
                            </div>

                            {/* Rating */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Rating <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleStarClick(star)}
                                            onMouseEnter={() => setHoveredStar(star)}
                                            onMouseLeave={() => setHoveredStar(0)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <svg
                                                className={`w-10 h-10 ${
                                                    star <= (hoveredStar || selectedRating)
                                                        ? 'text-yellow-500'
                                                        : 'text-gray-300'
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <input type="hidden" {...register('rating', { required: true, min: 1 })} />
                                {errors.rating && (
                                    <p className="mt-2 text-sm text-red-600">Please select a rating</p>
                                )}
                            </div>

                            {/* Comment */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Review <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    {...register('comment', {
                                        required: 'Comment is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Comment must be at least 10 characters'
                                        }
                                    })}
                                    rows="5"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none resize-none"
                                    placeholder="Share your experience with this meal..."
                                />
                                {errors.comment && (
                                    <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isUpdating}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all duration-200 border-2 border-gray-400 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUpdating ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Updating...
                                        </span>
                                    ) : (
                                        'Update Review'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UpdateReviewModal;
