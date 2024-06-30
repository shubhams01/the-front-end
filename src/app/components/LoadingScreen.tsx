import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="loading-screen fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white z-50"
      >
        <img src="/logo.png" alt="Logo" className="h-24" />
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;