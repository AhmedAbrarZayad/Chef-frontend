import React from 'react';
// Corrected import path for Framer Motion
import { motion } from 'framer-motion';

const Card = ({ meal }) => {
    // Destructure for cleaner access and provide safe defaults
    const { 
        foodImage, 
        foodName = "Untitled Dish", 
        chefName = "Unknown Chef", 
        rating = 0, 
        price = 0, 
        estimatedDeliveryTime, 
        deliveryArea = "Local Kitchen",
    } = meal;

    return (
        <motion.div 
            className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-shadow duration-300 h-full border-2 border-black"
            // Using Framer Motion for a subtle lift on hover
            whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
            {/* 🖼️ Image Container */}
            <div className="relative h-48 w-full">
                <img 
                    src={foodImage} 
                    alt={foodName} 
                    className="object-cover w-full h-full"
                    loading="lazy"
                />
                
                {/* Price Tag (Top Left) */}
                <div className="absolute top-3 left-3 bg-white text-black font-bold text-lg px-3 py-1 rounded-full shadow-md">
                    ${price.toFixed(2)}
                </div>

                {/* Rating Badge (Top Right) */}
                <div className="absolute top-3 right-3 bg-white text-black font-semibold text-sm px-3 py-1 rounded-full flex items-center shadow-md">
                    <span className="mr-1 text-base">⭐</span> 
                    {rating.toFixed(1)}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col grow">
                {/* Title */}
                <h3 className="text-xl font-extrabold text-gray-800 line-clamp-2 mb-1">
                    {foodName}
                </h3>
                
                {/* Chef Info */}
                <p className="text-sm text-gray-600 mb-4">
                    By <span className="font-semibold text-indigo-700">{chefName}</span>
                </p>

                {/* Key Details */}
                <div className="text-sm text-gray-500 space-y-1 mb-4 pt-2 border-t border-gray-100">
                    <p className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="font-semibold">Ready in:</span> {estimatedDeliveryTime || 'N/A'}
                    </p>
                    <p className="flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.727A8 8 0 016.343 3.273L4 5H2v14h2l-2 2h20l-2-2h2V5h-2l-2.343-2.343z" /></svg>
                        <span className="font-semibold">Area:</span> {deliveryArea}
                    </p>
                </div>
                
                {/* Button at the bottom */}
                <div className="mt-auto border-2 border-black rounded-full">
                    <button className="btn btn-primary w-full bg-white text-black hover:bg-black hover:text-white border-none font-semibold shadow-md transition-colors duration-200 border-2 border-black rounded-full">
                        View Meal
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Card;