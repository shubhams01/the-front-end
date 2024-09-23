// components/Card.tsx
import { motion } from 'framer-motion';

interface CardProps {
  id: number;
  imageUrl: string;
  category: string;
  title: string;
}

const Card: React.FC<CardProps> = ({ id, imageUrl, category, title }) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border-2 shadow-lg h-screen w-90vw lg:w-80 m-4 cursor-pointer"
      style={{ height: '85vh' }}
    >
      <motion.span className="text-white text-bold absolute top-0 right-0 m-2 z-10 rounded-full bg-slate-900 px-2 py-1">
        {category}
      </motion.span>
      <motion.img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover opacity-100"
        animate={{ x: [0.8, 1] }}
        draggable={false}
      />
      <motion.div className="absolute bottom-0 left-0 right-0 p-4">
        <motion.h2
          className="text-white font-black text-3xl lg:text-3xl m-6 text-left text-shadow shadow-slate-500"
          initial={{ y: 0 }}
          transition={{ type: 'tween', duration: 1.5 }}
        >
          {title}
        </motion.h2>
      </motion.div>
    </motion.div>
  );
};

export default Card;
