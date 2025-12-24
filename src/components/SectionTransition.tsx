import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

interface SectionTransitionProps {
  variant?: "tear" | "fold" | "peel" | "shatter";
  className?: string;
}

const SectionTransition = ({ variant = "tear", className = "" }: SectionTransitionProps) => {
  if (variant === "fold") {
    return <FoldTransition className={className} />;
  }
  
  if (variant === "peel") {
    return <PeelTransition className={className} />;
  }
  
  if (variant === "shatter") {
    return <ShatterTransition className={className} />;
  }

  return <TearTransition className={className} />;
};

// Fold effect - like folding paper
const FoldTransition = ({ className }: { className: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [45, 0, -45]);
  const scaleY = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);
  const foldLineOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);

  return (
    <div ref={ref} className={`relative h-24 md:h-32 overflow-hidden ${className}`} style={{ perspective: "1000px" }}>
      <motion.div
        className="absolute inset-0 bg-background origin-top"
        style={{
          rotateX,
          scaleY,
          opacity,
          boxShadow: "0 10px 40px hsl(var(--foreground) / 0.15)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/5 to-transparent" />
      </motion.div>
      
      {/* Fold line */}
      <motion.div
        className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
        style={{ opacity: foldLineOpacity }}
      />
    </div>
  );
};

// Peel effect - like peeling a sticker
const PeelTransition = ({ className }: { className: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const peelProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 100]);
  const rotateY = useTransform(peelProgress, [0, 100], [0, 30]);
  const rotateX = useTransform(peelProgress, [0, 100], [0, -15]);
  const translateX = useTransform(peelProgress, [0, 100], ["0%", "5%"]);
  const curlOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const revealOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 0.5]);
  
  return (
    <div ref={ref} className={`relative h-24 md:h-40 overflow-hidden ${className}`} style={{ perspective: "1200px" }}>
      <motion.div
        className="absolute inset-0 bg-background origin-bottom-left"
        style={{
          rotateY,
          rotateX,
          x: translateX,
          boxShadow: "0 20px 40px hsl(var(--foreground) / 0.2)",
        }}
      >
        {/* Curl highlight */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-foreground/10 to-transparent"
          style={{ opacity: curlOpacity }}
        />
      </motion.div>
      
      {/* Revealed layer underneath */}
      <motion.div
        className="absolute inset-0 bg-muted/50"
        style={{ opacity: revealOpacity }}
      />
    </div>
  );
};

// Shatter effect - like breaking glass
const ShatterTransition = ({ className }: { className: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const shards = 12;
  const crackOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0, 1, 0]);
  
  return (
    <div ref={ref} className={`relative h-32 md:h-48 overflow-hidden ${className}`}>
      {Array.from({ length: shards }).map((_, i) => (
        <ShatterShard key={i} index={i} scrollYProgress={scrollYProgress} />
      ))}
      
      {/* Crack lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.1 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <CrackLine key={i} index={i} scrollYProgress={scrollYProgress} />
        ))}
      </svg>
    </div>
  );
};

const ShatterShard = ({ index, scrollYProgress }: { index: number; scrollYProgress: MotionValue<number> }) => {
  const angle = (index / 12) * 360;
  const distance = 50 + (index * 7) % 50;
  
  const x = useTransform(
    scrollYProgress,
    [0.3, 0.7],
    [0, Math.cos(angle * Math.PI / 180) * distance]
  );
  const y = useTransform(
    scrollYProgress,
    [0.3, 0.7],
    [0, Math.sin(angle * Math.PI / 180) * distance]
  );
  const rotate = useTransform(scrollYProgress, [0.3, 0.7], [0, ((index % 3) - 1) * 30]);
  const scale = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [1, 1.1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [1, 1, 0]);
  
  const basePoints = [
    "polygon(10% 0%, 90% 5%, 95% 85%, 5% 90%)",
    "polygon(5% 10%, 85% 0%, 90% 90%, 15% 95%)",
    "polygon(0% 5%, 95% 10%, 85% 95%, 10% 85%)",
    "polygon(15% 0%, 80% 15%, 95% 80%, 0% 95%)",
  ];
  
  return (
    <motion.div
      className="absolute bg-background"
      style={{
        left: `${(index % 4) * 25}%`,
        top: `${Math.floor(index / 4) * 33}%`,
        width: "30%",
        height: "40%",
        x,
        y,
        rotate,
        scale,
        opacity,
        clipPath: basePoints[index % basePoints.length],
        boxShadow: "0 4px 20px hsl(var(--foreground) / 0.1)",
      }}
    />
  );
};

const CrackLine = ({ index, scrollYProgress }: { index: number; scrollYProgress: MotionValue<number> }) => {
  const opacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0, 1, 0]);
  const pathLength = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  
  return (
    <motion.line
      x1="50%"
      y1="50%"
      x2={`${50 + Math.cos((index / 8) * Math.PI * 2) * 60}%`}
      y2={`${50 + Math.sin((index / 8) * Math.PI * 2) * 60}%`}
      stroke="currentColor"
      strokeWidth="1"
      className="text-foreground"
      style={{ opacity, pathLength }}
    />
  );
};

// Tear transition with jagged edges
const TearTransition = ({ className }: { className: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const strips = 6;
  
  return (
    <div ref={ref} className={`relative h-28 md:h-36 overflow-hidden ${className}`}>
      {Array.from({ length: strips }).map((_, index) => (
        <TearStrip key={index} index={index} strips={strips} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
};

const TearStrip = ({ index, strips, scrollYProgress }: { index: number; strips: number; scrollYProgress: MotionValue<number> }) => {
  const yOffset = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [`${-30 + index * 8}%`, `${index * 5}%`, `${30 + index * 8}%`]
  );
  
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [index % 2 === 0 ? -3 : 3, 0, index % 2 === 0 ? 3 : -3]
  );

  const generateTearPath = (idx: number): string => {
    const points: string[] = [];
    const segments = 15;
    const seed = idx * 17.3;
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * 100;
      const variance = Math.sin(seed + i * 0.9) * 20 + Math.cos(seed * 1.5 + i * 1.7) * 12;
      const y = Math.max(5, 15 + variance);
      points.push(`${x}% ${y}%`);
    }
    
    points.push("100% 100%", "0% 100%");
    
    return `polygon(${points.join(", ")})`;
  };

  return (
    <motion.div
      className="absolute inset-x-0 bg-background"
      style={{
        y: yOffset,
        rotate,
        top: `${(index / strips) * 100}%`,
        height: `${130 / strips}%`,
        clipPath: generateTearPath(index),
        boxShadow: "0 2px 15px hsl(var(--foreground) / 0.08)",
        transformOrigin: index % 2 === 0 ? "left" : "right",
      }}
    />
  );
};

export default SectionTransition;
