"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const menuLinks = [
  { path: "/", label: "Home" },
  { path: "/categories", label: "Categories" },
  { path: "/about", label: "About" },
];

const Menu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuVariants = {
    open: {
      translateY: 0,
      transition: { duration: 0.5, ease: "easeInOut" }, // Adjust these as needed
    },
    closed: {
      translateY: "100%", // Adjust for full screen height or desired position
      transition: { duration: 0.7, ease: "easeInOut" }, // Adjust these as needed
    },
  };

  const menuItemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { stagger: 0.1, duration: 0.7, ease: "easeInOut" }, // Adjust these as needed
    },
    closed: {
      opacity: 0,
      y: 20,
    },
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className={`fixed left-2 font-black text-2xl font-sans p-4 z-50 ${
          isMenuOpen ? "text-black" : "text-white"
        }`}
      >
        Gyaanhub
      </div>
      <button
        className={`fixed right-2 font-semibold p-4 z-50 ${
          isMenuOpen ? "text-black" : "text-white"
        }`}
        onClick={toggleMenu}
      >
        <span className="text-2xl font-bold">&#9776;</span>
      </button>
      <motion.div
        className="menu-overlay fixed inset-0 bg-lime-500 bg-opacity-100"
        variants={menuVariants}
        animate={isMenuOpen ? "open" : "closed"}
      >
        <div className="flex flex-col h-full justify-center items-center">
          <motion.div
            className="flex flex-col space-y-4"
            variants={menuItemVariants}
            animate={isMenuOpen ? "open" : "closed"}
          >
            {menuLinks.map((link, index) => (
              <motion.div
                key={index}
                className="menu-link-item"
                onClick={toggleMenu}
              >
                <Link
                  href={link.path}
                  className="text-black font-bold font-sans text-4xl lg:text-6xl"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Menu;
