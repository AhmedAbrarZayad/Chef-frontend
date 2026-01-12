import React from 'react';
import { motion } from 'motion/react';

const FAQ = () => {
    const faqs = [
        {
            question: 'How does LocalChefBazaar work?',
            answer: 'Browse meals from local chefs, place orders, and get them delivered to your doorstep. Our chefs prepare fresh, homemade meals with quality ingredients.'
        },
        {
            question: 'Are the chefs verified?',
            answer: 'Yes, all chefs on our platform are thoroughly verified and must meet our quality standards before they can list their meals.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards, debit cards, and digital payment methods for your convenience.'
        },
        {
            question: 'Can I cancel my order?',
            answer: 'Yes, you can cancel your order before the chef starts preparing it. Cancellation policies vary by chef.'
        },
        {
            question: 'How do I become a chef on LocalChefBazaar?',
            answer: 'Sign up as a chef, complete your profile, submit verification documents, and start listing your delicious homemade meals.'
        },
        {
            question: 'Do you offer delivery?',
            answer: 'Yes, we offer delivery services for all orders. Delivery times and fees may vary based on your location.'
        }
    ];

    return (
        <section className="py-16 bg-base-100">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl roboto-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-lg roboto-normal opacity-70">Got questions? We've got answers</p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="collapse collapse-plus bg-base-200 border-2 border-black"
                        >
                            <input type="radio" name="faq-accordion" />
                            <div className="collapse-title text-lg roboto-bold">
                                {faq.question}
                            </div>
                            <div className="collapse-content">
                                <p className="roboto-normal opacity-70">{faq.answer}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
