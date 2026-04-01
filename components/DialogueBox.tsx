'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface DialogueBoxProps {
  speaker: string;
  text: string;
  onComplete?: () => void;
}

export function DialogueBox({ speaker, text, onComplete }: DialogueBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const speakerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !speakerRef.current || !containerRef.current) return;

    // Split text into characters manually for animation
    const chars = text.split('');
    textRef.current.innerHTML = '';
    
    chars.forEach(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      textRef.current?.appendChild(span);
    });

    const charElements = textRef.current.querySelectorAll('span');

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // Enter animation for the box
    tl.fromTo(containerRef.current,
      { scaleY: 0, transformOrigin: 'bottom' },
      { scaleY: 1, duration: 0.3, ease: 'power2.out' }
    )
    .fromTo(speakerRef.current,
      { x: -20, autoAlpha: 0, skewX: -10 },
      { x: 0, autoAlpha: 1, skewX: 0, duration: 0.2, ease: 'power2.out' },
      '-=0.1'
    )
    // Typewriter effect
    .to(charElements, {
      opacity: 1,
      duration: 0.01,
      stagger: 0.02,
      ease: 'none'
    });

    return () => {
      tl.kill();
    };
  }, [text, onComplete]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-4xl bg-persona-black text-persona-white p-6 md:p-8 border-4 border-persona-white shadow-[8px_8px_0px_#e60012]"
      style={{ clipPath: 'polygon(2% 0, 100% 0, 98% 100%, 0% 100%)' }}
    >
      <div 
        ref={speakerRef}
        className="absolute -top-6 -left-4 bg-persona-white text-persona-black font-display text-2xl md:text-3xl px-4 py-1 uppercase"
        style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)' }}
      >
        {speaker}
      </div>
      
      <div 
        ref={textRef}
        className="font-mono text-lg md:text-xl leading-relaxed mt-4 min-h-[80px]"
      />
      
      {/* Blinking indicator */}
      <div className="absolute bottom-4 right-6 w-4 h-4 bg-persona-red rounded-full animate-pulse" />
    </div>
  );
}
