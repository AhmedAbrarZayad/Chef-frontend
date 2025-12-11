import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../Hooks/useAuth';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const CreateMeals = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    const {data: userData, isLoading} = useQuery({
        queryKey: ['userData', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users?email=${user?.email}`);
            return res.data;
        }
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload image to ImageBB
    const uploadImage = async () => {
        if (!imageFile) return null;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_BB}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const data = await response.json();
            
            if (data.success) {
                return data.data.url;
            } else {
                throw new Error('Image upload failed');
            }
        } catch {
            throw new Error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            // Validate image file
            if (!imageFile) {
                Swal.fire({
                    icon: 'error',
                    title: 'Image Required',
                    text: 'Please select a food image',
                });
                setLoading(false);
                return;
            }

            // Upload image to ImageBB
            const imageUrl = await uploadImage();
            
            if (!imageUrl) {
                Swal.fire({
                    icon: 'error',
                    title: 'Upload Failed',
                    text: 'Failed to upload image. Please try again.',
                });
                setLoading(false);
                return;
            }

            // Process ingredients (convert comma-separated string to array)
            const ingredientsArray = data.ingredients.split(',').map(item => item.trim()).filter(item => item !== '');

            const mealData = {
                foodName: data.foodName,
                chefName: data.chefName,
                foodImage: imageUrl,
                price: parseFloat(data.price),
                rating: 0,
                ingredients: ingredientsArray,
                estimatedDeliveryTime: data.estimatedDeliveryTime,
                chefExperience: data.chefExperience,
                chefId: userData?._id,
                userEmail: user?.email,
                createdAt: new Date().toISOString()
            };

            const res = await axiosSecure.post('/addMeal', mealData);

            if (res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Meal created successfully',
                    confirmButtonColor: '#000000',
                });
                reset();
                setImageFile(null);
                setImagePreview('');
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to create meal',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full max-w-4xl mx-auto p-6'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-white border-2 border-black rounded-xl p-8'
            >
                <h1 className='text-3xl font-bold text-center mb-8'>Create New Meal</h1>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Food Name */}
                    <div>
                        <label className='block font-semibold mb-2'>Food Name *</label>
                        <input
                            type='text'
                            {...register('foodName', { required: 'Food name is required' })}
                            className='w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                            placeholder='Enter food name'
                        />
                        {errors.foodName && <p className='text-red-500 text-sm mt-1'>{errors.foodName.message}</p>}
                    </div>

                    {/* Chef Name */}
                    <div>
                        <label className='block font-semibold mb-2'>Chef Name *</label>
                        <input
                            type='text'
                            {...register('chefName', { required: 'Chef name is required' })}
                            className='w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                            placeholder='Enter chef name'
                        />
                        {errors.chefName && <p className='text-red-500 text-sm mt-1'>{errors.chefName.message}</p>}
                    </div>

                    {/* Food Image */}
                    <div>
                        <label className='block font-semibold mb-2'>Food Image *</label>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            className='w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                        />
                        {imagePreview && (
                            <div className='mt-4'>
                                <img src={imagePreview} alt='Preview' className='w-48 h-48 object-cover rounded-lg border-2 border-black' />
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <label className='block font-semibold mb-2'>Price (USD) *</label>
                        <input
                            type='number'
                            step='0.01'
                            {...register('price', { 
                                required: 'Price is required',
                                min: { value: 0.01, message: 'Price must be greater than 0' }
                            })}
                            className='w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                            placeholder='Enter price'
                        />
                        {errors.price && <p className='text-red-500 text-sm mt-1'>{errors.price.message}</p>}
                    </div>

                    {/* Ingredients */}
                    <div>
                        <label className='block font-semibold mb-2'>Ingredients (comma-separated) *</label>
                        <textarea
                            {...register('ingredients', { required: 'Ingredients are required' })}
                            className='w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                            placeholder='e.g., Chicken breast, Lettuce, Tomatoes, Cucumber'
                            rows='4'
                        />
                        {errors.ingredients && <p className='text-red-500 text-sm mt-1'>{errors.ingredients.message}</p>}
                    </div>

                    {/* Estimated Delivery Time */}
                    <div>
                        <label className='block font-semibold mb-2'>Estimated Delivery Time *</label>
                        <input
                            type='text'
                            {...register('estimatedDeliveryTime', { required: 'Delivery time is required' })}
                            className='w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                            placeholder='e.g., 30 minutes'
                        />
                        {errors.estimatedDeliveryTime && <p className='text-red-500 text-sm mt-1'>{errors.estimatedDeliveryTime.message}</p>}
                    </div>

                    {/* Chef Experience */}
                    <div>
                        <label className='block font-semibold mb-2'>Chef Experience *</label>
                        <textarea
                            {...register('chefExperience', { required: 'Chef experience is required' })}
                            className='w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                            placeholder='e.g., 5 years of experience in Mediterranean cuisine'
                            rows='3'
                        />
                        {errors.chefExperience && <p className='text-red-500 text-sm mt-1'>{errors.chefExperience.message}</p>}
                    </div>

                    {/* User Email (Read-only) */}
                    <div>
                        <label className='block font-semibold mb-2'>User Email</label>
                        <input
                            type='email'
                            value={user?.email || ''}
                            readOnly
                            className='w-full px-4 py-3 border-2 border-black rounded-lg bg-gray-100 cursor-not-allowed'
                        />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type='submit'
                        disabled={loading || uploadingImage}
                        whileHover={{ scale: loading || uploadingImage ? 1 : 1.02 }}
                        whileTap={{ scale: loading || uploadingImage ? 1 : 0.98 }}
                        className='w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Creating Meal...' : uploadingImage ? 'Uploading Image...' : 'Create Meal'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateMeals;