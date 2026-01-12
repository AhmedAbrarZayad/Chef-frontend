import React from 'react';
import Hero from '../Components/Hero';
import CardGrid from '../Components/CardGrid';
import ReviewsLayout from '../Components/ReviewsLayout';
import HowItWorks from '../Components/HowItWorks';
import Features from '../Components/Features';
import Categories from '../Components/Categories';
import Statistics from '../Components/Statistics';
import FAQ from '../Components/FAQ';
import Newsletter from '../Components/Newsletter';
import CallToAction from '../Components/CallToAction';

const Home = () => {
    return (
        <div>
            <Hero />
            <Features />
            <div>
                <h1 className='text-4xl font-bold text-center my-8'>Popular Meals</h1>
                <CardGrid />
            </div>
            <Categories />
            <Statistics />
            <HowItWorks />
            <ReviewsLayout />
            <FAQ />
            <CallToAction />
            <Newsletter />
        </div>
    );
};

export default Home;