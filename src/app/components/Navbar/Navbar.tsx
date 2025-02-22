"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "@/app/context/ModalContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isLoginOpen, toggleLoginModal, isRegisterOpen, toggleRegisterModal } =
    useModal();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getLinkClass = (path: string) => {
    return pathname === path
      ? "text-4xl lg:text-6xl font-bold uppercase text-violet-600"
      : "text-4xl lg:text-6xl font-bold uppercase";
  };

  const goBack = () => {
    router.back();
    if (isLoginOpen) {
      toggleLoginModal();
    }
    if (isRegisterOpen) {
      toggleRegisterModal();
    }
  };

  return (
    <div className="relative">
      <Link href="/">
        <img
          src="/logo-white.svg"
          alt="Logo"
          className="h-10 mt-5 ml-5 fixed z-50"
          onClick={() => setIsOpen(false)}
        />
      </Link>

      {/* Back button */}
      {pathname !== "/" && (
        <button
          onClick={goBack}
          className="fixed top-2 right-10 lg:right-12 m-5 z-40 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faChevronCircleLeft} size="lg" color="" />
        </button>
      )}

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
                      href="/profile"
                      className={getLinkClass("/profile")}
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

            <div className="absolute bottom-4 right-4 text-white text-sm space-y-2 flex flex-col items-end">
              <Link
                href="/privacy-policy"
                className="hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Terms of Service
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu toggle button */}
      <button
      onClick={toggleMenu}
      className="fixed top-2 right-0 m-4 z-40 flex items-center justify-center focus:outline-none"
    >
      <motion.div
        animate={isOpen ? "open" : "closed"}
        className="relative flex flex-col justify-between w-6 h-6"
      >
        <motion.div
          variants={{
            closed: { x: 8, y: -3, rotate: 0 },
            open: { x: 0, y: 6, rotate: 45 },
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-7 h-1.5 bg-white rounded-md"
        />
        
        <motion.div
          variants={{
            closed: { x: 0, y: 0, opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="w-7 h-1.5 bg-white rounded-md"
        />
        
        <motion.div
          variants={{
            closed: { x: -8, y: 3, rotate: 0 },
            open: { x: 0, y: -12, rotate: -45 },
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-7 h-1.5 bg-white rounded-md"
        />
      </motion.div>
    </button>
    </div>
  );
};

export default Navbar;
