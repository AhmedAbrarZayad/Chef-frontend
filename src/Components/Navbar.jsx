import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router';
import { useAuth } from '../Hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout()
            .then(() => {})
            .catch(error => console.error('Logout error:', error));
    };

    const NavLinks = (
    <>
        <NavLink
        to="/"
        className={({ isActive }) =>
            `roboto-normal ${isActive ? 'border-b-2 border-black' : ''}`
        }
        >
        Home
        </NavLink>

        <NavLink
        to="/meals"
        className={({ isActive }) =>
            `roboto-normal ${isActive ? 'border-b-2 border-black' : ''}`
        }
        >
        Meals
        </NavLink>
    </>
    );
    return (
        <div className="navbar bg-base-100 px-2 sm:px-4">
        <div className="navbar-start">
            <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
            </div>
            <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[100] mt-3 w-52 p-2 shadow gap-3">
                {NavLinks}
            </ul>
            </div>
            <a className="btn btn-ghost text-sm sm:text-lg md:text-xl roboto-bold hidden sm:flex">LocalChefBazaar</a>
            <a className="btn btn-ghost text-xs roboto-bold flex sm:hidden">LCB</a>
        </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-10 text-black">
                {NavLinks}
            </ul>
        </div>
        <div className="navbar-end gap-1 sm:gap-2 md:gap-3">
            {user ? (
                <>
                    {/* User Profile Picture */}
                    <div className="avatar cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="w-8 sm:w-10 rounded-full ring ring-primary-500 ring-offset-2">
                            <img src={user.photoURL || 'https://via.placeholder.com/40'} alt={user.displayName || 'User'} />
                        </div>
                    </div>
                    <button 
                        className="btn btn-sm sm:btn-md rounded-full border-2 border-black hover:bg-primary-500 hover:text-white hidden md:flex"
                    >
                        <NavLink to="/dashboard">Dashboard</NavLink>
                    </button>
                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="btn btn-sm sm:btn-md rounded-full border-2 border-black hover:bg-primary-500 hover:text-white"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    {/* Login Button */}
                    <Link 
                        to="/auth/login"
                        className="btn btn-sm sm:btn-md rounded-full border-2 border-black hover:bg-primary-500 hover:text-white"
                    >
                        Login
                    </Link>
                    {/* Register Button */}
                    <Link 
                        to="/auth/register"
                        className="btn btn-sm sm:btn-md rounded-full border-2 border-black hover:bg-primary-500 hover:text-white hidden sm:flex"
                    >
                        Register
                    </Link>
                </>
            )}
        </div>
        </div>
    );
};

export default Navbar;