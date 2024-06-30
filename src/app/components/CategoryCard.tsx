'use client'
import React, { useState } from "react";

const CategoryCard = ({ category, imageUrl }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked); // Toggle isClicked state
  };

  return (
    <div className="rounded-xl relative overflow-hidden group" onClick={handleClick}>
      <div className="w-100 h-96 rounded-lg overflow-hidden relative">
        <img
          src={imageUrl}
          alt={category}
          className={`w-full h-full object-cover transition-transform duration-500 transform ${isClicked ? '-translate-x-1/2 scale-x-0' : 'translate-x-0 scale-x-100'}`}
        />
      </div>
      <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity">
        <span className="text-white text-center text-4xl font-black uppercase border-4 border-white px-4 py-2">
          {category}
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;
