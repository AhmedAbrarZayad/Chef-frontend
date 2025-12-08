import React from 'react';

const SearchBar = ({ onChange }) => {
    return (
        <div className='flex justify-center w-[80%]'>
            <label className="input rounded-4xl w-[80%] border-2 border-black">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
                >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input type="search" required placeholder="Search" onChange={(e) => onChange(e.target.value)} />
            </label>
        </div>
    );
};

export default SearchBar;