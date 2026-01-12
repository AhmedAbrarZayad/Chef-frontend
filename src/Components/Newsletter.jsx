import React, { useState } from 'react';
import { motion } from 'motion/react';
import Swal from 'sweetalert2';

const Newsletter = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            Swal.fire({
                icon: 'success',
                title: 'Subscribed!',
                text: 'Thank you for subscribing to our newsletter!',
                confirmButtonText: 'OK'
            });
            setEmail('');
        }
    };

    return (
        <section className="py-16 bg-base-200">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="text-5xl mb-4">📧</div>
                    <h2 className="text-3xl md:text-4xl roboto-bold mb-4">Stay Updated</h2>
                    <p className="text-lg roboto-normal opacity-70 mb-8">
                        Subscribe to our newsletter and get exclusive deals, new chef updates, and special offers delivered to your inbox.
                    </p>

                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input input-bordered border-2 border-black flex-1 max-w-md"
                        />
                        <button
                            type="submit"
                            className="btn rounded-full border-2 border-black bg-primary-500 text-white hover:bg-primary-600"
                        >
                            Subscribe
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Newsletter;
