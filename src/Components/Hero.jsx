import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";

// Example Data - Replace strings with your imported image variables
const slides = [
  {
    id: 1,
    // Image of a delicious, warm dish (like lasagna or roasted chicken) on a rustic table.
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2070&auto=format&fit=crop", 
    title: "The Taste of Home",
    subtitle: "Classic recipes, fresh ingredients, made with love—just like grandma's kitchen.",
    button: "See Our Menu"
  },
  {
    id: 2,
    // Image focusing on colorful, fresh ingredients (like vegetables being chopped or spices).
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    title: "Freshness Guaranteed",
    subtitle: "Sourcing local, seasonal produce to bring vibrant flavors to your table.",
    button: "Our Ingredients Story"
  },
  {
    id: 3,
    // Image of people gathered around a table laughing or sharing a meal.
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop",
    title: "Dinner Made Simple",
    subtitle: "Skip the prep and cleanup. Enjoy a delicious, ready-made meal tonight.",
    button: "Order Now"
  }
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='container mx-auto px-4 pb-4'>
      <div className="relative h-[600px] w-full overflow-hidden rounded-3xl shadow-2xl group">
        
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex} // Key change triggers the animation
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
            
            // Animation: Start slightly zoomed in (1.2) and fade in, then scale down to 1
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} 
            transition={{ duration: 1.5, ease: "easeOut" }} // Slow and smooth
          >
            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </motion.div>
        </AnimatePresence>

        {/* TEXT CONTENT ANIMATION */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-neutral-content z-10">
          <div className="max-w-2xl px-4">
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }} // Delay text slightly after bg
              >
                <h1 className="mb-5 text-5xl md:text-7xl font-bold tracking-tight">
                  {slides[currentIndex].title}
                </h1>
                
                <p className="mb-8 text-lg md:text-xl font-light opacity-90">
                  {slides[currentIndex].subtitle}
                </p>

                <motion.button 
                  className="btn btn-primary btn-lg border-none hover:scale-105 transition-transform rounded-full bg-white text-black font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {slides[currentIndex].button}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* INDICATOR DOTS */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Hero;