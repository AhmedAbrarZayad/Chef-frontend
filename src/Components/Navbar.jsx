import React from 'react';
import { NavLink } from 'react-router';

const Navbar = () => {
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
        <div className="navbar bg-base-100">
        <div className="navbar-start">
            <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
            </div>
            <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow gap-3">
                {NavLinks}
            </ul>
            </div>
            <a className="btn btn-ghost text-xl roboto-bold">LocalChefBazaar</a>
        </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-10 text-black">
                {NavLinks}
            </ul>
        </div>
        <div className="navbar-end">
            <a className="btn rounded-4xl border-2 border-black">Login</a>
        </div>
        </div>
    );
};

export default Navbar;