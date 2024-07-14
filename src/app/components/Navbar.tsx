"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Initialize useRouter
  const pathname = usePathname();

  // console.log("pathname ", pathname);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getLinkClass = (path) => {
    return pathname === path
      ? "text-4xl lg:text-6xl font-bold uppercase text-yellow-500"
      : "text-4xl lg:text-6xl font-bold uppercase";
  };

  return (
    <div>
      <Link href="/">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-20 fixed z-50"
          onClick={() => setIsOpen(false)}
        />
      </Link>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="overlay fixed top-0 left-0 w-full h-full bg-slate-900 z-40"
          >
            {/* Fullscreen menu content */}
            <div className="fullscreen-menu flex flex-col items-center justify-center h-full text-white">
              <nav>
                <ul className="space-y-4 text-center">
                  <li>
                    <Link
                      href="/"
                      className={getLinkClass("/")}
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile/user"
                      className={getLinkClass("/profile/user")}
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories"
                      className={getLinkClass("/categories")}
                      onClick={() => setIsOpen(false)}
                    >
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className={getLinkClass("/about")}
                      onClick={() => setIsOpen(false)}
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu toggle button */}
      <button
        onClick={toggleMenu}
        className="h-10 fixed top-0 right-0 m-5 z-40 flex items-center justify-center focus:outline-none"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 lg:h-10 lg:w-10 text-white transform transition-transform rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 lg:h-10 lg:w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Navbar;
