import { motion } from "framer-motion";
import { useState } from "react";

interface GlitchTextProps {
  children: string;
  className?: string;
}

const GlitchText = ({ children, className = "" }: GlitchTextProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Glitch layers */}
      <motion.span
        className="absolute top-0 left-0 text-primary opacity-80"
        animate={isHovered ? {
          x: [0, -3, 3, -1, 0],
          opacity: [0.8, 0.6, 0.8, 0.7, 0.8],
        } : { x: 0 }}
        transition={{ duration: 0.3, repeat: isHovered ? Infinity : 0 }}
        aria-hidden
      >
        {children}
      </motion.span>
      
      <motion.span
        className="absolute top-0 left-0 text-accent opacity-80"
        style={{ clipPath: "inset(0 0 50% 0)" }}
        animate={isHovered ? {
          x: [0, 2, -2, 1, 0],
          opacity: [0.8, 0.7, 0.8, 0.6, 0.8],
        } : { x: 0 }}
        transition={{ duration: 0.25, repeat: isHovered ? Infinity : 0 }}
        aria-hidden
      >
        {children}
      </motion.span>
    </motion.span>
  );
};

export default GlitchText;
