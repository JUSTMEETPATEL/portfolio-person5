'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useApp } from '@/components/AppProvider';
import { DialogueBox } from '@/components/DialogueBox';
import { useSound } from '@/hooks/useSound';

export function AboutScene() {
  const { navigateTo, registerTimeline } = useApp();
  const { playClick, playHover } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const dialogues = [
    { speaker: 'Education', text: 'B.Tech Computer Science at SRM Institute of Science and Technology, Chennai. CGPA: 9.635.' },
    { speaker: 'Experience', text: 'Backend Developer Intern at SAARC Masts Tech. Cut p95 read latency by 35% and enforced zero-defect deploys.' },
    { speaker: 'Experience', text: 'Backend Developer Intern at NIT Hamirpur. Cut AI microservice response time by 40% and secured multi-role platform.' },
    { speaker: 'Skills', text: 'Rust, C++20, TypeScript, Python, Node.js, FastAPI, Next.js, Docker, Terraform, AWS Lambda.' }
  ];

  useEffect(() => {
    const enterTl = gsap.timeline({ paused: true });
    const exitTl = gsap.timeline({ paused: true });

    enterTl.fromTo(wrapperRef.current,
      { yPercent: 100, rotation: 5 },
      { yPercent: 0, rotation: -2, duration: 0.6, ease: 'back.out(1.2)' }
    ).fromTo(backBtnRef.current,
      { autoAlpha: 0, scale: 0 },
      { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' },
      '-=0.2'
    );

    exitTl.to(backBtnRef.current, { autoAlpha: 0, scale: 0, duration: 0.2 })
      .to(wrapperRef.current, { yPercent: 100, rotation: 5, duration: 0.5, ease: 'power3.in' }, 0.1);

    registerTimeline('ABOUT', 'enter', enterTl);
    registerTimeline('ABOUT', 'exit', exitTl);

    enterTl.play();

    return () => {
      enterTl.kill();
      exitTl.kill();
    };
  }, [registerTimeline]);

  const handleNextDialogue = () => {
    playClick();
    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      navigateTo('STATION');
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center p-8">
      <div ref={wrapperRef} className="relative w-full max-w-4xl">
        <div className="w-full bg-persona-white text-persona-black p-8 md:p-12 jagged-box shadow-[10px_10px_0px_#e60012]">
          <h2 className="font-display text-5xl md:text-7xl mb-12 text-persona-red uppercase">
            Confidant Info
          </h2>
          
          <div className="mb-12 cursor-pointer" onClick={handleNextDialogue} onMouseEnter={playHover}>
            <DialogueBox 
              key={dialogueIndex} // Force re-mount to re-trigger animation
              speaker={dialogues[dialogueIndex].speaker} 
              text={dialogues[dialogueIndex].text} 
            />
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
          className="absolute -bottom-6 -right-6 bg-persona-black text-persona-white font-display text-3xl px-8 py-4 hover:bg-persona-red hover:scale-110 transition-all duration-200 z-10"
          style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
