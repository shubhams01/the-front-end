'use client'

import { useState, useEffect } from 'react';

const CoverScreen = ({onClose}) => {

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsOpen(false);
      onClose();
    }, 2000); 

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black z-50">
      <div className={`absolute top-0 left-0 w-1/2 h-full bg-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-1000 ease-in-out`}></div>
      <div className={`absolute top-0 right-0 w-1/2 h-full bg-white transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-1000 ease-in-out`}></div>
    </div>
  );
};

export default CoverScreen;
