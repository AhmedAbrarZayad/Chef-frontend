import React from 'react';
import Hero from '../Components/Hero';
import CardGrid from '../Components/CardGrid';
import ReviewsLayout from '../Components/ReviewsLayout';
import HowItWorks from '../Components/HowItWorks';

const Home = () => {
    return (
        <div>
            <Hero />
            <div>
                <h1 className='text-4xl font-bold text-center my-8'>Popular Meals</h1>
                <CardGrid />
            </div>
            <HowItWorks />
            <ReviewsLayout />
        </div>
    );
};

export default Home;