import { motion, AnimatePresence, Variants } from "framer-motion";
import { X } from "lucide-react";
import { ArrowRightUpLine } from "./Icons";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuLinks = [
  { title: "Home", href: "#home" },
  { title: "Projects", href: "#projects" },
  { title: "About", href: "#about" },
  { title: "Contact", href: "#contact" },
];

const socialLinks = [
  { title: "Github", href: "https://github.com/Deepanshu-JS" },
  { title: "LinkedIn", href: "https://www.linkedin.com/in/deepanshu-singh-b2b112212/" },
  { title: "YouTube", href: "https://www.youtube.com/channel/UCBtZRAPe4f7asQR3GihrebQ" },
];

const Menu = ({ isOpen, onClose }: MenuProps) => {
  const overlayVariants: Variants = {
    hidden: { 
      clipPath: "circle(0% at calc(100% - 60px) 40px)",
    },
    visible: { 
      clipPath: "circle(150% at calc(100% - 60px) 40px)",
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: { 
      clipPath: "circle(0% at calc(100% - 60px) 40px)",
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.3,
      },
    },
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      y: 80, 
      opacity: 0,
      rotateX: -90,
    },
    visible: { 
      y: 0, 
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: { 
      y: -40, 
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
  };

  const socialVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: { 
      y: 20, 
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const handleLinkClick = (href: string) => {
  onClose();
  if (href.startsWith("#")) {
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        // Find the scrollable container (main element)
        const scrollContainer = document.querySelector('main');
        if (scrollContainer) {
          const elementPosition = element.getBoundingClientRect().top;
          const containerScrollTop = scrollContainer.scrollTop;
          const offset = 0;
          
          scrollContainer.scrollTo({
            top: containerScrollTop + elementPosition - offset,
            behavior: "smooth",
          });
        } else {
          // Fallback to window scroll
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 700);
  } else if (href.startsWith("mailto:")) {
    window.location.href = href;
  } else {
    window.open(href, "_blank");
  }
};


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] bg-primary flex flex-col"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Close Button - Hidden since Hero has hamburger */}

          {/* Menu Content */}
          <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
            <motion.nav
              className="space-y-2 md:space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {menuLinks.map((link, index) => (
                <div key={link.title} className="overflow-hidden perspective-1000">
                  <motion.div
                    variants={itemVariants}
                    className="origin-top"
                  >
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="group flex items-center gap-4 text-primary-foreground text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter hover:translate-x-4 transition-transform duration-300"
                    >
                      <span className="text-primary-foreground/30 text-xl md:text-2xl font-medium">
                        0{index + 1}
                      </span>
                      <span className="relative">
                        {link.title}
                        <span className="absolute bottom-2 left-0 w-0 h-1 bg-primary-foreground group-hover:w-full transition-all duration-500" />
                      </span>
                      <motion.span
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ x: -20 }}
                        whileHover={{ x: 0 }}
                      >
                        <ArrowRightUpLine size={32} />
                      </motion.span>
                    </button>
                  </motion.div>
                </div>
              ))}
            </motion.nav>
          </div>

          {/* Bottom Section */}
          <motion.div
            className="px-8 md:px-16 lg:px-24 py-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Social Links */}
            <motion.div className="flex gap-6 md:gap-8" variants={socialVariants}>
              {socialLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 text-sm uppercase tracking-wider hover:text-primary-foreground transition-colors duration-300 hover-underline"
                >
                  {link.title}
                </a>
              ))}
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-primary-foreground/50 text-sm uppercase tracking-wider"
              variants={socialVariants}
            >
              Available for freelance work
            </motion.p>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-1 bg-primary-foreground/10"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0, originX: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;
