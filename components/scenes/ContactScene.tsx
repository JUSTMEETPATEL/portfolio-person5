'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useApp } from '@/components/AppProvider';
import { useSound } from '@/hooks/useSound';

export function ContactScene() {
  const { navigateTo, registerTimeline } = useApp();
  const { playClick, playHover } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const enterTl = gsap.timeline({ paused: true });
    const exitTl = gsap.timeline({ paused: true });

    enterTl.fromTo(formRef.current,
      { scale: 0, rotation: 180, autoAlpha: 0 },
      { scale: 1, rotation: -2, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.2)' }
    ).fromTo(backBtnRef.current,
      { autoAlpha: 0, y: 50 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: 'back.out(2)' },
      '-=0.3'
    );

    exitTl.to(formRef.current, {
      scale: 0, rotation: -180, autoAlpha: 0, duration: 0.5, ease: 'power3.in'
    }).to(backBtnRef.current, {
      autoAlpha: 0, y: 50, duration: 0.3
    }, 0);

    registerTimeline('CONTACT', 'enter', enterTl);
    registerTimeline('CONTACT', 'exit', exitTl);

    enterTl.play();

    return () => {
      enterTl.kill();
      exitTl.kill();
    };
  }, [registerTimeline]);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center p-8">
      <div 
        ref={formRef}
        className="relative w-full max-w-2xl bg-persona-red text-persona-white p-8 md:p-12 shadow-[15px_15px_0px_#000000]"
        style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
      >
        <h2 className="font-display text-6xl md:text-8xl mb-8 uppercase tracking-tighter text-persona-black" style={{ textShadow: '2px 2px 0px #ffffff' }}>
          CALLING CARD
        </h2>
        
        <div className="flex flex-col gap-6 font-mono">
          <div className="flex flex-col">
            <label className="text-xl font-bold mb-2 uppercase text-persona-black">Email</label>
            <a href="mailto:justmeetpatel@gmail.com" className="bg-persona-black text-persona-white p-4 uppercase hover:bg-persona-white hover:text-persona-red transition-colors" style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }} data-interactive="true" onMouseEnter={playHover}>
              justmeetpatel@gmail.com
            </a>
          </div>
          <div className="flex flex-col">
            <label className="text-xl font-bold mb-2 uppercase text-persona-black">Links</label>
            <div className="flex flex-col gap-2">
              <a href="https://linkedin.com/in/meetpatel011" target="_blank" rel="noreferrer" className="bg-persona-black text-persona-white p-4 uppercase hover:bg-persona-white hover:text-persona-red transition-colors" style={{ clipPath: 'polygon(2% 0, 98% 0, 100% 100%, 0% 100%)' }} data-interactive="true" onMouseEnter={playHover}>
                LinkedIn
              </a>
              <a href="https://github.com/JUSTMEETPATEL" target="_blank" rel="noreferrer" className="bg-persona-black text-persona-white p-4 uppercase hover:bg-persona-white hover:text-persona-red transition-colors" style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }} data-interactive="true" onMouseEnter={playHover}>
                GitHub
              </a>
              <a href="https://meetpatel.tech" target="_blank" rel="noreferrer" className="bg-persona-black text-persona-white p-4 uppercase hover:bg-persona-white hover:text-persona-red transition-colors" style={{ clipPath: 'polygon(2% 0, 98% 0, 100% 100%, 0% 100%)' }} data-interactive="true" onMouseEnter={playHover}>
                Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>

      <button
        ref={backBtnRef}
        onClick={() => {
          playClick();
          navigateTo('STATION');
        }}
        onMouseEnter={playHover}
        data-interactive="true"
        className="absolute top-10 right-10 bg-persona-white text-persona-black font-display text-3xl px-8 py-4 hover:bg-persona-red hover:text-persona-white hover:scale-110 transition-all duration-200 rotate-3"
        style={{ clipPath: 'polygon(0 0, 90% 0, 100% 100%, 10% 100%)' }}
      >
        BACK
      </button>
    </div>
  );
}
