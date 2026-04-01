'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useApp } from '@/components/AppProvider';
import { useSound } from '@/hooks/useSound';

export function MenuScene() {
  const { navigateTo, registerTimeline } = useApp();
  const { playHover, playClick } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems = [
    { label: 'ABOUT ME', scene: 'ABOUT' as const },
    { label: 'PROJECTS', scene: 'PROJECTS' as const },
    { label: 'CONTACT', scene: 'CONTACT' as const },
  ];

  useEffect(() => {
    const enterTl = gsap.timeline({ paused: true });
    const exitTl = gsap.timeline({ paused: true });

    // Enter Animation
    enterTl.fromTo(titleRef.current, 
      { x: -100, autoAlpha: 0, skewX: -20 },
      { x: 0, autoAlpha: 1, skewX: 0, duration: 0.6, ease: 'back.out(1.5)' }
    ).fromTo(menuItemsRef.current,
      { x: -50, autoAlpha: 0, skewX: -10 },
      { x: 0, autoAlpha: 1, skewX: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
      '-=0.4'
    ).fromTo(avatarRef.current,
      { x: 100, autoAlpha: 0, skewX: 20 },
      { x: 0, autoAlpha: 1, skewX: 0, duration: 0.6, ease: 'back.out(1.2)' },
      '-=0.4'
    );

    // Exit Animation
    exitTl.to(menuItemsRef.current, {
      x: 50, autoAlpha: 0, skewX: 10, duration: 0.3, stagger: 0.05, ease: 'power2.in'
    }).to(titleRef.current, {
      x: 100, autoAlpha: 0, skewX: 20, duration: 0.4, ease: 'power2.in'
    }, '-=0.2').to(avatarRef.current, {
      x: -100, autoAlpha: 0, skewX: -20, duration: 0.4, ease: 'power2.in'
    }, '-=0.3');

    registerTimeline('MENU', 'enter', enterTl);
    registerTimeline('MENU', 'exit', exitTl);

    // Play enter immediately on mount
    enterTl.play();

    return () => {
      enterTl.kill();
      exitTl.kill();
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

  // Avatar reaction to selection
  useEffect(() => {
    if (avatarRef.current) {
      gsap.fromTo(avatarRef.current, 
        { scale: 1.05, filter: 'brightness(1.5)' },
        { scale: 1, filter: 'brightness(1)', duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [selectedIndex]);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-between px-[10vw]">
      <div className="flex flex-col items-start z-10">
        <h1 
          ref={titleRef} 
          className="font-display text-7xl md:text-9xl text-persona-white uppercase tracking-tighter mb-12 glitch-text"
          data-text="PORTFOLIO"
          style={{ textShadow: '4px 4px 0px #e60012' }}
        >
          PORTFOLIO
        </h1>
        
        <div className="flex flex-col items-start gap-4">
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
                className={`group relative font-display text-4xl md:text-6xl px-6 py-2 uppercase tracking-tight overflow-hidden transition-transform origin-left ${
                  isSelected 
                    ? 'text-persona-white scale-110 -rotate-2 bg-persona-red' 
                    : 'text-persona-black bg-persona-white hover:scale-110 hover:-rotate-2'
                }`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}
              >
                <span className="relative z-10 transition-colors duration-200">
                  {item.label}
                </span>
                <div className={`absolute inset-0 bg-persona-red transition-transform duration-300 ease-out z-0 ${
                  isSelected ? 'translate-x-0' : 'translate-x-[-101%] group-hover:translate-x-0'
                }`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Avatar Panel */}
      <div 
        ref={avatarRef}
        className="relative hidden md:block w-1/3 aspect-[3/4] bg-persona-red z-0"
        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}
      >
        <div className="absolute inset-2 bg-persona-black" style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}>
          {/* Placeholder for character art */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-1/2 h-1/2 text-persona-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          {/* Dynamic text based on selection */}
          <div className="absolute bottom-10 left-10 font-display text-4xl text-persona-white uppercase -rotate-12">
            {menuItems[selectedIndex].label}
          </div>
        </div>
      </div>
    </div>
  );
}
