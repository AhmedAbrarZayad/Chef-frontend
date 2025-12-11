import React, { useState } from 'react';
import { useAuth } from '../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaStar } from 'react-icons/fa';

const MyMeals = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 12;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['chefMeals', user?.email, currentPage],
        queryFn: async () => {
            const res = await axiosSecure.get(`/chef-meals?email=${user?.email}&page=${currentPage}&limit=${limit}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    const meals = data?.items || [];
    const totalPages = data?.totalPages || 0;

    const handleDelete = async (mealId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/delete-meal/${mealId}`);
                if (res.data.deletedCount > 0) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Your meal has been deleted.',
                        confirmButtonColor: '#000000',
                    });
                    refetch();
                }
            } catch {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to delete meal',
                });
            }
        }
    };

    const handleUpdate = async (meal) => {
        let selectedFile = null;

        const { value: formValues } = await Swal.fire({
            title: 'Update Meal',
            html: `
                <div class="space-y-4 text-left">
                    <div>
                        <label class="block text-sm font-semibold mb-1">Food Name</label>
                        <input id="foodName" class="swal2-input w-full" value="${meal.foodName}" />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-1">Chef Name</label>
                        <input id="chefName" class="swal2-input w-full" value="${meal.chefName}" />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-1">Price ($)</label>
                        <input id="price" type="number" step="0.01" class="swal2-input w-full" value="${meal.price}" />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-1">Ingredients (comma-separated)</label>
                        <textarea id="ingredients" class="swal2-textarea w-full" rows="3">${meal.ingredients.join(', ')}</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-1">Delivery Time</label>
                        <input id="deliveryTime" class="swal2-input w-full" value="${meal.estimatedDeliveryTime}" />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-1">Chef Experience</label>
                        <textarea id="chefExperience" class="swal2-textarea w-full" rows="2">${meal.chefExperience}</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-1">Food Image</label>
                        <input id="foodImageInput" type="file" accept="image/*" class="swal2-file w-full" />
                        <img id="imagePreview" src="${meal.foodImage}" class="mt-2 w-32 h-32 object-cover rounded-lg border-2 border-gray-300" />
                    </div>
                </div>
            `,
            width: '600px',
            confirmButtonText: 'Update',
            confirmButtonColor: '#000000',
            cancelButtonColor: '#6b7280',
            showCancelButton: true,
            didOpen: () => {
                const fileInput = document.getElementById('foodImageInput');
                const preview = document.getElementById('imagePreview');
                
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        selectedFile = file;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            preview.src = reader.result;
                        };
                        reader.readAsDataURL(file);
                    }
                });
            },
            preConfirm: () => {
                const foodName = document.getElementById('foodName').value;
                const chefName = document.getElementById('chefName').value;
                const price = document.getElementById('price').value;
                const ingredients = document.getElementById('ingredients').value;
                const deliveryTime = document.getElementById('deliveryTime').value;
                const chefExperience = document.getElementById('chefExperience').value;

                if (!foodName || !chefName || !price || !ingredients || !deliveryTime || !chefExperience) {
                    Swal.showValidationMessage('Please fill in all fields');
                    return false;
                }

                return {
                    foodName,
                    chefName,
                    price: parseFloat(price),
                    ingredients: ingredients.split(',').map(item => item.trim()).filter(item => item !== ''),
                    estimatedDeliveryTime: deliveryTime,
                    chefExperience,
                    rating: meal.rating,
                    hasNewImage: !!selectedFile
                };
            }
        });

        if (formValues) {
            try {
                let foodImageUrl = meal.foodImage;

                // Upload new image if selected
                if (formValues.hasNewImage && selectedFile) {
                    Swal.fire({
                        title: 'Uploading Image...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    const formData = new FormData();
                    formData.append('image', selectedFile);

                    const imageResponse = await fetch(
                        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_BB}`,
                        {
                            method: 'POST',
                            body: formData,
                        }
                    );
                    const imageData = await imageResponse.json();

                    if (imageData.success) {
                        foodImageUrl = imageData.data.url;
                    } else {
                        throw new Error('Image upload failed');
                    }
                }

                const updateData = {
                    ...formValues,
                    foodImage: foodImageUrl
                };
                delete updateData.hasNewImage;

                const res = await axiosSecure.patch(`/update-meal/${meal._id}`, updateData);
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated!',
                        text: 'Your meal has been updated successfully.',
                        confirmButtonColor: '#000000',
                    });
                    refetch();
                } else {
                    Swal.fire({
                        icon: 'info',
                        title: 'No Changes',
                        text: 'No changes were made to the meal.',
                        confirmButtonColor: '#000000',
                    });
                }
            } catch {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to update meal',
                });
            }
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg text-primary-500"></div>
            </div>
        );
    }

    if (!meals || meals.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No Meals Yet</h2>
                    <p className="text-gray-500">You haven't created any meals yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Meals</h1>
                <p className="text-gray-600">Manage all your created meals</p>
                <div className="w-full h-px bg-gray-300 mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((meal) => (
                    <motion.div
                        key={meal._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl border-2 border-black overflow-hidden hover:shadow-xl transition-all duration-200"
                    >
                        {/* Food Image */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={meal.foodImage}
                                alt={meal.foodName}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-full font-bold">
                                ${meal.price}
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5">
                            {/* Food Name */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                                {meal.foodName}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            className={`${
                                                index < Math.floor(meal.rating)
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                            size={16}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                    {meal.rating || 0}
                                </span>
                            </div>

                            {/* Chef Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-start gap-2">
                                    <span className="text-sm font-semibold text-gray-700">Chef:</span>
                                    <span className="text-sm text-gray-600">{meal.chefName}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-sm font-semibold text-gray-700">Chef ID:</span>
                                    <span className="text-sm text-gray-600">{meal.chefId}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-sm font-semibold text-gray-700">Delivery:</span>
                                    <span className="text-sm text-gray-600">{meal.estimatedDeliveryTime}</span>
                                </div>
                            </div>

                            {/* Ingredients */}
                            <div className="mb-4">
                                <span className="text-sm font-semibold text-gray-700 block mb-1">Ingredients:</span>
                                <div className="flex flex-wrap gap-1">
                                    {meal.ingredients && meal.ingredients.slice(0, 3).map((ingredient, index) => (
                                        <span
                                            key={index}
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-300"
                                        >
                                            {ingredient}
                                        </span>
                                    ))}
                                    {meal.ingredients && meal.ingredients.length > 3 && (
                                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-300">
                                            +{meal.ingredients.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdate(meal)}
                                    className="flex-1 bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(meal._id)}
                                    className="flex-1 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-black text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                    >
                        Previous
                    </button>
                    
                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    currentPage === index + 1
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black border-2 border-black hover:bg-gray-100'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-black text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyMeals;