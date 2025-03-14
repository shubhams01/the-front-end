import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

const Counter = ({ value }: { value: number }) => {
  const count = useMotionValue(value); // Start from the current value

  // Format the number with a smoother transition
  const formattedValue = useTransform(count, (latest) => {
    return latest >= 1000
      ? (latest / 1000).toFixed(1).replace(".0", "") + "K"
      : Math.round(latest).toLocaleString();
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2.5, // Slightly longer duration for smoother effect
      ease: [0.16, 1, 0.3, 1], // Stronger ease-out effect for natural motion
    });

    return () => controls.stop();
  }, [value]);

  return (
    <motion.span className="font-medium">
        
      {formattedValue}
    </motion.span>
  );
};

export default Counter;
