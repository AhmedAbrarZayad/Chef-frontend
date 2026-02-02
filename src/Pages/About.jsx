import React from 'react';
import { motion } from 'motion/react';

const About = () => {
    const team = [
        {
            name: 'Sarah Johnson',
            role: 'Founder & CEO',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
            bio: 'Passionate about connecting local chefs with food lovers.'
        },
        {
            name: 'Michael Chen',
            role: 'Head of Operations',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            bio: 'Ensuring smooth delivery and quality service every day.'
        },
        {
            name: 'Emily Davis',
            role: 'Chef Relations Manager',
            image: 'https://randomuser.me/api/portraits/women/65.jpg',
            bio: 'Working closely with our talented local chefs.'
        },
        {
            name: 'David Wilson',
            role: 'Technology Lead',
            image: 'https://randomuser.me/api/portraits/men/22.jpg',
            bio: 'Building the platform that brings everyone together.'
        }
    ];

    const values = [
        { icon: '🤝', title: 'Community First', description: 'Supporting local chefs and building strong communities' },
        { icon: '🌟', title: 'Quality', description: 'Committed to delivering the highest quality homemade meals' },
        { icon: '💚', title: 'Sustainability', description: 'Promoting eco-friendly practices and reducing food waste' },
        { icon: '🔒', title: 'Trust', description: 'Building trust through transparency and reliability' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-400 to-primary-600 py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl roboto-bold mb-6">About LocalChefBazaar</h1>
                        <p className="text-lg md:text-xl roboto-normal opacity-90">
                            Connecting food lovers with talented local chefs, one homemade meal at a time.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 bg-base-100">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl roboto-bold text-center mb-8">Our Story</h2>
                        <p className="text-lg roboto-normal opacity-70 leading-relaxed">
                            LocalChefBazaar was born from a simple idea: everyone deserves access to delicious, homemade meals prepared by talented local chefs. We noticed that many skilled home cooks had amazing culinary talents but lacked a platform to share their creations with the community.
                        </p>
                        <p className="text-lg roboto-normal opacity-70 leading-relaxed">
                            Founded in 2023, we've grown from a small neighborhood initiative to a thriving platform that connects hundreds of local chefs with thousands of food enthusiasts. Our mission is to celebrate home cooking, support local talent, and bring people together through the universal language of food.
                        </p>
                        <p className="text-lg roboto-normal opacity-70 leading-relaxed">
                            Today, LocalChefBazaar is more than just a meal delivery service—it's a community where food lovers discover authentic homemade cuisine, and where passionate chefs turn their culinary skills into a sustainable livelihood.
                        </p>
                    </motion.div>
                </div>
            </section>


            {/* Stats Section */}
            <section className="py-16 bg-primary-500">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl roboto-bold mb-2">150+</div>
                            <div className="text-lg roboto-normal opacity-90">Local Chefs</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl roboto-bold mb-2">10K+</div>
                            <div className="text-lg roboto-normal opacity-90">Happy Customers</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl roboto-bold mb-2">500+</div>
                            <div className="text-lg roboto-normal opacity-90">Meals Available</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl roboto-bold mb-2">50K+</div>
                            <div className="text-lg roboto-normal opacity-90">Orders Delivered</div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
