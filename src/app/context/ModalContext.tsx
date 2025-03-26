// src/context/ModalContext.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ModalContextProps {
  isLoginOpen: boolean;
  setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleLoginModal: () => void;
  isRegisterOpen: boolean;
  setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleRegisterModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const toggleLoginModal = () => setIsLoginOpen((prev) => !prev);
  const toggleRegisterModal = () => setIsRegisterOpen((prev) => !prev);

  useEffect(() => {
    // console.log('modalContext ', isLoginOpen);
  });

  useEffect(() => {
    if (isLoginOpen || isRegisterOpen) {
      document.body.style.overflow = 'hidden'; // Lock scrolling
    } else {
      document.body.style.overflow = 'unset'; // Restore scrolling
    }
  }, [isLoginOpen, isRegisterOpen]);

  return (
    <ModalContext.Provider
      value={{ isLoginOpen, setIsLoginOpen, toggleLoginModal, isRegisterOpen, setIsRegisterOpen, toggleRegisterModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
