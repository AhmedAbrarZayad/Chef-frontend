import React from 'react';
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../Hooks/useAxiosSecure';
import Card from './Card';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CardGrid = () => {
    const axiosSecure = useAxiosSecure();
    const {data, isLoading} = useQuery({
        queryKey: ['meals'],
        queryFn: async () => {
            const res = await axiosSecure.get('/all-meals?limit=6');
            return res.data;
        }
    })
    console.log(data);
    return (
        <div>
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                centeredSlides={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                        centeredSlides: true,
                    },
                    768: {
                        slidesPerView: 2,
                        centeredSlides: false,
                    },
                    1024: {
                        slidesPerView: 3,
                        centeredSlides: false,
                    },
                }}
                className="meals-swiper"
            >
                {
                    data?.items.map((meal, index) => (
                        <SwiperSlide key={index} className="flex justify-center">
                            <Card id={meal._id} meal={meal} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
};

export default CardGrid;