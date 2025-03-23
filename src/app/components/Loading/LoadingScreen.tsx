"use client";
import { motion, useAnimation } from "framer-motion";
import React, { useEffect } from "react";

const LoadingScreen = () => {
  const overlayControls = useAnimation();

  useEffect(() => {
    setTimeout(() => {
      overlayControls.start({ y: "-100%" });
    }, 500);
    overlayControls.start({ y: "0%" });
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-slate-900 z-50 flex items-center justify-center"
        initial={{ y: "0%" }}
        animate={overlayControls}
        transition={{ duration: 1 }}
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        >
          <img
            className="h-20 md:h-24 lg:h-28"
            src="/logo-white.svg"
            alt="Logo"
          />
        </motion.span>
      </motion.div>
    </>
  );
};

export default LoadingScreen;
