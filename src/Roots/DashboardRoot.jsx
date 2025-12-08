import React from 'react';
import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../Hooks/useAxiosSecure';

const DashboardRoot = () => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();
    const {data: orders, isLoading } = useQuery({
        queryKey: ['orders', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders?email=${user?.email}`);
            return res.data;
        }
    });
    const {data: reviews, isLoading: reviewLoading} = useQuery({
        queryKey: ['reviews', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/all-reviews?email=${user?.email}`);
            return res.data;
        }
    })

    const value = {
        orders: orders,
        ordersLoading: isLoading,
        reviews: reviews,
        reviewLoading: reviewLoading
    }
    const NavLinks = [
        <NavLink to={'/dashboard'}>My Profile</NavLink>,
        <NavLink to={'/dashboard/orders'}>My Orders</NavLink>
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
                <Outlet context={value}/>
            </div>
        </div>
    );
};

export default DashboardRoot;