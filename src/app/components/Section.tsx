import React from "react";
import { motion } from "framer-motion";

interface SectionProps {
  id: number;
  title: string;
  description: string;
  imageUrl?: string; // Optional image URL
  isVertical?: boolean; // Optional flag for vertical scrolling
}

const Section: React.FC<SectionProps> = ({ id, title, description, imageUrl, isVertical = true }) => {
  const sectionStyle = {
    backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh", // Ensure full viewport height
    minWidth: isVertical ? "100vw" : "unset", // Adjust for horizontal scrolling
    padding: "4rem",
  };

  return (
    <motion.div key={id} style={sectionStyle}>
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg">{description}</p>
      </div>
    </motion.div>
  );
};

export default Section;
