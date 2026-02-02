import React, { lazy, Suspense } from 'react';
import Hero from '../Components/Hero';
import Features from '../Components/Features';
import CardGrid from '../Components/CardGrid';

// Lazy load components that are below the fold
const Categories = lazy(() => import('../Components/Categories'));
const Statistics = lazy(() => import('../Components/Statistics'));
const HowItWorks = lazy(() => import('../Components/HowItWorks'));
const ReviewsLayout = lazy(() => import('../Components/ReviewsLayout'));
const FAQ = lazy(() => import('../Components/FAQ'));
const CallToAction = lazy(() => import('../Components/CallToAction'));
const Newsletter = lazy(() => import('../Components/Newsletter'));

const Home = () => {
    return (
        <div>
            <Hero />
            <Features />
            <div>
                <h1 className='text-4xl font-bold text-center my-8'>Popular Meals</h1>
                <CardGrid />
            </div>
            <Suspense fallback={<div className="h-20" />}>
                <Categories />
                <HowItWorks />
                <ReviewsLayout />
                <FAQ />
                <CallToAction />
                <Newsletter />
            </Suspense>
        </div>
    );
};

export default Home;