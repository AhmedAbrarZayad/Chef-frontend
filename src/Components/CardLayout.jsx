import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useState } from 'react';
import Card from './Card';

const CardLayout = ({ meals, totalPages = 1, page, setPage, isLoading }) => {
    if(isLoading){
        return <div className="text-center py-10">Loading meals...</div>;
    }
    return (
        <div>
            <div className='flex flex-col md:grid md:grid-cols-3 gap-5'>
                {
                    meals.map((meal) => (
                        <Card key={meal._id} meal={meal} />
                    ))
                }
            </div>
            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6 mb-5">

                <button 
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`px-3 py-2 rounded ${
                            page === num ? "bg-black text-white" : "bg-gray-200"
                        }`}
                    >
                        {num}
                    </button>
                ))}

                <button 
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => setPage(old => Math.min(old + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    Next
                </button>

            </div>
        </div>
    );
};

export default CardLayout;