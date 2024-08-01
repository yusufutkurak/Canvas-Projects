import React, { useRef, useEffect } from 'react';

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesArray: Particle[] = [];
  let hue = 0;

  const mouse = {
    x: undefined as number | undefined,
    y: undefined as number | undefined,
  };

  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;

    constructor() {
      this.x = mouse.x!;
      this.y = mouse.y!;
      this.size = Math.random() * 25 + 1;
      this.speedX = Math.random() * 8 -1.5;
      this.speedY = Math.random() * 8 -1.5;
      this.color = `hsl(${hue}, 100%, 50%)`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.2) this.size -= 0.1;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const handleClick = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
      for (let i = 0; i < 10; i++) {
        particlesArray.push(new Particle());
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
      for (let i = 0; i < 5; i++) {
        particlesArray.push(new Particle());
      }
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);

    const handleParticles = () => {
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw(ctx);
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy , 2));
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = particlesArray[i].color;
            ctx.lineWidth = 0.2;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
        if (particlesArray[i].size <= 0.2) {
          particlesArray.splice(i, 1);
          i--;
        }
      }
    };

    const animate = () => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      handleParticles();
      hue += 2;

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} id="canvas1" />;
};

export default ParticleCanvas;
