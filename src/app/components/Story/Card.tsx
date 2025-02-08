// components/Card.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Blurhash } from "react-blurhash";

interface CardProps {
  id: number;
  imageUrl: string;
  blurhash: string;
  category: string;
  title: string;
}

const Card: React.FC<CardProps> = ({ id, imageUrl, blurhash, category, title }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border-2 shadow-lg w-90vw lg:w-80 m-4 cursor-pointer"
      style={{ height: "80vh" }}
    >
      <motion.span className="text-white text-bold absolute top-0 right-0 m-2 z-10 rounded-full bg-slate-900 px-2 py-1">
        {category}
      </motion.span>
      {!imageLoaded && (
        <Blurhash
          hash={blurhash || "LEHV6nWB2yk8pyo0adR*.7kCMdnj"}
          width={"100%"}
          height={"100%"}
          resolutionX={32}
          resolutionY={32}
          punch={1}
          className="absolute inset-0 w-full h-full"
        />
      )}
      <motion.img
        src={imageUrl}
        alt={title}
        className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        animate={{ x: [0.8, 1] }}
        draggable={false}
        onLoad={() => setImageLoaded(true)}
      />
      <motion.div className="absolute bottom-0 left-0 right-0 p-4">
        <motion.h2
          className="text-white font-black text-3xl lg:text-3xl m-6 text-left text-shadow shadow-slate-500"
          initial={{ y: 0 }}
          transition={{ type: "tween", duration: 1.5 }}
        >
          {title}
        </motion.h2>
      </motion.div>
    </motion.div>
  );
};

export default Card;
