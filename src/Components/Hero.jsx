import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Example Data - Replace strings with your imported image variables
const slides = [
  {
    id: 1,
    // Image of a delicious, warm dish (like lasagna or roasted chicken) on a rustic table.
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=60&w=600&auto=format&fit=crop", 
    imageLarge: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop",
    title: "The Taste of Home",
    subtitle: "Classic recipes, fresh ingredients, made with love—just like grandma's kitchen.",
    button: "See Our Menu"
  },
  {
    id: 2,
    // Image focusing on colorful, fresh ingredients (like vegetables being chopped or spices).
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=60&w=600&auto=format&fit=crop",
    imageLarge: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
    title: "Freshness Guaranteed",
    subtitle: "Sourcing local, seasonal produce to bring vibrant flavors to your table.",
    button: "Our Ingredients Story"
  },
  {
    id: 3,
    // Image of people gathered around a table laughing or sharing a meal.
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=60&w=600&auto=format&fit=crop",
    imageLarge: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
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
    <div className='container mx-auto px-2 sm:px-4 pb-4'>
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl group">
        
        {/* Simple fade without motion library for better mobile perf */}
        <div
          key={currentIndex}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url(${window.innerWidth > 768 ? slides[currentIndex].imageLarge : slides[currentIndex].image})` 
          }}
        >
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* TEXT CONTENT - Static on mobile, animated on desktop */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-neutral-content z-10">
          <div className="max-w-2xl px-4 sm:px-6">
            <div className="transition-opacity duration-500">
              <h1 className="mb-3 sm:mb-5 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight">
                {slides[currentIndex].title}
              </h1>
              
              <p className="mb-6 sm:mb-8 text-sm sm:text-base md:text-lg lg:text-xl font-light opacity-90">
                {slides[currentIndex].subtitle}
              </p>

              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black text-base sm:text-lg font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-lg">
                {slides[currentIndex].button}
              </button>
            </div>
          </div>
        </div>

        {/* INDICATOR DOTS */}
        <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center gap-2 sm:gap-3 z-20">
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