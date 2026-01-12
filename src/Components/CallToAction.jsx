import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useAuth } from '../Hooks/useAuth';

const CallToAction = () => {
    const { user } = useAuth();

    return (
        <section className="py-20 bg-gradient-to-r from-primary-400 to-primary-600">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className="text-3xl md:text-5xl roboto-bold mb-6">
                        Ready to Taste Homemade Goodness?
                    </h2>
                    <p className="text-lg md:text-xl roboto-normal mb-8 opacity-90">
                        Join thousands of food lovers who enjoy delicious homemade meals from local chefs every day.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/meals"
                            className="btn btn-lg rounded-full border-2 border-black dark:border-white hover:bg-gray-100"
                        >
                            Browse Meals
                        </Link>
                        {!user && (
                            <Link
                                to="/auth/register"
                                className="btn btn-lg rounded-full border-2 border-black dark:border-white hover:bg-gray-100"
                            >
                                Sign Up Now
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CallToAction;
