import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../Hooks/useAuth';
import { motion } from 'framer-motion';
import useAxiosSecure from '../Hooks/useAxiosSecure';

const Register = () => {
    const { createUser, updateUserProfile, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const axiosSecure = useAxiosSecure();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password');

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create preview
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
        } catch (err) {
            throw new Error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const onSubmit = async (data) => {
        setError('');
        setLoading(true);

        try {
            // Validate image file
            if (!imageFile) {
                setError('Please select a profile image');
                setLoading(false);
                return;
            }

            // Upload image to ImageBB
            const imageUrl = await uploadImage();
            
            if (!imageUrl) {
                setError('Failed to upload image. Please try again.');
                setLoading(false);
                return;
            }

            // Create user with email and password
            await createUser(data.email, data.password);
            
            // Update profile with name and uploaded photo URL
            await updateUserProfile(data.name, imageUrl);

            const newUser = {
                name: data.name,
                email: data.email,
                photoURL: imageUrl,
                address: data.address,
                role: 'user',
                status: 'active',
                fraud: 'no',
            }

            await axiosSecure.post('/addUsers', newUser);   
            
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await signInWithGoogle();
            const user = result.user;
            
            // Create user document in database
            const newUser = {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                address: 'Not provided',
                role: 'user',
                status: 'active',
                fraud: 'no',
            };
            
            // Try to add user to database (will be handled by backend if exists)
            try {
                await axiosSecure.post('/addUsers', newUser);
            } catch (dbErr) {
                // User might already exist, which is fine
                console.log('User might already exist:', dbErr);
            }
            
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Failed to sign in with Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
        >
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-black p-8 text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-2">Create Account</h2>
                    <p className="text-gray-300">Join LocalChefBazaar today!</p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Name must be at least 3 characters',
                                    },
                                })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-black"
                                placeholder="Enter your full name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-black"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Profile Image */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Profile Image <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-4">
                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-500 flex-shrink-0">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                
                                {/* File Input */}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="file-input file-input-bordered file-input-primary w-full"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Accepted formats: JPG, PNG, GIF, WEBP (Max 5MB)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register('address', {
                                    required: 'Address is required',
                                    minLength: {
                                        value: 10,
                                        message: 'Address must be at least 10 characters',
                                    },
                                })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none resize-none text-black"
                                placeholder="Enter your full address"
                                rows="3"
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-black"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value) =>
                                        value === password || 'Passwords do not match',
                                })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-black"
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || uploadingImage}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-black font-bold py-3 px-6 rounded-xl text-lg shadow-lg transition-all duration-200 border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading || uploadingImage ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="loading loading-spinner loading-sm"></span>
                                    {uploadingImage ? 'Uploading image...' : 'Creating account...'}
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign In Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleSignIn}
                        disabled={loading || uploadingImage}
                        type="button"
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl text-lg shadow-lg transition-all duration-200 border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign in with Google
                    </motion.button>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/auth/login"
                                state={{ from: location.state?.from }}
                                className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>

                    {/* Home Link */}
                    <div className="mt-4 text-center">
                        <Link
                            to="/"
                            className="text-gray-500 hover:text-gray-700 text-sm hover:underline"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Register;