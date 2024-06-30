import React, { useRef, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import Head from "next/head";

const Layout = ({ children }) => {
  const { scrollY } = useScroll();
  const contentRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      contentRef.current.style.height = `${window.innerHeight}px`;
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Head>
        <title>Full Page Scroll Effect</title>
      </Head>
      <div ref={contentRef} className="h-screen overflow-hidden">
        <motion.div
          style={{
            transform: scrollY.get().transform((y) => `translateY(-${y}px)`),
          }}
          className="flex flex-col h-full"
        >
          {children}
        </motion.div>
      </div>
    </>
  );
};

export default Layout;
