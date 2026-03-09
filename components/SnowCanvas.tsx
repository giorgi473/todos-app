'use client';
import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface Snowflake {
  x: number;
  y: number;
  r: number;
  d: number;
  opacity: number;
}

export default function SnowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animationFrameId: number;
    const snowflakes: Snowflake[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 200; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 1 + 0.5,
        d: Math.random() * 3,
        opacity: Math.random() * 0.7 + 0.7,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const snowColor = theme === 'dark' ? '255,255,255' : '105,105,105';
      ctx.fillStyle = `rgba(${snowColor}, ${0.7})`;

      snowflakes.forEach((flake, i) => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fill();

        flake.y += flake.r * 0.15 + flake.d;
        flake.x += Math.sin(flake.y * 0.01) * 0.5;
        flake.opacity = Math.sin(flake.y * 0.01) * 0.3 + 0.7;

        if (flake.y > canvas.height) {
          snowflakes[i] = {
            ...snowflakes[i],
            x: Math.random() * canvas.width,
            y: Math.random() * -100,
            opacity: Math.random() * 0.7 + 0.3,
          };
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none transition-all duration-500"
    />
  );
}
