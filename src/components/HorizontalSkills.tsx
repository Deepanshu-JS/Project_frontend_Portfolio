import { useLayoutEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { skills, Skill } from "@/data/skills";

// Dynamic icon component
interface IconProps extends Omit<LucideProps, "ref"> {
  name: keyof typeof dynamicIconImports;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = lazy(dynamicIconImports[name]);

  return (
    <Suspense fallback={<div className="w-6 h-6 bg-muted rounded animate-pulse" />}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

const HorizontalSkills = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxTranslateX, setMaxTranslateX] = useState(1);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;

      const viewport = window.innerWidth;
      const last = track.lastElementChild as HTMLElement | null;

      const lastRight = last
        ? last.offsetLeft + last.offsetWidth
        : track.scrollWidth;

      const extra = Math.round(viewport * 0.15);
      const max = Math.max(1, lastRight - viewport + extra);
      setMaxTranslateX(max);
    };

    const id = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const x = useTransform(smoothProgress, [0, 1], [0, -maxTranslateX]);
  const bgX1 = useTransform(smoothProgress, [0, 1], ["0%", "-30%"]);
  const bgX2 = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section
      ref={targetRef}
      className="relative bg-background -mt-px"
      style={{ height: `calc(120vh + ${maxTranslateX}px)` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Parallax background layers */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{ x: bgX1 }}
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, hsl(var(--primary) / 0.2) 0%, transparent 50%)`,
            backgroundSize: "200% 100%",
          }} />
        </motion.div>
        
        <motion.div
          className="absolute inset-0"
          style={{ x: bgX2 }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-foreground/5 rounded-full"
              style={{
                width: 100 + i * 40,
                height: 100 + i * 40,
                left: `${(i * 15) % 100}%`,
                top: `${20 + (i * 13) % 60}%`,
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          ))}
        </motion.div>

        {/* Section header */}
        <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 z-10 max-w-[200px] md:max-w-none">
          <motion.span 
            className="text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground block mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Skills & Technologies
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            My
            <br />
            <span className="text-primary">Expertise</span>
          </motion.h2>
        </div>

        {/* Horizontal scrolling skills */}
        <motion.div
          ref={trackRef}
          className="flex items-center gap-6 md:gap-10 pl-[50vw] md:pl-[40vw] pr-[35vw]"
          style={{ x }}
        >
          {skills.map((skill, index) => (
            <SkillCard
              key={skill.name}
              skill={skill}
              index={index}
              scrollProgress={smoothProgress}
            />
          ))}
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-4">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Scroll</span>
          <div className="w-20 md:w-32 h-1 bg-border rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              style={{ scaleX: smoothProgress, transformOrigin: "left" }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {skills.length}
          </span>
        </div>
      </div>
    </section>
  );
};

interface SkillCardProps {
  skill: Skill;
  index: number;
  scrollProgress: MotionValue<number>;
}

const SkillCard = ({ skill, index, scrollProgress }: SkillCardProps) => {
  const delay = index * 0.03;
  const cardY = useTransform(
    scrollProgress,
    [0 + delay, 0.2 + delay, 0.8 - delay, 1 - delay],
    [80, 0, 0, -80]
  );
  const cardRotate = useTransform(
    scrollProgress,
    [0, 0.5, 1],
    [3 + index, 0, -3 - index]
  );
  const cardScale = useTransform(
    scrollProgress,
    [0 + delay, 0.15 + delay, 0.85 - delay, 1 - delay],
    [0.85, 1, 1, 0.85]
  );

  // Get the icon name, fallback to "code" if not found
  const iconName = (skill.icon in dynamicIconImports 
    ? skill.icon 
    : "code") as keyof typeof dynamicIconImports;

  return (
    <motion.div
      className="relative flex-shrink-0 w-56 md:w-72 lg:w-80"
      style={{
        y: cardY,
        rotate: cardRotate,
        scale: cardScale,
      }}
    >
      <motion.div
        className="relative p-6 md:p-8 rounded-2xl md:rounded-3xl bg-card border border-border overflow-hidden group cursor-pointer"
        whileHover={{ 
          scale: 1.05,
          boxShadow: `0 25px 50px -12px #${skill.color}40`,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at center, #${skill.color}15 0%, transparent 70%)`,
          }}
        />
        
        {/* Icon */}
        <motion.div
          className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6"
          style={{ 
            backgroundColor: `#${skill.color}20`,
            color: `#${skill.color}`,
          }}
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon name={iconName} size={32} strokeWidth={1.5} />
        </motion.div>

        {/* Name */}
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300">
          {skill.name}
        </h3>

        {/* Skill level bar */}
        <div className="relative">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Proficiency</span>
            <span>{skill.level}%</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: `#${skill.color}` }}
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Decorative corner */}
        <div 
          className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 opacity-10"
          style={{
            background: `linear-gradient(135deg, #${skill.color} 0%, transparent 50%)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default HorizontalSkills;
