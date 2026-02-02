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
            if (!user?.email) return { role: null };
            const res = await axiosSecure.get(`/user-role?email=${user.email}`);
            return res.data || { role: null };
        },
        enabled: !!user?.email
    });
    return {role: data?.role, isRoleLoading: isLoading};
};

export default useRole;