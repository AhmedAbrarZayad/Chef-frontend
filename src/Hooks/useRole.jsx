import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useAuth } from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();
    const {data, isLoading} = useQuery({
        queryKey: ['role', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/user-role?email=${user.email}`);
            return res.data;
        },
        //enabled: !!user?.email
    });
    console.log(data);
    return {role: data?.role, isRoleLoading: isLoading};
};

export default useRole;