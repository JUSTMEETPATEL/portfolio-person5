'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useApp } from '@/components/AppProvider';
import { useSound } from '@/hooks/useSound';

export function StationScene() {
  const { navigateTo, registerTimeline } = useApp();
  const { playHover, playClick } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const trainLeftRef = useRef<HTMLDivElement>(null);
  const trainRightRef = useRef<HTMLDivElement>(null);
  const phoneContainerRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems = [
    { label: 'EXPERIENCE', scene: 'ABOUT' as const },
    { label: 'PROJECTS', scene: 'PROJECTS' as const },
    { label: 'CONTACT', scene: 'CONTACT' as const },
  ];

  useEffect(() => {
    const enterTl = gsap.timeline({ paused: true });
    const exitTl = gsap.timeline({ paused: true });

    // Phone pops up from bottom center
    enterTl.fromTo(phoneContainerRef.current,
      { y: '100%', rotation: 5, autoAlpha: 0 },
      { y: '0%', rotation: 0, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.2)' }
    );

    // Menu items appear
    enterTl.fromTo(menuItemsRef.current,
      { y: 20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
      '-=0.4'
    );

    // Exit Animation
    exitTl.to(menuItemsRef.current, {
      y: -20, autoAlpha: 0, duration: 0.3, stagger: 0.05, ease: 'power2.in'
    }).to(phoneContainerRef.current, {
      y: '100%', rotation: -5, autoAlpha: 0, duration: 0.5, ease: 'power2.in'
    }, '-=0.2');

    registerTimeline('STATION', 'enter', enterTl);
    registerTimeline('STATION', 'exit', exitTl);

    enterTl.play();

    // Continuous train animation loop
    // Left train moves top to bottom (towards viewer)
    const trainLeft = gsap.fromTo(trainLeftRef.current,
      { y: '-150vh' },
      { y: '300vh', duration: 1.2, ease: 'none', repeat: -1, repeatDelay: 0.5 }
    );
    
    // Right train moves bottom to top (away from viewer)
    const trainRight = gsap.fromTo(trainRightRef.current,
      { y: '300vh' },
      { y: '-150vh', duration: 1.5, ease: 'none', repeat: -1, repeatDelay: 0.8 }
    );

    return () => {
      enterTl.kill();
      exitTl.kill();
      trainLeft.kill();
      trainRight.kill();
    };
  }, [registerTimeline]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setSelectedIndex((prev) => {
          playHover();
          return (prev + 1) % menuItems.length;
        });
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex((prev) => {
          playHover();
          return (prev - 1 + menuItems.length) % menuItems.length;
        });
      } else if (e.key === 'Enter') {
        playClick();
        navigateTo(menuItems[selectedIndex].scene);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, menuItems, navigateTo, playHover, playClick]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-[#0a0a0a]" style={{ perspective: '800px' }}>
      
      {/* 3D World Container */}
      <div 
        className="absolute inset-0 flex justify-center pointer-events-none" 
        style={{ 
          transform: 'rotateX(60deg) translateY(-20vh) scale(1.5)', 
          transformOrigin: 'center 80%', 
          transformStyle: 'preserve-3d' 
        }}
      >
        
        {/* Left Track */}
        <div className="w-[30vw] h-[300vh] bg-[#050505] relative overflow-hidden border-r-4 border-persona-yellow/50">
          <div 
            ref={trainLeftRef} 
            className="absolute top-0 left-1/4 w-1/2 h-[150vh] bg-persona-red flex flex-col gap-12 py-12 shadow-[0_0_50px_#e60012]"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-3/4 h-24 bg-white/90 mx-auto rounded-sm shadow-[0_0_10px_#fff]"></div>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div className="w-[40vw] h-[300vh] bg-[#1a1a1a] relative" style={{ transformStyle: 'preserve-3d' }}>
          {/* Platform grid texture */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 100px, #fff 100px, #fff 104px), repeating-linear-gradient(90deg, transparent, transparent 100px, #fff 100px, #fff 104px)' }}></div>
          
          {/* Pillar 2 (Right, further back/top) */}
          <div className="absolute right-[10%] top-[20%] w-16 h-64 bg-[#111] border-2 border-white/10 flex flex-col items-center" style={{ transform: 'rotateX(-60deg)', transformOrigin: 'bottom center' }}>
            <div className="w-full h-12 bg-persona-red mt-8 text-white text-[10px] flex items-center justify-center font-mono text-center leading-tight">STATION<br/>02</div>
          </div>

          {/* Persona 5 Char 2 (Right, further back) */}
          <div className="absolute right-[25%] top-[25%] w-12 h-40 bg-black rounded-t-full opacity-80" style={{ transform: 'rotateX(-60deg)', transformOrigin: 'bottom center' }}></div>

          {/* Pillar 1 (Left, closer/bottom) */}
          <div className="absolute left-[10%] bottom-[30%] w-20 h-80 bg-[#111] border-2 border-white/10 flex flex-col items-center" style={{ transform: 'rotateX(-60deg)', transformOrigin: 'bottom center' }}>
            <div className="w-full h-16 bg-persona-red mt-12 text-white text-xs flex items-center justify-center font-mono font-bold">YONGEN</div>
          </div>

          {/* Persona 5 Char 1 (Left, closer) */}
          <div className="absolute left-[30%] bottom-[25%] w-16 h-48 bg-black rounded-t-full opacity-90" style={{ transform: 'rotateX(-60deg)', transformOrigin: 'bottom center' }}></div>
        </div>

        {/* Right Track */}
        <div className="w-[30vw] h-[300vh] bg-[#050505] relative overflow-hidden border-l-4 border-persona-yellow/50">
          <div 
            ref={trainRightRef} 
            className="absolute bottom-0 left-1/4 w-1/2 h-[150vh] bg-persona-black flex flex-col gap-12 py-12 shadow-[0_0_50px_#000]"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-3/4 h-24 bg-white/90 mx-auto rounded-sm shadow-[0_0_10px_#fff]"></div>
            ))}
          </div>
        </div>

      </div>

      {/* Phone POV (Centered 2D Overlay) */}
      <div 
        ref={phoneContainerRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 md:w-96 h-[75vh] origin-bottom z-20 flex flex-col justify-end"
      >
        {/* Stylized Hands holding the phone */}
        <div className="absolute -left-8 bottom-10 w-16 h-48 bg-[#111] rounded-full rotate-[20deg] z-30 shadow-2xl border-r-4 border-white/10"></div>
        <div className="absolute -right-8 bottom-10 w-16 h-48 bg-[#111] rounded-full -rotate-[20deg] z-30 shadow-2xl border-l-4 border-white/10"></div>
        
        {/* Phone Body */}
        <div className="w-full h-full bg-persona-black rounded-t-[3rem] border-8 border-b-0 border-persona-white p-4 md:p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden z-20">
          {/* Phone Screen */}
          <div className="flex-1 bg-persona-red rounded-2xl border-4 border-persona-white flex flex-col p-6 relative overflow-hidden">
            
            {/* Screen Header */}
            <div className="text-persona-white font-mono text-xl font-bold mb-8 border-b-2 border-persona-white pb-2 flex justify-between">
              <span>MEET_OS</span>
              <span>10:12</span>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-4 flex-1 justify-center">
              {menuItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.label}
                    ref={el => { menuItemsRef.current[index] = el; }}
                    onClick={() => {
                      playClick();
                      navigateTo(item.scene);
                    }}
                    onMouseEnter={() => {
                      if (selectedIndex !== index) playHover();
                      setSelectedIndex(index);
                    }}
                    data-interactive="true"
                    className={`group relative font-display text-3xl px-4 py-3 uppercase tracking-tight overflow-hidden transition-transform origin-left text-left ${
                      isSelected 
                        ? 'text-persona-red bg-persona-white scale-105 -rotate-2' 
                        : 'text-persona-white bg-transparent hover:scale-105 hover:-rotate-2'
                    }`}
                    style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}
                  >
                    <span className="relative z-10 transition-colors duration-200">
                      {item.label}
                    </span>
                    <div className={`absolute inset-0 bg-persona-white transition-transform duration-300 ease-out z-0 ${
                      isSelected ? 'translate-x-0' : 'translate-x-[-101%] group-hover:translate-x-0'
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Screen Footer */}
            <div className="mt-auto text-persona-white font-mono text-sm opacity-50 text-center">
              Select an option
            </div>
            
            {/* Screen Glare */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white to-transparent opacity-10 pointer-events-none transform rotate-45 scale-150 translate-x-1/4 -translate-y-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
