import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import RoutePrefetcher from '../Components/RoutePrefetcher';

const Root = () => {
    return (
        <div className="bg-base-200 text-base-content">
            <div className='min-h-screen flex flex-col'>
                <Navbar />
                <Outlet />
                <RoutePrefetcher />
            </div>
            <Footer />
        </div>
    );
};

export default Root;