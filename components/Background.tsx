'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function Background() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating geometric shapes
    const shapes: HTMLDivElement[] = [];
    const colors = ['#e60012', '#222222', '#ffffff'];
    
    for (let i = 0; i < 15; i++) {
      const shape = document.createElement('div');
      shape.className = 'absolute opacity-10 pointer-events-none mix-blend-overlay';
      
      // Randomize shape (star, polygon, circle)
      const type = Math.random();
      if (type > 0.6) {
        shape.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      } else if (type > 0.3) {
        shape.style.clipPath = 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)';
      } else {
        shape.style.borderRadius = '50%';
      }

      const size = Math.random() * 100 + 20;
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Initial random position
      gsap.set(shape, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5
      });

      container.appendChild(shape);
      shapes.push(shape);

      // Animate continuously
      gsap.to(shape, {
        x: `+=${Math.random() * 200 - 100}`,
        y: `+=${Math.random() * 200 - 100}`,
        rotation: `+=${Math.random() * 180 - 90}`,
        duration: Math.random() * 10 + 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // Mouse parallax effect for background
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      
      gsap.to(container, {
        x,
        y,
        duration: 1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      shapes.forEach(shape => shape.remove());
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-persona-black pointer-events-none">
      {/* Halftone dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)',
        backgroundSize: '20px 20px'
      }} />
      
      {/* Large background text */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 font-display text-[20vw] text-persona-gray opacity-20 whitespace-nowrap -rotate-12 select-none pointer-events-none leading-none mix-blend-screen">
        TAKE YOUR TIME
      </div>
      
      {/* Container for floating shapes */}
      <div ref={containerRef} className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%]" />
    </div>
  );
}
