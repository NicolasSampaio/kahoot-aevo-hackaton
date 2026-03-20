import { useEffect, useRef } from 'react';

interface ConfettiProps {
  width?: number;
  height?: number;
  particleCount?: number;
}

export default function Confetti({ 
  width = 800, 
  height = 400, 
  particleCount = 200 
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Game palette colors (indigo, purple, pink, blue)
    const colors = [
      '#6366F1', // indigo-500
      '#8B5CF6', // violet-500
      '#EC4899', // pink-500
      '#06B6D4', // cyan-500
      '#FBBF24'  // amber-400
    ];

    // Particle class
    class Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      rotation: number;
      speed: number;
      velocityX: number;
      velocityY: number;
      gravity: number;
      opacity: number;
      decay: number;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.radius = Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * 2 + 0.5;
        this.velocityX = Math.cos(this.rotation) * this.speed;
        this.velocityY = Math.sin(this.rotation) * this.speed;
        this.gravity = 0.05;
        this.opacity = 0;
        this.decay = Math.random() * 0.01 + 0.005;
      }

      update() {
        this.velocityY += this.gravity;
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.rotation += 0.05;
        this.opacity += this.decay;
        if (this.opacity > 1) this.opacity = 1;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Create particles
    const particles: Particle[] = Array.from({ length: particleCount }, () => new Particle());

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p) => {
        p.update();
        p.draw();
        
        // Reset particle if it goes off screen
        if (p.y > height + 10 || p.x < -10 || p.x > width + 10) {
          p.reset();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height, particleCount]);

  return (
    <div className="pointer-events-none fixed inset-0">
      <canvas 
        ref={canvasRef} 
        className="pointer-events-none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
}