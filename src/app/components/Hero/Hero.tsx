import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["universe", "galaxy", "stars", "cosmos", "planets", "nebulae"];

const Hero = ({ scrollToExplore }) => {
  const [dynamicWord, setDynamicWord] = useState("universe");
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDynamicWord(words[wordIndex]);
  }, [wordIndex]);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-slate-500 to-slate-200 p-4">
      <div className="text-center">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-6xl md:text-6xl lg:text-8xl font-bold text-white"
        >
          Welcome to the Cosmos
        </motion.h1>
      </div>
      <div className="mt-4 flex items-center justify-center flex-wrap text-center">
        <span className="text-md md:text-xl lg:text-2xl font-bold text-white">
          Explore the wonders of the{" "}
        </span>
        <div className="relative h-8 md:h-10 lg:h-12">
          <AnimatePresence initial={false}>
            <motion.span
              key={dynamicWord}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute text-md md:text-xl lg:text-2xl font-bold text-slate-700 m-1"
            >
              {dynamicWord}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <div className="absolute bottom-10 w-full flex justify-center">
        <button
          onClick={scrollToExplore}
          className="text-white text-lg font-bold animate-bounce"
        >
          ↓ Scroll to Explore ↓
        </button>
      </div>
    </div>
  );
};

export default Hero;
