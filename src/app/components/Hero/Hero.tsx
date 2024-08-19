import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroEffect } from "./HeroEffect";

const words = ["universe", "galaxy", "stars", "cosmos", "planets", "nebulae"];

const Hero = ({ scrollToExplore }) => {
  const [dynamicWord, setDynamicWord] = useState("universe");
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDynamicWord(words[wordIndex]);
  }, [wordIndex]);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-slate-500 to-slate-200 p-4">
      <HeroEffect />
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-6xl md:text-6xl lg:text-8xl font-sans text-white relative"
        >
          <span className="select-none">Welcome to the</span>
          <div className="relative mt-6 lg:mt-10 text-6xl lg:text-8xl font-thin">
            <span className="relative inline-block bg-clip-text text-transparent hero-shine">
              Cosmos
            </span>
          </div>
        </motion.h1>
      </div>
      <div className="mt-8 lg:mt-12 flex items-center justify-center flex-wrap text-center relative z-10">
        <span className="text-md md:text-xl lg:text-2xl font-bold text-white">
        &quot; We know nothing &quot; about
        </span>
        <div className="relative h-8 md:h-10 lg:h-12">
          <AnimatePresence initial={false}>
            <motion.span
              key={dynamicWord}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute text-md md:text-xl lg:text-2xl font-thin text-gray-50 ml-1 mt-1 lg:mt-2"
            >
              {dynamicWord}
            </motion.span>
          </AnimatePresence>
        </div>
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
