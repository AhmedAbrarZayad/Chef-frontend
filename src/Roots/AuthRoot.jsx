import React from 'react';
import { Outlet } from 'react-router';

const AuthRoot = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center py-12 px-4">
            <Outlet />
        </div>
    );
};

export default AuthRoot;