import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroEffect } from "./HeroEffect";

const words = ["science", "arts", "history", "business", "culture"];

const Hero = ({ scrollToExplore }) => {
  const [dynamicWord, setDynamicWord] = useState(words[0]);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const changeWord = () => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    };

    const timeout = setTimeout(changeWord, 3500);

    return () => clearTimeout(timeout);
  }, [wordIndex]);

  useEffect(() => {
    setDynamicWord(words[wordIndex]);
  }, [wordIndex]);

  return (
    <div className="relative h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-black via-slate-500 to-slate-200 p-4">
      <HeroEffect />
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-6xl md:text-6xl lg:text-8xl font-sans text-white relative"
        >
          <div className="relative mt-6 lg:mt-10 text-6xl lg:text-8xl font-extralight">
            <span className="relative inline-block bg-clip-text text-transparent hero-shine">
              Gyaanhub
            </span>
          </div>
        </motion.h1>
      </div>
      <div className="mt-10 lg:mt-16 flex items-center right-5 lg:right-6 relative">
        <span className="text-md md:text-xl lg:text-2xl font-bold text-white">
          &quot;We know nothing&quot; about
        </span>
        <span className="relative flex items-center h-8 md:h-10 lg:h-12 ml-2">
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={dynamicWord}
              initial={{ y: -25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 25, opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
              className="absolute text-md md:text-xl lg:text-2xl font-thin text-gray-50"
            >
              {dynamicWord}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>

        <div className="absolute bottom-10 w-full flex justify-center z-10">
          <button
            onClick={scrollToExplore}
            className="text-white text-lg font-light animate-bounce"
          >
            ↓ Scroll to Explore ↓
          </button>
        </div>
      </div>
  );
};

export default Hero;
