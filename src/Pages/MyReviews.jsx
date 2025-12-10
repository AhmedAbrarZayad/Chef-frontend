import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useAuth } from '../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import UpdateReviewModal from '../Components/UpdateReviewModal';

const MyReviews = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const limit = 3;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['reviews', user?.email, currentPage],
        queryFn: async () => {
            const res = await axiosSecure.get(`/all-reviews?name=${user?.displayName}&page=${currentPage}&limit=${limit}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    const reviews = data?.items || [];
    const totalPages = data?.totalPages || 0;

    const handleDelete = async (reviewId) => {
        const result = await Swal.fire({
            title: 'Delete Review?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/reviews/${reviewId}`);
                
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your review has been deleted.',
                    icon: 'success',
                    confirmButtonColor: '#000000'
                });
                
                refetch();
            } catch (error) {
                console.error('Error deleting review:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete review. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#000000'
                });
            }
        }
    };

    const handleUpdate = async (updateData) => {
        setIsUpdating(true);
        try {
            await axiosSecure.patch(`/reviews/${updateData.reviewId}`, {
                rating: updateData.rating,
                comment: updateData.comment
            });
            
            Swal.fire({
                title: 'Updated!',
                text: 'Your review has been updated successfully.',
                icon: 'success',
                confirmButtonColor: '#000000'
            });
            
            setIsModalOpen(false);
            setSelectedReview(null);
            refetch();
        } catch (error) {
            console.error('Error updating review:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update review. Please try again.',
                icon: 'error',
                confirmButtonColor: '#000000'
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const openUpdateModal = (review) => {
        setSelectedReview(review);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReview(null);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg text-primary-500"></div>
            </div>
        );
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No Reviews Yet</h2>
                    <p className="text-gray-500">You haven't written any reviews yet.</p>
                </div>
            </div>
        );
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Reviews</h1>
                <p className="text-gray-600">All the reviews you've written</p>
                <div className="w-full h-px bg-gray-300 mt-4"></div>
            </div>

            <div className="space-y-6">
                {reviews.map((review) => (
                    <motion.div
                        key={review._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl border-2 border-black p-6 hover:shadow-xl transition-all duration-200"
                    >
                        {/* Review Header */}
                        <div className="flex items-start gap-4 mb-4">
                            {/* Reviewer Image */}
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-500 flex-shrink-0">
                                <img 
                                    src={review.reviewerImage} 
                                    alt={review.reviewerName}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{review.reviewerName}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(review.date).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    {/* Star Rating */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, index) => (
                                            <svg
                                                key={index}
                                                className={`w-5 h-5 ${
                                                    index < review.rating ? 'text-yellow-500' : 'text-gray-300'
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        <span className="ml-2 text-sm font-semibold text-gray-700">{review.rating}/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Review Comment */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                            <p className="text-gray-800 leading-relaxed">{review.comment}</p>
                        </div>

                        {/* Food ID Reference and Action Buttons */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Food ID: <span className="font-mono text-gray-700">{review.foodId.slice(-8)}</span>
                            </span>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => openUpdateModal(review)}
                                    className="bg-white hover:bg-black hover:text-white text-black border-2 font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Update
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDelete(review._id)}
                                    className="bg-white hover:bg-black hover:text-white text-black border-2 font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-xl border-2 border-black font-bold hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-xl border-2 border-black font-bold transition-all duration-200 ${
                                currentPage === page
                                    ? 'bg-black text-white'
                                    : 'bg-white text-black hover:bg-black hover:text-white'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-xl border-2 border-black font-bold hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Update Modal */}
            <UpdateReviewModal
                isOpen={isModalOpen}
                onClose={closeModal}
                review={selectedReview}
                onUpdate={handleUpdate}
                isUpdating={isUpdating}
            />
        </div>
    );
};

export default MyReviews;