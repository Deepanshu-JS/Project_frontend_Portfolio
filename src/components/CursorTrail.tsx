import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
  hue: number;
  shape: "circle" | "star" | "diamond" | "ring";
}

const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const animationRef = useRef<number>();
  const hueRef = useRef(0);

  const createParticle = useCallback((x: number, y: number, velocityX: number, velocityY: number) => {
    const shapes: Particle["shape"][] = ["circle", "star", "diamond", "ring"];
    const particle: Particle = {
      x,
      y,
      size: Math.random() * 8 + 4,
      speedX: velocityX * 0.3 + (Math.random() - 0.5) * 2,
      speedY: velocityY * 0.3 + (Math.random() - 0.5) * 2,
      life: 1,
      maxLife: Math.random() * 40 + 30,
      hue: hueRef.current,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    };
    particlesRef.current.push(particle);
  }, []);

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size / 2;
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      let xPos = x + Math.cos(rot) * outerRadius;
      let yPos = y + Math.sin(rot) * outerRadius;
      ctx.lineTo(xPos, yPos);
      rot += step;

      xPos = x + Math.cos(rot) * innerRadius;
      yPos = y + Math.sin(rot) * innerRadius;
      ctx.lineTo(xPos, yPos);
      rot += step;
    }
    
    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();
    ctx.fill();
  };

  const drawRing = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    const alpha = particle.life;
    ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${alpha})`;
    ctx.strokeStyle = `hsla(${particle.hue}, 80%, 60%, ${alpha})`;
    
    const currentSize = particle.size * particle.life;

    switch (particle.shape) {
      case "star":
        drawStar(ctx, particle.x, particle.y, currentSize);
        break;
      case "diamond":
        drawDiamond(ctx, particle.x, particle.y, currentSize);
        break;
      case "ring":
        drawRing(ctx, particle.x, particle.y, currentSize);
        break;
      default:
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
    }
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with slight fade effect for trail
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.speedX *= 0.98;
      particle.speedY *= 0.98;
      particle.speedY += 0.05; // Slight gravity
      particle.life -= 1 / particle.maxLife;

      if (particle.life > 0) {
        drawParticle(ctx, particle);
        return true;
      }
      return false;
    });

    // Slowly shift hue for rainbow effect
    hueRef.current = (hueRef.current + 0.5) % 360;

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let lastSpawnTime = 0;
    const spawnInterval = 16; // Spawn particles every ~16ms

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const velocityX = e.clientX - mouseRef.current.prevX;
      const velocityY = e.clientY - mouseRef.current.prevY;
      
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        prevX: mouseRef.current.x,
        prevY: mouseRef.current.y,
      };

      // Spawn particles based on movement speed
      const speed = Math.sqrt(velocityX ** 2 + velocityY ** 2);
      
      if (now - lastSpawnTime > spawnInterval && speed > 2) {
        const particleCount = Math.min(Math.floor(speed / 8) + 1, 4);
        
        for (let i = 0; i < particleCount; i++) {
          createParticle(e.clientX, e.clientY, velocityX, velocityY);
        }
        lastSpawnTime = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, createParticle]);

  // Hide on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99998]"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default CursorTrail;
