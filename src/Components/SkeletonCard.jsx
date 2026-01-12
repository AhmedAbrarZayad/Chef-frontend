import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="card bg-base-100 border-2 border-black h-[420px] animate-pulse">
            <figure className="h-48 skeleton rounded-t-2xl"></figure>
            <div className="card-body">
                <div className="h-6 skeleton rounded-full w-3/4 mb-2"></div>
                <div className="h-4 skeleton rounded-full w-full mb-1"></div>
                <div className="h-4 skeleton rounded-full w-2/3 mb-3"></div>
                <div className="flex justify-between items-center">
                    <div className="h-8 skeleton rounded-full w-20"></div>
                    <div className="h-10 skeleton rounded-full w-24"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
