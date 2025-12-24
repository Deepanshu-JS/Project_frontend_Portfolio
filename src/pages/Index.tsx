import { useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import CustomCursor from "@/components/CustomCursor";
import CursorTrail from "@/components/CursorTrail";
import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Subscribe from "@/components/Subscribe";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import SectionTransition from "@/components/SectionTransition";
import AnimatedSection from "@/components/AnimatedSection";

import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>Deepanshu | Frontend Developer</title>
        <meta
          name="description"
          content="Frontend developer based in India, crafting beautiful and functional web experiences. Available for freelance work."
        />
        <meta name="keywords" content="frontend developer, web developer, React, JavaScript, India, freelance" />
        <meta property="og:title" content="Deepanshu | Frontend Developer" />
        <meta
          property="og:description"
          content="Frontend developer based in India, crafting beautiful and functional web experiences."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://deepanshu.dev" />
      </Helmet>

      <CustomCursor />
      <CursorTrail />
      
      <Preloader onComplete={handlePreloaderComplete} />
      <Toaster />
      
      {isLoaded && <ScrollProgress />}
      {isLoaded && <BackToTop />}

      <main className="bg-background min-h-screen overflow-x-hidden md:snap-y md:snap-mandatory md:h-screen overflow-y-auto scroll-smooth">
        <section className="snap-start snap-always">
          <Hero isLoaded={isLoaded} />
        </section>
        
        <SectionTransition variant="tear" />
        
        <section className="snap-start snap-always">
          <AnimatedSection animation="slideReveal">
            <Projects />
          </AnimatedSection>
        </section>
        
        <SectionTransition variant="fold" />
        
        <section className="snap-start snap-always">
          <AnimatedSection animation="blur" delay={0.1}>
            <About />
          </AnimatedSection>
        </section>
        
        <SectionTransition variant="shatter" />
        
        <section className="snap-start snap-always">
          <AnimatedSection animation="fadeUp" delay={0.1}>
            <Contact />
          </AnimatedSection>
        </section>
        
        <SectionTransition variant="tear" />
        
        <section className="snap-start snap-always">
          <AnimatedSection animation="scale" delay={0.1}>
            <Subscribe />
          </AnimatedSection>
        </section>
        
        <SectionTransition variant="tear" />
        
        <section className="snap-start snap-always">
          <Footer />
        </section>
      </main>
    </>
  );
};

export default Index;
