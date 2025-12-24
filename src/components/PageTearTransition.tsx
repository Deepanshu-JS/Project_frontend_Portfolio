import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface PageTearTransitionProps {
  direction?: "up" | "down";
  className?: string;
}

const PageTearTransition = ({ direction = "down", className = "" }: PageTearTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Create staggered tear strips
  const strips = 8;
  
  return (
    <div 
      ref={ref}
      className={`relative h-32 md:h-48 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 10 }}
    >
      {/* Torn paper strips effect */}
      {Array.from({ length: strips }).map((_, index) => {
        const delay = index * 0.05;
        const yOffset = useTransform(
          scrollYProgress,
          [0, 0.5, 1],
          direction === "down" 
            ? [`${-20 + index * 5}%`, `${index * 3}%`, `${20 + index * 5}%`]
            : [`${20 + index * 5}%`, `${index * 3}%`, `${-20 + index * 5}%`]
        );
        
        const rotate = useTransform(
          scrollYProgress,
          [0, 0.5, 1],
          [index % 2 === 0 ? -2 : 2, 0, index % 2 === 0 ? 2 : -2]
        );
        
        const scaleX = useTransform(
          scrollYProgress,
          [0, 0.5, 1],
          [1.1 + index * 0.02, 1, 1.1 + index * 0.02]
        );

        return (
          <motion.div
            key={index}
            className="absolute inset-x-0"
            style={{
              y: yOffset,
              rotate,
              scaleX,
              top: `${(index / strips) * 100}%`,
              height: `${120 / strips}%`,
              transformOrigin: index % 2 === 0 ? "left center" : "right center",
            }}
          >
            <div 
              className="w-full h-full bg-background"
              style={{
                clipPath: generateTornEdge(index, direction),
                boxShadow: direction === "down" 
                  ? "0 -4px 20px hsl(var(--foreground) / 0.1)"
                  : "0 4px 20px hsl(var(--foreground) / 0.1)",
              }}
            />
          </motion.div>
        );
      })}
      
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

// Generate irregular torn edge clip path
const generateTornEdge = (index: number, direction: "up" | "down"): string => {
  const points: string[] = [];
  const segments = 20;
  const seed = index * 13.7;
  
  // Start from left
  points.push("0% 0%");
  
  // Generate jagged top edge
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * 100;
    const variance = Math.sin(seed + i * 0.7) * 15 + Math.cos(seed * 2 + i * 1.3) * 10;
    const y = direction === "down" ? Math.max(0, variance) : 100 - Math.max(0, variance);
    points.push(`${x}% ${y}%`);
  }
  
  // Complete the polygon
  points.push("100% 100%");
  points.push("0% 100%");
  
  return `polygon(${points.join(", ")})`;
};

export default PageTearTransition;
