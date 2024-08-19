import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faClock } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const ContentSwitch = ({ onSwitch }) => {
  const [isTrending, setIsTrending] = useState(true);
  const [rotateTrending, setRotateTrending] = useState(false);
  const [rotateLatest, setRotateLatest] = useState(false);

  const handleTrendingClick = () => {
    if (!isTrending) {
      setIsTrending(true);
      onSwitch(true);
      setRotateTrending(true);
      setTimeout(() => setRotateTrending(false), 1000); // Reset rotation state after 1 second
    }
  };

  const handleLatestClick = () => {
    if (isTrending) {
      setIsTrending(false);
      onSwitch(false);
      setRotateLatest(true);
      setTimeout(() => setRotateLatest(false), 1000); // Reset rotation state after 1 second
    }
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="flex justify-center items-center rounded-full p-3 bg-white z-10">
        <motion.button
          className={`text-sm mx-1 px-2 py-1 font-bold rounded flex items-center gap-2 ${
            isTrending
              ? "bg-gray-500 text-white ring-offset-1 ring-2 ring-stone-950"
              : "bg-gray-200 text-stone-700"
          }`}
          onClick={handleTrendingClick}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={rotateTrending ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon icon={faFire} />
          </motion.div>
          TRENDING
        </motion.button>
        <motion.button
          className={`text-sm mx-1 px-2 py-1 font-bold rounded flex items-center gap-2 ${
            !isTrending
              ? "bg-gray-500 text-white ring-offset-1 ring-2 ring-stone-950"
              : "bg-gray-200 text-stone-700"
          }`}
          onClick={handleLatestClick}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={rotateLatest ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon icon={faClock} />
          </motion.div>
          LATEST
        </motion.button>
      </div>
    </div>
  );
};

export default ContentSwitch;
