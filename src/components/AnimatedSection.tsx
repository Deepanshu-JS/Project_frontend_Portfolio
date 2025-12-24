import { motion, useInView, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";

type AnimationType = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "blur" | "slideReveal";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const AnimatedSection = ({
  children,
  animation = "fadeUp",
  delay = 0,
  duration = 0.8,
  className = "",
  once = true,
}: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  const animations: Record<AnimationType, Variants> = {
    fadeUp: {
      hidden: { opacity: 0, y: 60 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.4, 0.25, 1],
        }
      },
    },
    fadeDown: {
      hidden: { opacity: 0, y: -60 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.4, 0.25, 1],
        }
      },
    },
    fadeLeft: {
      hidden: { opacity: 0, x: 80 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.4, 0.25, 1],
        }
      },
    },
    fadeRight: {
      hidden: { opacity: 0, x: -80 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.4, 0.25, 1],
        }
      },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.85 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.4, 0.25, 1],
        }
      },
    },
    blur: {
      hidden: { opacity: 0, filter: "blur(20px)", y: 30 },
      visible: { 
        opacity: 1, 
        filter: "blur(0px)",
        y: 0,
        transition: {
          duration: duration * 1.2,
          delay,
          ease: [0.25, 0.4, 0.25, 1],
        }
      },
    },
    slideReveal: {
      hidden: { 
        opacity: 0, 
        y: 100,
        rotateX: 15,
      },
      visible: { 
        opacity: 1, 
        y: 0,
        rotateX: 0,
        transition: {
          duration: duration * 1.1,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animations[animation]}
      style={{ perspective: animation === "slideReveal" ? "1000px" : undefined }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
