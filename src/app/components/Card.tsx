import { motion, useAnimation, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface CardProps {
  id: number;
  imageUrl: string;
  category: string;
  title: string;
}

const Card = ({ id, imageUrl, category, title }) => {
  const imageRef = useRef(null);
  const titleRef = useRef(null);

  const isInView = useInView(titleRef, { once: false });
  const imageIsInView = useInView(imageRef, { once: false });

  const cardControls = useAnimation();
  const titleControls = useAnimation();
  const imageControls = useAnimation();

  useEffect(() => {
    if (isInView || imageIsInView) {
      titleControls.start({ y: 0 });
      console.log("scroll ", isInView, imageIsInView);
    }
  }, [isInView]);

  return (
    <motion.div className="relative overflow-hidden rounded-2xl border-2 shadow-lg lg:w-80 w-auto m-4 cursor-pointer">
      <ChevronLeftIcon className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white" />
      <motion.span className="text-white text-bold absolute top-0 right-0 m-2 z-10 rounded-full bg-slate-900 px-2 py-1">
        {category}
      </motion.span>
      <motion.img
        ref={imageRef}
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover opacity-100"
        animate={{ x: [0.8, 1] }}
        transition={{ duration: 1.5 }}
      />
      <motion.div
        ref={titleRef}
        className="absolute bottom-0 left-0 right-0 p-4"
      >
        <motion.h2
          className="text-white font-black text-2xl lg:text-3xl m-4 overflow-hidden"
          initial={{ y: 30 }}
          animate={titleControls}
          transition={{ type: "tween", duration: 1.5 }}
        >
          {title}
        </motion.h2>
      </motion.div>
      <ChevronRightIcon className="absolute right-0 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white" />
    </motion.div>
  );
};

export default Card;