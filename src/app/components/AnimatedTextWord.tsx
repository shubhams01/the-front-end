import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string; // The text to animate
  typingSpeed?: number; // Optional typing speed (ms)
  delay?: number; // Optional initial delay (ms)
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, typingSpeed = 150, delay = 0 }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const typeSentence = async () => {
      setIsTyping(true);
      for (let i = 0; i < text.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, typingSpeed));
        setTypedText((prev) => prev + text[i]);
      }
      setIsTyping(false);
    };

    if (text) {
      typeSentence();
    }
  }, [text, typingSpeed]);

  return (
    <motion.div
      className="text-lg text-bold text-white m-2 overflow-hidden" // Tailwind CSS for styling
      initial={{ opacity: 0 }}
      animate={{ opacity: isTyping ? 1 : 0 }} // Control text visibility based on typing state
      transition={{ duration: 1 }}
    >
      {typedText.split("").map((char, index) => (
        <motion.span key={index} style={{ display: "inline-block" }}>
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;
