import React from 'react';
import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import useRole from '../Hooks/useRole';

const DashboardRoot = () => {
    const {role, isLoading: isRoleLoading} = useRole();
    const NavLinks = [
        <NavLink to={'/dashboard'}>My Profile</NavLink>,
        ...(((role === 'user') || (role === 'admin')) ? [
            <NavLink to={'/dashboard/orders'}>My Orders</NavLink>,
            <NavLink to={'/dashboard/reviews'}>My Reviews</NavLink>,
            <NavLink to={'/dashboard/favourites'}>Favourite Meals</NavLink>
        ] : []),
        ...(((role === 'chef') || (role === 'admin')) ? [
            <NavLink to={'/dashboard/create-meal'}>Create Meal</NavLink>,
            <NavLink to={'/dashboard/my-meals'}>My Meals</NavLink>,
            <NavLink to={'/dashboard/order-approval'}>Order Requests</NavLink>
        ] : []),
        ...DashboardRoot((role === 'admin' ? [
            <NavLink>Manage Users</NavLink>
        ] : []))
    ];
    return (
        <div className='flex flex-col md:flex-row min-h-screen gap-12 p-12'>
            <div className='options border-2 border-black roboto-normal w-[20%] p-6 flex flex-col gap-6 bg-white rounded-xl'>
                {
                    NavLinks.map((link, index) => (
                        <div key={index} className='bg-white hover:bg-black hover:text-white text-black border-2 border-black font-bold py-3 px-6 rounded-xl transition-all duration-200'>
                            {link}
                        </div>
                    ))
                }
            </div>
            <div className='flex justify-center w-full'>
                <Outlet/>
            </div>
        </div>
    );
};

export default DashboardRoot;