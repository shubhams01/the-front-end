"use client";
import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import LoginRegisterModal from "../Modal/LoginRegisterModal";
import { useRouter, useSearchParams } from "next/navigation";
import { useModal } from "@/app/context/ModalContext";

const ConfirmationPage = () => {
  const { toggleLoginModal, toggleRegisterModal } = useModal();
  const [confirmationCompleted, setConfirmationCompleted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const searchParams = useSearchParams();

  const confirmationCode = searchParams.get("code");

  useEffect(() => {
    console.log("confirmationCode ", confirmationCode);
    const confirmEmail = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/email-confirmation?confirmation=${confirmationCode}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors", // Set the request's mode to 'no-cors'
        }
      );
      if (response.ok) {
        setConfirmationCompleted(true);
        setTimeout(() => {
          toggleLoginModal();
        }, 1000);
      }
    };

    confirmEmail();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <motion.div
        className="p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          Email Confirmation
        </h2>

        {confirmationCompleted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-green-600"
          >
            <p>Your email has been successfully confirmed!</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-blue-600"
          >
            <p>Confirming your email...</p>
          </motion.div>
        )}
      </motion.div>

      {showLoginModal && <LoginRegisterModal />}
    </div>
  );
};

export default ConfirmationPage;
