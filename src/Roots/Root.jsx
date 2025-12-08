import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Root = () => {
    return (
        <div>
            <div className='min-h-screen flex flex-col'>
                <Navbar />
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Root;