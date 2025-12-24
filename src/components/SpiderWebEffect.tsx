import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WebLine {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  angle: number;
}

interface WebImpact {
  id: number;
  x: number;
  y: number;
}

const SpiderWebEffect = () => {
  const [webs, setWebs] = useState<WebLine[]>([]);
  const [impacts, setImpacts] = useState<WebImpact[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHolding, setIsHolding] = useState(false);
  const idRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const shootWeb = useCallback((e: MouseEvent) => {
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight;
    const endX = e.clientX;
    const endY = e.clientY;
    
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
    
    const newWeb: WebLine = {
      id: idRef.current++,
      startX,
      startY,
      endX,
      endY,
      angle,
    };

    const newImpact: WebImpact = {
      id: idRef.current++,
      x: endX,
      y: endY,
    };

    setWebs((prev) => [...prev, newWeb]);
    setImpacts((prev) => [...prev, newImpact]);

    // Remove web after animation
    setTimeout(() => {
      setWebs((prev) => prev.filter((w) => w.id !== newWeb.id));
    }, 800);

    setTimeout(() => {
      setImpacts((prev) => prev.filter((i) => i.id !== newImpact.id));
    }, 2000);
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 0) {
      setIsHolding(true);
      shootWeb(e);
    }
  }, [shootWeb]);

  const handleMouseUp = useCallback(() => {
    setIsHolding(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);

  // Continuous web shooting while holding
  useEffect(() => {
    if (!isHolding) return;

    const interval = setInterval(() => {
      const syntheticEvent = {
        clientX: mousePos.x + (Math.random() - 0.5) * 50,
        clientY: mousePos.y + (Math.random() - 0.5) * 50,
      } as MouseEvent;
      shootWeb(syntheticEvent);
    }, 150);

    return () => clearInterval(interval);
  }, [isHolding, mousePos, shootWeb]);

  const calculateWebPath = (web: WebLine) => {
    const dx = web.endX - web.startX;
    const dy = web.endY - web.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Create curved web path
    const midX = web.startX + dx * 0.5;
    const midY = web.startY + dy * 0.5 - distance * 0.1;
    
    return `M ${web.startX} ${web.startY} Q ${midX} ${midY} ${web.endX} ${web.endY}`;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="webGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          </linearGradient>
          <filter id="webGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <AnimatePresence>
          {webs.map((web) => (
            <motion.g key={web.id}>
              {/* Main web strand */}
              <motion.path
                d={calculateWebPath(web)}
                stroke="url(#webGradient)"
                strokeWidth="2"
                fill="none"
                filter="url(#webGlow)"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              />
              
              {/* Secondary strands */}
              {[...Array(3)].map((_, i) => {
                const offset = (i - 1) * 15;
                const midX = web.startX + (web.endX - web.startX) * 0.5;
                const midY = web.startY + (web.endY - web.startY) * 0.5;
                return (
                  <motion.path
                    key={i}
                    d={`M ${web.startX + offset} ${web.startY} Q ${midX + offset * 0.5} ${midY - 20} ${web.endX + offset * 0.3} ${web.endY}`}
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.5"
                    fill="none"
                    opacity="0.4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                  />
                );
              })}
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>

      {/* Web impact splats */}
      <AnimatePresence>
        {impacts.map((impact) => (
          <motion.div
            key={impact.id}
            className="absolute"
            style={{ left: impact.x, top: impact.y }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              width="60"
              height="60"
              viewBox="-30 -30 60 60"
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <defs>
                <radialGradient id={`impactGradient-${impact.id}`}>
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              {/* Web pattern at impact point */}
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * (Math.PI / 180);
                const length = 20 + Math.random() * 10;
                return (
                  <motion.line
                    key={i}
                    x1="0"
                    y1="0"
                    x2={Math.cos(angle) * length}
                    y2={Math.sin(angle) * length}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                  />
                );
              })}
              
              {/* Concentric web rings */}
              {[8, 15, 22].map((radius, i) => (
                <motion.circle
                  key={i}
                  cx="0"
                  cy="0"
                  r={radius}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="0.5"
                  strokeDasharray="3 5"
                  opacity={0.6 - i * 0.15}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.6 - i * 0.15 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                />
              ))}
              
              {/* Center dot */}
              <motion.circle
                cx="0"
                cy="0"
                r="3"
                fill="hsl(var(--primary))"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.1 }}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Hint text */}
      <motion.div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Click anywhere to shoot webs 🕷️
      </motion.div>
    </div>
  );
};

export default SpiderWebEffect;
