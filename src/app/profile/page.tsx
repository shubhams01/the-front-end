// src/app/profile/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import Profile from "../components/User/Profile";
import LoginRegisterModal from "../components/Modal/LoginRegisterModal";
import { useModal } from "../context/ModalContext";
import { getAuthToken } from "@/app/hooks/useLocalStorageAuth"; // Assuming this function gets the auth token from local storage

const Page = () => {
  const { isLoggedIn } = useAuthStore();
  const { isLoginOpen, isRegisterOpen, setIsLoginOpen, setIsRegisterOpen } = useModal();
  const [isClient, setIsClient] = useState(false);
  const overlayControls = useAnimation();
  const [userData, setUserData] = useState<any>(null); 
  
  useEffect(() => {
    setIsClient(true);

    if (!isLoggedIn) {
      setIsLoginOpen(true);
    }
  }, [isLoggedIn, setIsLoginOpen]);

  useEffect(() => {
    if(isLoginOpen) {
      setIsRegisterOpen(false);
    }
  },[isLoginOpen]);

  const API_URL = 'https://api.gyaanhub.io/api';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getAuthToken(); // Assuming getAuthToken retrieves the token from local storage
        if (!token) return; // Make sure token exists before making the request

        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          userData.profilePhoto = userData.profilePhoto
            ? `${API_URL}${userData.profilePhoto}`
            : "https://cdn1.iconfinder.com/data/icons/essential-21/128/User-512.png";
          setUserData(userData);
          console.log("user ", userData);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setTimeout(() => {
      overlayControls.start({ y: "-100%" });
    }, 500);
    overlayControls.start({ y: "0%" });
  }, [overlayControls]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-dvh relative">
      {isLoggedIn ? (
        <Profile user={userData} />
      ) : (
        <LoginRegisterModal showCloseButton={false} />
      )}
      <motion.div
        className="fixed top-0 left-0 w-full h-dvh bg-slate-900 z-50 flex items-center justify-center"
        initial={{ y: "0%" }}
        animate={overlayControls}
        transition={{ duration: 1 }}
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        >
          <img className="h-20 md:h-24 lg:h-28" src="/logo-white.svg" alt="Logo" />
        </motion.span>
      </motion.div>
    </div>
  );
};

export default Page;
