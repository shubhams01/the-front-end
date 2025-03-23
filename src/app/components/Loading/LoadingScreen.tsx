"use client";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
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
          <Image
            width={100}
            height={100}
            className="h-20 md:h-24 lg:h-28"
            src="https://api.gyaanhub.io/uploads/logo_white_31cbe3cc0d.svg"
            alt="Logo"
            priority
          />
        </motion.span>
      </motion.div>
    </>
  );
};

export default LoadingScreen;
