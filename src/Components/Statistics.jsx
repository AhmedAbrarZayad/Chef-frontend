import React from 'react';
import { motion } from 'motion/react';

const Statistics = () => {
    const stats = [
        { number: '500+', label: 'Meals Available', icon: '🍽️' },
        { number: '150+', label: 'Local Chefs', icon: '👨‍🍳' },
        { number: '10K+', label: 'Happy Customers', icon: '😊' },
        { number: '50K+', label: 'Orders Delivered', icon: '🚚' }
    ];

    return (
        <section className="py-16 bg-primary-500">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl roboto-bold mb-4">Our Impact</h2>
                    <p className="text-lg roboto-normal opacity-90">Numbers that speak for themselves</p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center p-6"
                        >
                            <div className="text-5xl mb-4">{stat.icon}</div>
                            <div className="text-4xl roboto-bold mb-2">{stat.number}</div>
                            <div className="text-lg roboto-normal opacity-90">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
