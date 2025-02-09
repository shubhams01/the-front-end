"use client";

import React, { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";
import { motion } from "framer-motion";

const CategoryCard = ({ category, imageUrl, blurhash }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 800);
  };

  useEffect(() => {
    console.log('blurhash', blurhash)
  }, [])
  

  return (
    <motion.div
      className="rounded-xl relative overflow-hidden group w-72 h-96"
      onClick={handleClick}
    >
      <div className="w-full h-full rounded-lg overflow-hidden relative">
        {!isLoaded && (
          <Blurhash
            hash={blurhash || "LEHV6nWB2yk8pyo0adR*.7kCMdnj"}
            width="100%"
            height="100%"
            className="absolute inset-0"
          />
        )}

        <img
          src={imageUrl}
          alt={category}
          className={`transition-opacity duration-700 w-full h-full object-cover ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      <motion.div
        className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity"
        initial={{ opacity: 1 }}
        animate={isClicked ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-white text-center text-4xl font-black uppercase border-4 border-white px-4 py-2">
          {category}
        </span>
      </motion.div>

      {isClicked && (
        <motion.div
          className="absolute inset-0 flex"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 0.5 }}
            className="w-1/2 h-full bg-black"
          ></motion.div>
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ duration: 0.5 }}
            className="w-1/2 h-full bg-black"
          ></motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CategoryCard;
