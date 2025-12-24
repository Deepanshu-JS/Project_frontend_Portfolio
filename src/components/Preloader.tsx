import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [phase, setPhase] = useState<"enter" | "exit" | "done">("enter");

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setPhase("exit");
    }, 2500);

    const exitTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "hsl(0 0% 63%)" }}
          initial={{ height: "100vh" }}
          exit={{ height: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <div className="overflow-hidden">
            <motion.h1
              className="text-foreground text-4xl md:text-6xl font-bold uppercase tracking-wider"
              initial={{ y: 70, skewY: 10, opacity: 0 }}
              animate={
                phase === "enter"
                  ? { y: 0, skewY: 0, opacity: 1 }
                  : { y: 70, skewY: -20, opacity: 0 }
              }
              transition={{
                duration: phase === "enter" ? 2 : 1.5,
                ease: [0.16, 1, 0.3, 1],
                delay: phase === "enter" ? 0.5 : 0,
              }}
            >
              Based in India
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
