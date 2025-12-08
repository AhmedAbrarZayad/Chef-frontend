import React from 'react';
import { motion } from 'framer-motion';
import useAxiosSecure from '../Hooks/useAxiosSecure'; // Assuming this hook works
import { useQuery } from '@tanstack/react-query';
import ReviewCard from './ReviewCard';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const ReviewsLayout = () => {
    const axiosSecure = useAxiosSecure();
    const reviewsQuery = useQuery({
        queryKey: ['reviews'],
        queryFn: async () => {
            // Fetch more than 6 reviews to populate the carousel nicely
            const res = await axiosSecure.get('/all-reviews?limit=10');
            return res.data;
        }
    });

    if (reviewsQuery.isLoading) {
        return <div className="text-center py-10">Loading reviews...</div>;
    }

    if (reviewsQuery.isError) {
        return <div className="text-center py-10 text-red-600">Error loading reviews: {reviewsQuery.error.message}</div>;
    }

    const reviews = reviewsQuery.data || [];

    return (
        <motion.div 
            className="py-12 bg-gray-50"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
                What Our Customers Say 💬
            </h2>
            <div className="px-4 sm:px-6 lg:px-8">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    // Responsive breakpoints for horizontal display
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="review-swiper"
                >
                    {reviews.map((review) => (
                        <SwiperSlide key={review._id}>
                            {/* Pass data to the styled ReviewCard */}
                            <ReviewCard review={review} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </motion.div>
    );
};

export default ReviewsLayout;