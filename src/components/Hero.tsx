import { useState, useEffect } from "react";
import { motion, Variants, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { ArrowDownLine, ArrowRightUpLine } from "./Icons";
import Menu from "./Menu";
import MagneticButton from "./MagneticButton";
import TextReveal from "./TextReveal";
import MarqueeText from "./MarqueeText";

interface HeroProps {
  isLoaded: boolean;
}

const Hero = ({ isLoaded }: HeroProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(springY, [0, window.innerHeight], [5, -5]);
  const rotateY = useTransform(springX, [0, window.innerWidth], [-5, 5]);

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150]);
  const parallaxOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const parallaxScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const slideUpVariants: Variants = {
    hidden: { y: "100%", opacity: 0, rotateX: -15 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: -20, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const floatingVariants: Variants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <section 
        id="home" 
        className="min-h-screen bg-background relative flex flex-col overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Parallax background layers */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{
            y: parallaxY,
            scale: parallaxScale,
            opacity: parallaxOpacity,
          }}
        >
          {/* Animated background gradient */}
          <motion.div 
            className="absolute inset-0 opacity-30"
            style={{
              background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.15) 0%, transparent 50%)",
            }}
            animate={{
              "--mouse-x": `${springX.get()}px`,
              "--mouse-y": `${springY.get()}px`,
            } as any}
          />

          {/* Floating parallax circles */}
          <motion.div
            className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
            style={{ y: useTransform(scrollY, [0, 500], [0, 100]) }}
          />
          <motion.div
            className="absolute top-40 right-[15%] w-96 h-96 rounded-full bg-accent/5 blur-3xl"
            style={{ y: useTransform(scrollY, [0, 500], [0, 80]) }}
          />
          <motion.div
            className="absolute bottom-20 left-[30%] w-48 h-48 rounded-full bg-muted-foreground/5 blur-2xl"
            style={{ y: useTransform(scrollY, [0, 500], [0, 120]) }}
          />
        </motion.div>

        {/* Grid overlay with parallax */}
        <motion.div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            y: useTransform(scrollY, [0, 500], [0, 50]),
          }}
        />

        {/* Navigation */}
        <motion.nav
          className={`w-full px-6 md:px-10 py-6 flex items-center justify-between ${isMenuOpen ? 'fixed top-0 left-0 right-0 z-[100]' : 'relative'}`}
          variants={fadeInVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <MagneticButton 
            href="#" 
            className={`no-underline text-lg font-semibold ${isMenuOpen ? 'text-primary-foreground' : 'text-foreground'}`}
          >
            Deepanshu
          </MagneticButton>
          <motion.button
            className={`flex items-center gap-3 group ${isMenuOpen ? 'text-primary-foreground' : 'text-foreground'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-sm font-semibold uppercase tracking-wider">
              {isMenuOpen ? "Close" : "Menu"}
            </span>
            
            {/* Hamburger to X Animation */}
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <motion.span
                className={`block h-0.5 origin-left ${isMenuOpen ? 'bg-primary-foreground' : 'bg-foreground'}`}
                animate={{
                  rotate: isMenuOpen ? 45 : 0,
                  width: "100%",
                }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              />
              <motion.span
                className={`block h-0.5 ${isMenuOpen ? 'bg-primary-foreground' : 'bg-foreground'}`}
                animate={{
                  opacity: isMenuOpen ? 0 : 1,
                  scaleX: isMenuOpen ? 0 : 1,
                }}
                transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
              />
              <motion.span
                className={`block h-0.5 origin-left ${isMenuOpen ? 'bg-primary-foreground' : 'bg-foreground'}`}
                animate={{
                  rotate: isMenuOpen ? -45 : 0,
                  width: isMenuOpen ? "100%" : "75%",
                }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                style={{ alignSelf: "flex-end" }}
              />
            </div>
          </motion.button>
        </motion.nav>

        {/* Main Heading with 3D effect */}
        <motion.div
          className="flex-1 flex flex-col justify-center px-6 md:px-10 mt-8 md:mt-16"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          style={{ 
            perspective: "1000px",
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="space-y-2">
            {/* Frontend */}
            <div className="overflow-hidden" style={{ perspective: "1000px" }}>
              <motion.h1
                className="heading-xl bg-foreground text-background rounded-md inline-block px-2"
                variants={slideUpVariants}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px hsl(var(--foreground) / 0.2)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                Frontend
              </motion.h1>
            </div>

            {/* Developer + Based in India */}
            <div className="flex flex-col items-start md:items-end md:w-fit md:pr-1">
              <div className="overflow-hidden" style={{ perspective: "1000px" }}>
                <motion.h1
                  className="heading-xl bg-primary text-primary-foreground rounded-md inline-block px-2 md:ml-24"
                  variants={slideUpVariants}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 40px hsl(var(--primary) / 0.4)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  Developer
                </motion.h1>
              </div>
              <div className="overflow-hidden mt-2">
                <motion.h5
                  className="text-sm md:text-base uppercase font-medium text-foreground"
                  variants={slideUpVariants}
                >
                  <TextReveal delay={1.2} animate={isLoaded}>
                    Based in India
                  </TextReveal>
                </motion.h5>
              </div>
            </div>
          </div>

          {/* Small Heading */}
          <motion.div
            className="mt-16 md:mt-24 flex flex-col items-end pr-4 md:pr-8 space-y-1"
            variants={containerVariants}
          >
            <div className="overflow-hidden">
              <motion.h5
                className="text-sm uppercase font-medium text-foreground"
                variants={slideUpVariants}
              >
                <TextReveal delay={1.4} animate={isLoaded}>
                  available for freelance
                </TextReveal>
              </motion.h5>
            </div>
            <div className="overflow-hidden">
              <motion.h5
                className="text-sm uppercase font-medium text-foreground"
                variants={slideUpVariants}
              >
                <TextReveal delay={1.6} animate={isLoaded}>
                  work from Anywhere
                </TextReveal>
              </motion.h5>
            </div>
          </motion.div>
        </motion.div>

        {/* Marquee section */}
        <motion.div
          className="py-8 border-y border-border/30 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <MarqueeText 
            text="FRONTEND DEVELOPER • UI/UX DESIGN • CREATIVE CODING • WEB ANIMATIONS" 
            className="text-2xl md:text-4xl font-bold text-muted-foreground/30"
            speed={25}
          />
        </motion.div>

        {/* Hero Footer */}
        <motion.div
          className="w-full px-6 md:px-10 py-6 flex flex-wrap items-center justify-between gap-4"
          variants={fadeInVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          transition={{ delay: 1.5 }}
        >
          <MagneticButton
            href="#"
            className="hover-underline text-foreground no-underline text-sm font-medium group inline-flex items-center gap-1"
          >
            Currently Working AT ..
            <span className="inline-block transition-transform duration-300 group-hover:rotate-[30deg]">
              <ArrowRightUpLine />
            </span>
          </MagneticButton>
          <MagneticButton
            href="#"
            className="hover-underline text-foreground no-underline text-sm font-medium group inline-flex items-center gap-1"
          >
            Resume
            <span className="inline-block transition-transform duration-300 group-hover:rotate-[30deg]">
              <ArrowRightUpLine />
            </span>
          </MagneticButton>
          <motion.div 
            className="hidden md:flex gap-1"
            variants={floatingVariants}
            animate="animate"
          >
            <div className="w-6 h-6 rounded-full bg-muted-foreground flex items-center justify-center text-background">
              <ArrowDownLine size={14} />
            </div>
            <div className="w-6 h-6 rounded-full bg-muted-foreground flex items-center justify-center text-background">
              <ArrowDownLine size={14} />
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
