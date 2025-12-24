import { motion, Variants } from "framer-motion";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  animate?: boolean;
}

const TextReveal = ({ 
  children, 
  className = "", 
  delay = 0, 
  staggerChildren = 0.03,
  animate = true 
}: TextRevealProps) => {
  const words = children.split(" ");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      y: "100%",
      rotateX: -90,
      opacity: 0,
    },
    visible: {
      y: 0,
      rotateX: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
      style={{ perspective: "1000px" }}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden mr-[0.25em]" style={{ perspective: "1000px" }}>
          <motion.span
            className="inline-block origin-bottom"
            variants={wordVariants}
            style={{ transformStyle: "preserve-3d" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default TextReveal;
