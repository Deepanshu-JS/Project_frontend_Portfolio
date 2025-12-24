import { motion, Variants, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState } from "react";
import SmoothReveal from "./SmoothReveal";
import MagneticButton from "./MagneticButton";

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      rotate: -10,
      filter: "blur(20px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Split text for character animation
  const text = "I'm a frontend developer with a passion for creating products that not only look good but also solve real problems. When I'm not sketching ideas on paper, you can find me binge-watching a Netflix series or playing video games. My developer philosophy is simple: make it visually appealing, functional, and bring a smile to people's faces.";
  const words = text.split(" ");

  return (
    <section id="about" ref={sectionRef} className="bg-background py-24 md:py-32 overflow-hidden relative">
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-20 right-10 w-32 h-32 rounded-full border border-primary/10"
        style={{ scale, rotate }}
      />
      <motion.div 
        className="absolute bottom-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <motion.div
        className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 px-6 md:px-10 md:pl-[40vw]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Profile Image with Parallax */}
        <motion.div 
          variants={imageVariants} 
          className="shrink-0 relative group"
          style={{ y }}
        >
          {/* Animated border */}
          <motion.div 
            className="absolute -inset-4 border border-primary/20 rounded-sm"
            animate={{ 
              rotate: [0, 2, 0, -2, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          
          {/* Glow effect */}
          <motion.div 
            className="absolute -inset-2 bg-primary/20 rounded-sm blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          
          <motion.img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
            alt="Deepanshu"
            className="w-40 md:w-52 rounded-sm relative z-10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </motion.div>

        {/* Text Content */}
        <div className="max-w-md">
          <SmoothReveal delay={0.2}>
            <h5 className="text-sm uppercase text-muted-foreground mb-3">
              (About Me)
            </h5>
          </SmoothReveal>
          
          {/* Animated text reveal */}
          <p ref={textRef} className="text-foreground leading-relaxed mb-8">
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.3em]"
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={isInView ? { 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px)" 
                } : {}}
                transition={{
                  duration: 0.5,
                  delay: i * 0.03,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </p>
          
          <motion.div variants={buttonVariants}>
            <MagneticButton
              href="mailto:singhdepanshu786@gmail.com"
              className="inline-block px-6 py-3 border border-foreground rounded-full text-foreground text-sm uppercase font-medium relative overflow-hidden group"
            >
              <motion.span 
                className="absolute inset-0 bg-foreground"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: "left" }}
              />
              <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                Let's talk
              </span>
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
