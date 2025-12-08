import React from 'react';
import { motion } from 'framer-motion';

const ReviewCard = ({ review }) => {
    // Destructure required fields from the review object
    const { reviewerName, reviewerImage, rating, comment, date } = review;

    // Format the date for a cleaner display
    const formattedDate = new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    // Determine the rating display (full stars vs. empty stars)
    const starRating = Array.from({ length: 5 }).map((_, i) => (
        <span
            key={i}
            className={`text-2xl ${
                i < rating ? "text-yellow-500" : "text-gray-300"
            }`}
        >
            ★
        </span>
    ));

    return (
        <motion.div
            className="p-6 h-[300px] rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {/* Rating Section (Prominent) */}
            <div className="flex items-center gap-1 mb-4">
                {starRating}
                <span className="ml-2 text-lg font-bold text-gray-800">{rating.toFixed(1)}</span>
            </div>

            {/* Comment Body */}
            <p className="flex-grow text-gray-700 italic leading-relaxed text-base mb-6">
                "{comment}"
            </p>

            {/* User Header */}
            <div className="flex items-center gap-4 mt-auto border-t pt-4">
                <img
                    src={reviewerImage}
                    alt={reviewerName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary-400 shadow-md"
                />
                <div>
                    <h3 className="font-bold text-xl text-gray-900">{reviewerName}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Reviewed on {formattedDate}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewCard;