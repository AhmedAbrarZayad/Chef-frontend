import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../Hooks/useAuth';
import { motion } from 'motion/react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../Hooks/useAxiosSecure';

const Login = () => {
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [loading, setLoading] = useState(false);
    const axiosSecure = useAxiosSecure();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            await signIn(data.email, data.password);
            navigate(from, { replace: true });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.message || 'Failed to login. Please check your credentials.',
                confirmButtonColor: '#000000',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
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
            Swal.fire({
                icon: 'error',
                title: 'Google Sign-In Failed',
                text: err.message || 'Failed to sign in with Google.',
                confirmButtonColor: '#000000',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-black p-8 text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-2">Welcome Back!</h2>
                    <p className="text-gray-300">Login to your LocalChefBazaar account</p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
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

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-black"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-black font-bold py-3 px-6 rounded-xl text-lg shadow-lg transition-all duration-200 border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Logging in...
                                </span>
                            ) : (
                                'Login'
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
                        disabled={loading}
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

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/auth/register"
                                state={{ from: location.state?.from }}
                                className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                            >
                                Register here
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

export default Login;