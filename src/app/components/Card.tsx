import { motion, useAnimation, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface CardProps {
  id: number;
  imageUrl: string;
  category: string;
  title: string;
}

const Card: React.FC<CardProps> = ({ id, imageUrl, category, title }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const imageRef = useRef(null);
  const titleRef = useRef(null);

  const isInView = useInView(titleRef, { once: false });
  const imageIsInView = useInView(imageRef, { once: false });

  const cardControls = useAnimation();
  const titleControls = useAnimation();
  const imageControls = useAnimation();

  const handleClick = () => {
    titleControls.start({
      scale: 0.85,
      y: -50,
      x: 20,
    });
    // cardControls.start({
    //   scaleX: 1.45,
    //   scaleY: 1.45,
    //   // height:'100vh',
    //   // width: '80vw',
    //   zIndex: 200,
    // });
   
  };

  useEffect(() => {
    if (isInView || imageIsInView) {
      titleControls.start({ y: 0 });
      // imageControls.start({
      //   opacity: 1,
      //   scale: 1.2,
      //   duration: 0.25,
      // });
      console.log("scroll ", isInView, imageIsInView);
    }
  }, [isInView]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border-2 shadow-lg h-100 lg:w-80 w-auto m-4 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      // whileTap={{ scale: 1.5, zIndex: 100 }}
      // onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={cardControls}
      transition={{ duration: 1.5 }}
    >
      <span className="text-white text-bold absolute top-0 right-0 m-2 z-10 rounded-full bg-gray-500 px-2 py-1">
        {category}
      </span>
      <motion.img
        ref={imageRef}
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover opacity-75"
        // initial={{ opacity: 0.5 }}
        animate={imageControls}
        transition={{ duration: 1.5 }}
        />
      <div ref={titleRef} className="absolute bottom-0 left-0 right-0 p-4">
        <motion.h2
          className="text-white font-black text-2xl lg:text-3xl m-4 overflow-hidden"
          initial={{ y: 30 }}
          animate={titleControls}
          // transition={{ type: "tween", duration: 4 }}
          transition={{ type: 'tween', duration: 1.5 }}
        >
          {title}
        </motion.h2>
      </div>
    </motion.div>
  );
};

export default Card;
