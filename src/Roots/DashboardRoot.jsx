import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import useRole from '../Hooks/useRole';

const DashboardRoot = () => {
    const {role, isLoading: isRoleLoading} = useRole();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const NavLinks = [
        <NavLink to={'/dashboard'} onClick={() => setIsSidebarOpen(false)}>My Profile</NavLink>,
        ...(((role === 'user')) ? [
            <NavLink to={'/dashboard/orders'} onClick={() => setIsSidebarOpen(false)}>My Orders</NavLink>,
            <NavLink to={'/dashboard/reviews'} onClick={() => setIsSidebarOpen(false)}>My Reviews</NavLink>,
            <NavLink to={'/dashboard/favourites'} onClick={() => setIsSidebarOpen(false)}>Favourite Meals</NavLink>
        ] : []),
        ...(((role === 'chef')) ? [
            <NavLink to={'/dashboard/create-meal'} onClick={() => setIsSidebarOpen(false)}>Create Meal</NavLink>,
            <NavLink to={'/dashboard/my-meals'} onClick={() => setIsSidebarOpen(false)}>My Meals</NavLink>,
            <NavLink to={'/dashboard/order-approval'} onClick={() => setIsSidebarOpen(false)}>Order Requests</NavLink>
        ] : []),
        ...((role === 'admin' ? [
            <NavLink to={'/dashboard/manage-users'} onClick={() => setIsSidebarOpen(false)}>Manage Users</NavLink>,
            <NavLink to={'/dashboard/manage-requests'} onClick={() => setIsSidebarOpen(false)}>Manage Requests</NavLink>,
            <NavLink to={'/dashboard/platform-statistics'} onClick={() => setIsSidebarOpen(false)}>Platform Statistics</NavLink>
        ] : []))
    ];
    
    return (
        <div className='flex flex-col md:flex-row min-h-screen gap-4 md:gap-12 p-4 pt-20 md:pt-12 md:p-12'>
            {/* Mobile Menu Button - Only show when sidebar is closed */}
            {!isSidebarOpen && (
                <button 
                    className="md:hidden fixed top-20 left-4 z-50 bg-white border-2 border-black p-3 rounded-xl shadow-lg"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            )}

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                options border-2 border-black roboto-normal p-6 flex flex-col gap-6 bg-white rounded-xl
                fixed md:static top-0 left-0 h-full md:h-auto w-64 md:w-[20%]
                transform transition-transform duration-300 ease-in-out z-40
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                overflow-y-auto
            `}>
                {/* Close button for mobile */}
                <button 
                    className="md:hidden self-end p-2 -mt-2 -mr-2"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                {NavLinks.map((link, index) => (
                    <div key={index} className='bg-white hover:bg-black hover:text-white text-black border-2 border-black font-bold py-3 px-6 rounded-xl transition-all duration-200'>
                        {link}
                    </div>
                ))}
            </div>
            
            <div className='flex justify-center w-full mt-16 md:mt-0'>
                <Outlet/>
            </div>
        </div>
    );
};

export default DashboardRoot;