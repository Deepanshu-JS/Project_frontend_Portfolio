import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useSpring(0, { stiffness: 300, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 300, damping: 30 });
  const scaleX = useSpring(1, { stiffness: 400, damping: 25 });
  const scaleY = useSpring(1, { stiffness: 400, damping: 25 });

  useEffect(() => {
    let prevX = 0;
    let prevY = 0;
    let timeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;
      
      // Calculate velocity-based scale
      const velocityX = Math.min(Math.max(Math.abs(deltaX) * 0.05, 0.8), 1.4);
      const velocityY = Math.min(Math.max(Math.abs(deltaY) * 0.05, 0.8), 1.4);
      
      cursorX.set(e.clientX - 5);
      cursorY.set(e.clientY - 5);
      scaleX.set(velocityX);
      scaleY.set(velocityY);
      
      prevX = e.clientX;
      prevY = e.clientY;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        scaleX.set(1);
        scaleY.set(1);
      }, 100);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      clearTimeout(timeout);
    };
  }, [cursorX, cursorY, scaleX, scaleY]);

  // Hide on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 w-[10px] h-[10px] bg-foreground rounded-full pointer-events-none z-[99999] mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        scaleX,
        scaleY,
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
};

export default CustomCursor;
