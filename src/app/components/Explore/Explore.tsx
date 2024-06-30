"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../Card";
import cardsData from "../../../app/CardData.json";

const Explore = () => {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(null);

  const handleClick = (card) => {
    setSelectedCard(card);
    setTimeout(() => {
      router.push(`/${card.category}/${card.id}`);
    }, 500);
  };

  return (
    <>
      <div className="explore-container flex flex-col items-center justify-center min-h-screen snap-y snap-mandatory overflow-y-scroll overflow-x-hidden">
        <span className="text-4xl font-bold mt-10">Explore</span>
        <div className="card-wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cardsData.map((card, index) => (
            <motion.div
              key={index}
              className="snap-center cursor-pointer"
              onClick={() => handleClick(card)}
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              layoutId={`card-${card.id}`}
            >
              <Card
                key={index}
                id={card.id}
                imageUrl={card.imageUrl}
                title={card.title}
                category={card.category}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 0.95 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <img
              src={selectedCard.imageUrl}
              alt={selectedCard.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Explore;
