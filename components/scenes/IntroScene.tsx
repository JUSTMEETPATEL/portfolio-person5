'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useApp } from '@/components/AppProvider';
import { useSound } from '@/hooks/useSound';

export function IntroScene() {
  const { navigateTo, registerTimeline } = useApp();
  const { playClick } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const enterTl = gsap.timeline({ paused: true });
    const exitTl = gsap.timeline({ paused: true });

    // Enter Animation
    enterTl
      .fromTo(nameRef.current, 
        { scale: 5, autoAlpha: 0, rotation: 10 },
        { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.8, ease: 'power4.out' }
      )
      .fromTo(descRef.current,
        { y: 50, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.5)' },
        '-=0.4'
      )
      .fromTo(promptRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4, yoyo: true, repeat: -1, ease: 'power1.inOut' },
        '+=0.5'
      );

    // Exit Animation
    exitTl
      .to([promptRef.current, descRef.current], {
        autoAlpha: 0, y: -20, duration: 0.3, stagger: 0.1, ease: 'power2.in'
      })
      .to(nameRef.current, {
        scale: 0, rotation: -10, autoAlpha: 0, duration: 0.5, ease: 'power4.in'
      }, '-=0.2');

    registerTimeline('INTRO', 'enter', enterTl);
    registerTimeline('INTRO', 'exit', exitTl);

    enterTl.play();

    return () => {
      enterTl.kill();
      exitTl.kill();
    };
  }, [registerTimeline]);

  const handleStart = () => {
    playClick();
    navigateTo('STATION');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStart]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 flex flex-col items-center justify-center bg-persona-red cursor-pointer z-10"
      onClick={handleStart}
    >
      <div className="relative text-center">
        <h1 
          ref={nameRef} 
          className="font-display text-8xl md:text-[10rem] text-persona-white uppercase tracking-tighter leading-none mb-4"
          style={{ textShadow: '6px 6px 0px #141414' }}
        >
          MEET PATEL
        </h1>
        <p 
          ref={descRef}
          className="font-mono text-xl md:text-2xl text-persona-black font-bold bg-persona-white inline-block px-4 py-2 transform -skew-x-12"
        >
          Systems-oriented backend & infrastructure engineer
        </p>
      </div>

      <div 
        ref={promptRef}
        className="absolute bottom-20 font-display text-3xl text-persona-white tracking-widest animate-pulse"
      >
        PRESS ENTER OR CLICK TO START
      </div>

      {/* Halftone dot pattern overlay */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
        backgroundSize: '10px 10px'
      }} />
    </div>
  );
}
