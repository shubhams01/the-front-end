import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

const FullPageScroll = ({ sections }: { sections: JSX.Element[] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { scrollY } = useScroll();

  const handleScroll = (event) => {
    const newPage = Math.floor(scrollY.current / window.innerHeight);
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  return (
    <motion.div className="full-page-scroll h-screen bg-slate-400 relative">
      {sections.map((section, index) => (
        <motion.section
          key={index}
          className={`page h-screen flex justify-center items-center text-xl ${
            index === currentPage ? 'active' : ''
          }`}
        >
          {section}
        </motion.section>
      ))}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        {sections.map((_, index) => (
          <motion.div
            key={index}
            className={`indicator w-2 h-2 rounded-full bg-white opacity-50 ${
              index === currentPage ? 'bg-blue-500 opacity-100' : ''
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FullPageScroll;
