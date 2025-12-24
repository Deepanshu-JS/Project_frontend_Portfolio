import { motion } from "framer-motion";

interface MarqueeTextProps {
  text: string;
  className?: string;
  speed?: number;
  direction?: "left" | "right";
}

const MarqueeText = ({ 
  text, 
  className = "", 
  speed = 20,
  direction = "left" 
}: MarqueeTextProps) => {
  const repeatedText = Array(4).fill(text).join(" • ");
  
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className={`inline-flex ${className}`}
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        <span className="flex-shrink-0 mr-8">{repeatedText}</span>
        <span className="flex-shrink-0 mr-8">{repeatedText}</span>
      </motion.div>
    </div>
  );
};

export default MarqueeText;
