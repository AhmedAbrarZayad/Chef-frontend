import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

const Categories = () => {
    const categories = [
        { name: 'Breakfast', emoji: '🍳', description: 'Start your day right', count: 45 },
        { name: 'Lunch', emoji: '🍱', description: 'Midday delights', count: 78 },
        { name: 'Dinner', emoji: '🍽️', description: 'Evening specials', count: 92 },
        { name: 'Desserts', emoji: '🍰', description: 'Sweet treats', count: 34 },
        { name: 'Beverages', emoji: '🥤', description: 'Refreshing drinks', count: 28 },
        { name: 'Snacks', emoji: '🍿', description: 'Quick bites', count: 56 }
    ];

    return (
        <section className="py-16 bg-base-100">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl roboto-bold mb-4">Browse Categories</h2>
                    <p className="text-lg roboto-normal opacity-70">Explore meals by category</p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <Link to={`/meals?category=${category.name}`}>
                                <div className="card bg-base-200 border-2 border-black hover:bg-primary-500 hover:text-white hover:scale-105 transition-all cursor-pointer p-6 text-center h-full">
                                    <div className="text-4xl mb-2">{category.emoji}</div>
                                    <h3 className="text-lg roboto-bold mb-1">{category.name}</h3>
                                    <p className="text-sm opacity-70">{category.description}</p>
                                    <p className="text-xs mt-2 roboto-bold">{category.count} meals</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
