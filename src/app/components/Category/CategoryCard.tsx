'use client';

import React, { useState } from 'react';
import { Blurhash } from 'react-blurhash';

const CategoryCard = ({ category, imageUrl, blurHash }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked); 
  };

  return (
    <div className="rounded-xl relative overflow-hidden group" onClick={handleClick}>
      <div className="w-100 h-96 rounded-lg overflow-hidden relative">
        {!isLoaded && blurHash && (
          <Blurhash
            hash={blurHash}
            width="100%"
            height="100%"
            className="absolute inset-0"
          />
        )}

        <img
          src={imageUrl}
          alt={category}
          className={`transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
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
