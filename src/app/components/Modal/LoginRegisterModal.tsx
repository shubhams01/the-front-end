// components/Modal/Modal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "@/app/context/ModalContext";
import Login from "../User/Login";
import Register from "../User/Register";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface LoginRegisterModalProps {
  showCloseButton?: boolean;
}

const LoginRegisterModal: React.FC<LoginRegisterModalProps> = ({
  showCloseButton = true,
}) => {
  const { isLoginOpen, isRegisterOpen, toggleLoginModal, toggleRegisterModal } =
    useModal();

  return (
    <AnimatePresence>
      {(isLoginOpen || isRegisterOpen) && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-transparent rounded-lg p-8 shadow-lg relative"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: -50 }}
          >
            {showCloseButton && (
              <button
                className="text-gray-900 absolute top-10 right-10"
                onClick={() => {
                  if (isLoginOpen) toggleLoginModal();
                  if (isRegisterOpen) toggleRegisterModal();
                }}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
            {isLoginOpen && <Login />}
            {isRegisterOpen && <Register />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginRegisterModal;
