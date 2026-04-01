'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useApp } from '@/components/AppProvider';
import { useSound } from '@/hooks/useSound';

const projects = [
  { 
    title: 'ZIT', 
    subtitle: 'AI-Powered Terminal Git Assistant',
    desc: 'Full Git workflow in a single Rust TUI with non-blocking AI calls. End-to-end GitHub integration via OAuth device flow.', 
    tech: 'Rust, ratatui, AWS Lambda, Bedrock',
    color: '#e60012' 
  },
  { 
    title: 'PRAKSHAT', 
    subtitle: 'AI Air Quality Forecasting',
    desc: 'Microservices backend on Azure with Docker and Terraform. Slashed latency from 2.27s to 47ms.', 
    tech: 'Azure, Docker, Terraform, Microservices',
    color: '#222222' 
  },
];

export function ProjectsScene() {
  const { navigateTo, registerTimeline } = useApp();
  const { playClick, playHover } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const fgRef1 = useRef<HTMLDivElement>(null);
  const fgRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const enterTl = gsap.timeline({ paused: true });
    const exitTl = gsap.timeline({ paused: true });

    enterTl.fromTo(cardsRef.current,
      { x: window.innerWidth, skewX: -20, autoAlpha: 0 },
      { x: 0, skewX: 0, autoAlpha: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out' }
    ).fromTo(backBtnRef.current,
      { autoAlpha: 0, x: -50 },
      { autoAlpha: 1, x: 0, duration: 0.4, ease: 'back.out(1.5)' },
      '-=0.2'
    ).fromTo([fgRef1.current, fgRef2.current],
      { scale: 0, autoAlpha: 0, rotation: 180 },
      { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.2)' },
      0
    );

    exitTl.to(cardsRef.current, {
      x: -window.innerWidth, skewX: 20, autoAlpha: 0, duration: 0.5, stagger: 0.1, ease: 'power3.in'
    }).to(backBtnRef.current, {
      autoAlpha: 0, x: -50, duration: 0.3
    }, 0).to([fgRef1.current, fgRef2.current], {
      scale: 0, autoAlpha: 0, rotation: -180, duration: 0.5
    }, 0);

    registerTimeline('PROJECTS', 'enter', enterTl);
    registerTimeline('PROJECTS', 'exit', exitTl);

    enterTl.play();

    // Foreground parallax
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 100;
      const y = (e.clientY / window.innerHeight - 0.5) * 100;
      
      gsap.to(fgRef1.current, { x: x * 1.5, y: y * 1.5, duration: 1, ease: 'power2.out' });
      gsap.to(fgRef2.current, { x: -x * 2, y: -y * 2, duration: 1, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      enterTl.kill();
      exitTl.kill();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [registerTimeline]);

  return (
    <div ref={containerRef} className="absolute inset-0 flex flex-col items-center justify-center p-8">
      {/* Foreground Parallax Elements */}
      <div 
        ref={fgRef1}
        className="absolute top-20 right-20 w-64 h-64 bg-persona-red opacity-80 mix-blend-multiply pointer-events-none z-20"
        style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
      />
      <div 
        ref={fgRef2}
        className="absolute bottom-20 left-20 w-48 h-48 bg-persona-white opacity-20 mix-blend-overlay pointer-events-none z-20"
        style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}
      />

      <h2 className="absolute top-10 left-10 font-display text-6xl text-persona-white uppercase tracking-tighter z-10" style={{ textShadow: '3px 3px 0px #e60012' }}>
        MISSIONS
      </h2>

      <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl mt-20 z-10">
        {projects.map((project, index) => (
          <div
            key={project.title}
            ref={el => { cardsRef.current[index] = el; }}
            onClick={playClick}
            onMouseEnter={playHover}
            className="group relative w-full md:w-[30%] aspect-[3/4] bg-persona-white text-persona-black p-6 flex flex-col justify-between transition-transform duration-300 hover:scale-105 hover:-translate-y-4 hover:rotate-2 cursor-pointer"
            style={{ clipPath: 'polygon(0 0, 100% 5%, 95% 100%, 5% 95%)' }}
            data-interactive="true"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: project.color }} />
            
            <div>
              <div className="w-12 h-12 mb-4 bg-persona-black" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
              <h3 className="font-display text-4xl uppercase leading-none mb-1">{project.title}</h3>
              <h4 className="font-mono text-sm font-bold text-persona-red mb-4 uppercase">{project.subtitle}</h4>
              <p className="font-mono text-sm text-persona-gray mb-4">{project.desc}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.split(', ').map(t => (
                  <span key={t} className="bg-persona-black text-persona-white font-mono text-[10px] px-2 py-1 uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="font-display text-2xl text-persona-red uppercase self-end group-hover:scale-110 transition-transform">
              View
            </div>
          </div>
        ))}
      </div>

      <button
        ref={backBtnRef}
        onClick={() => {
          playClick();
          navigateTo('STATION');
        }}
        onMouseEnter={playHover}
        data-interactive="true"
        className="absolute bottom-10 left-10 bg-persona-white text-persona-black font-display text-3xl px-8 py-4 hover:bg-persona-red hover:text-persona-white hover:scale-110 transition-all duration-200 -rotate-3 z-10"
        style={{ clipPath: 'polygon(0 0, 90% 0, 100% 100%, 10% 100%)' }}
      >
        BACK
      </button>
    </div>
  );
}
