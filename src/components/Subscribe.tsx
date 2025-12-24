import { motion, Variants } from "framer-motion";
import { ArrowRightUpLine } from "./Icons";

const Subscribe = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const slideUpVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      clipPath: "inset(100% 0% 0% 0%)",
    },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.section
      className="bg-background py-12 px-6 md:px-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div className="overflow-hidden">
        <motion.h5 
          variants={slideUpVariants}
          className="text-sm uppercase text-muted-foreground mb-2"
        >
          (forgot to mention)
        </motion.h5>
      </motion.div>
      
      <motion.div className="overflow-hidden">
        <motion.a
          href="https://www.youtube.com/channel/UCBtZRAPe4f7asQR3GihrebQ"
          target="_blank"
          rel="noopener noreferrer"
          className="hover-underline text-foreground no-underline text-sm font-medium group inline-flex items-center gap-1 hover:translate-x-5 transition-transform duration-300"
          variants={slideUpVariants}
        >
          subscribe to my youtube channel
          <span className="inline-block transition-transform duration-300 group-hover:rotate-[30deg]">
            <ArrowRightUpLine />
          </span>
        </motion.a>
      </motion.div>
    </motion.section>
  );
};

export default Subscribe;
