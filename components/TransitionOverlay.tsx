'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useApp } from './AppProvider';

export function TransitionOverlay() {
  const { isTransitioning, nextScene, completeTransition } = useApp();
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const slashRef1 = useRef<HTMLDivElement>(null);
  const slashRef2 = useRef<HTMLDivElement>(null);
  const loadingBarRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isTransitioning && nextScene) {
      if (tlRef.current) tlRef.current.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          completeTransition();
          // Animate out after transition is complete
          const outTl = gsap.timeline();
          outTl.to([slashRef1.current, slashRef2.current], {
            xPercent: (i) => i === 0 ? -100 : 100,
            duration: 0.6,
            ease: 'power4.in',
            delay: 0.2
          })
          .to(overlayRef.current, { autoAlpha: 0, duration: 0.2 }, '>-0.2');
        }
      });
      tlRef.current = tl;

      // Reset
      gsap.set(overlayRef.current, { autoAlpha: 1 });
      gsap.set(slashRef1.current, { xPercent: -100, skewX: -15 });
      gsap.set(slashRef2.current, { xPercent: 100, skewX: -15 });
      gsap.set(textRef.current, { scale: 0, rotation: -10, autoAlpha: 0 });
      gsap.set(loadingBarRef.current, { scaleX: 0 });
      setProgress(0);

      // Smash cut in
      tl.to(slashRef1.current, { xPercent: 0, duration: 0.4, ease: 'power4.out' }, 0)
        .to(slashRef2.current, { xPercent: 0, duration: 0.4, ease: 'power4.out' }, 0)
        .to(textRef.current, { 
          scale: 1, 
          rotation: 0, 
          autoAlpha: 1, 
          duration: 0.5, 
          ease: 'back.out(2)' 
        }, 0.2)
        // Fake loading progress
        .to({ val: 0 }, {
          val: 100,
          duration: 0.8,
          ease: 'power2.inOut',
          onUpdate: function() {
            setProgress(Math.round(this.targets()[0].val));
            gsap.set(loadingBarRef.current, { scaleX: this.targets()[0].val / 100 });
          }
        }, 0.2)
        // Freeze frame effect
        .to(textRef.current, { scale: 1.1, duration: 0.8, ease: 'none' }, 0.2);
    }
  }, [isTransitioning, nextScene, completeTransition]);

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-[9000] pointer-events-none flex flex-col items-center justify-center overflow-hidden opacity-0 invisible"
    >
      <div 
        ref={slashRef1} 
        className="absolute inset-0 bg-persona-red w-[120%] h-[120%] -left-[10%] -top-[10%] origin-left"
      />
      <div 
        ref={slashRef2} 
        className="absolute inset-0 bg-persona-black w-[120%] h-[120%] -left-[10%] -top-[10%] origin-right comic-slash"
      />
      
      <div 
        ref={textRef}
        className="relative z-10 font-display text-8xl md:text-[12rem] text-persona-white uppercase tracking-tighter mix-blend-difference"
        style={{ textShadow: '4px 4px 0px #e60012' }}
      >
        {nextScene || 'LOADING'}
      </div>

      {/* Fake Loading Bar */}
      <div className="relative z-10 w-64 h-4 mt-8 bg-persona-gray border-2 border-persona-white" style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}>
        <div 
          ref={loadingBarRef}
          className="h-full bg-persona-yellow origin-left"
        />
      </div>
      <div className="relative z-10 font-mono text-persona-white mt-2 font-bold tracking-widest">
        NOW LOADING... {progress}%
      </div>
      
      {/* Halftone dot pattern overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{
        backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
        backgroundSize: '10px 10px'
      }} />
    </div>
  );
}
