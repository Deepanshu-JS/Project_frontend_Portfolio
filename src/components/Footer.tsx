import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

const Footer = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const time = new Intl.DateTimeFormat("en-US", {
        hour12: true,
        hour: "numeric",
        minute: "numeric",
      }).format(new Date());
      setCurrentTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const linkVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className="bg-background py-6 px-6 md:px-10 flex flex-row items-center justify-between gap-4 w-full"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Left Side */}
      <motion.div 
        className="flex items-center gap-5"
        variants={itemVariants}
      >
        <h5 className="text-sm text-foreground">2024 ©</h5>
        <motion.h5 
          className="text-sm text-foreground"
          key={currentTime}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentTime}
        </motion.h5>
      </motion.div>

      {/* Right Side - Social Links */}
      <motion.div 
        className="flex items-center gap-8"
        variants={containerVariants}
      >
        <motion.a
          href="https://github.com/Deepanshu-JS"
          target="_blank"
          rel="noopener noreferrer"
          className="hover-underline text-foreground no-underline text-sm font-medium"
          variants={linkVariants}
          whileHover={{ x: 5 }}
        >
          github
        </motion.a>
        <motion.a
          href="https://www.linkedin.com/in/deepanshu-singh-b2b112212/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover-underline text-foreground no-underline text-sm font-medium"
          variants={linkVariants}
          whileHover={{ x: 5 }}
        >
          linkedin
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default Footer;
