import { useState, useRef } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import SmoothReveal from "./SmoothReveal";
import GlitchText from "./GlitchText";

interface Project {
  id: number;
  title: string;
  year: string;
  image: string;
  href: string;
  color: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "The Portfolio",
    year: "2023",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    href: "#",
    color: "348 99% 28%",
  },
  {
    id: 2,
    title: "Paper Portfolio",
    year: "2023",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    href: "#",
    color: "220 90% 50%",
  },
  {
    id: 3,
    title: "Internship",
    year: "2023",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    href: "#",
    color: "150 80% 40%",
  },
];

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="bg-background py-32 md:py-48 px-6 md:px-10 relative overflow-hidden"
    >
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{ 
          y: backgroundY,
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%)`,
        }}
      />

      <SmoothReveal>
        <div className="mb-16">
          <h5 className="text-sm uppercase text-muted-foreground mb-2">(Selected Work)</h5>
        </div>
      </SmoothReveal>
      
      <div className="space-y-0">
        {projects.map((project, index) => (
          <ProjectItem 
            key={project.id} 
            project={project} 
            isLast={index === projects.length - 1} 
            index={index} 
          />
        ))}
      </div>
    </section>
  );
};

interface ProjectItemProps {
  project: Project;
  isLast: boolean;
  index: number;
}

const ProjectItem = ({ project, isLast, index }: ProjectItemProps) => {
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevX = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const x = e.clientX;
    
    const deltaX = x - prevX.current;
    const newRotation = Math.max(-25, Math.min(25, deltaX * 0.8));
    
    setImagePosition({ x, y });
    setRotation(newRotation);
    prevX.current = x;
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 80,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.9,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative flex items-center justify-between py-6 md:py-10 border-t border-border cursor-pointer group ${
        isLast ? "border-b" : ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotation(0);
      }}
      onClick={() => window.open(project.href, "_blank")}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Animated background on hover */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: `linear-gradient(90deg, hsl(${project.color} / 0.1) 0%, transparent 100%)`,
          transformOrigin: "left",
        }}
      />

      {/* Hover Image with enhanced effects */}
      <motion.div
        className="absolute pointer-events-none z-50"
        style={{
          left: imagePosition.x,
          top: imagePosition.y,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.5,
          rotate: rotation,
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.16, 1, 0.3, 1],
          rotate: { duration: 0.2 },
        }}
      >
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-48 md:w-72 h-auto rounded-lg shadow-2xl"
          style={{
            boxShadow: `0 25px 50px -12px hsl(${project.color} / 0.4)`,
          }}
        />
        {/* Image glow */}
        <div 
          className="absolute inset-0 rounded-lg blur-2xl opacity-50 -z-10"
          style={{ background: `hsl(${project.color})` }}
        />
      </motion.div>

      {/* Project Title with glitch effect */}
      <motion.h1 
        className="text-4xl md:text-[7.6vw] font-bold uppercase text-gray-text"
        animate={{
          opacity: isHovered ? 1 : 0.7,
          x: isHovered ? 20 : 0,
          letterSpacing: isHovered ? "0.05em" : "0em",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlitchText>{project.title}</GlitchText>
      </motion.h1>

      {/* Year with animated underline */}
      <motion.div className="relative">
        <motion.h5 
          className="text-sm md:text-base font-medium text-foreground"
          animate={{
            x: isHovered ? -10 : 0,
          }}
          transition={{ duration: 0.4 }}
        >
          {project.year}
        </motion.h5>
        <motion.div
          className="absolute -bottom-1 left-0 h-0.5 bg-primary"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Projects;
