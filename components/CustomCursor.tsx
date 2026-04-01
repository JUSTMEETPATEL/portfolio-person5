'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useApp } from './AppProvider';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const { isTransitioning } = useApp();
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // Set initial position off-screen until mouse moves
    gsap.set(cursor, { xPercent: -10, yPercent: -10, autoAlpha: 0 });
    gsap.set(follower, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const xToCursor = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power3' });
    const yToCursor = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power3' });
    
    const xToFollower = gsap.quickTo(follower, 'x', { duration: 0.3, ease: 'power3' });
    const yToFollower = gsap.quickTo(follower, 'y', { duration: 0.3, ease: 'power3' });

    const onMouseMove = (e: MouseEvent) => {
      if (!hasMoved) {
        setHasMoved(true);
        gsap.to([cursor, follower], { autoAlpha: 1, duration: 0.3 });
      }
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };

    const onMouseDown = () => {
      gsap.to(cursor, { scale: 0.8, duration: 0.1 });
      gsap.to(follower, { scale: 1.5, rotation: '+=45', duration: 0.2 });
      // Change follower color to red on click
      gsap.to(follower.querySelector('polygon'), { stroke: '#e60012', fill: 'rgba(230, 0, 18, 0.2)', duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.1 });
      gsap.to(follower, { scale: 1, duration: 0.2 });
      gsap.to(follower.querySelector('polygon'), { stroke: '#ffffff', fill: 'none', duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Handle hover states on interactive elements
    const handleHoverEnter = () => {
      gsap.to(cursor, { scale: 0, duration: 0.2 });
      gsap.to(follower, { 
        scale: 1.8, 
        duration: 0.3, 
      });
      gsap.to(follower.querySelector('polygon'), { 
        stroke: '#e60012',
        fill: 'rgba(230, 0, 18, 0.2)',
        duration: 0.3 
      });
    };

    const handleHoverLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2 });
      gsap.to(follower, { 
        scale: 1, 
        duration: 0.3, 
      });
      gsap.to(follower.querySelector('polygon'), { 
        stroke: '#ffffff',
        fill: 'none',
        duration: 0.3 
      });
    };

    // Add event listeners to all interactive elements
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, input, [data-interactive="true"], .cursor-pointer');
      interactives.forEach(el => {
        // Remove old listeners to avoid duplicates
        el.removeEventListener('mouseenter', handleHoverEnter);
        el.removeEventListener('mouseleave', handleHoverLeave);
        
        el.addEventListener('mouseenter', handleHoverEnter);
        el.addEventListener('mouseleave', handleHoverLeave);
      });
    };

    // Initial addition and setup a mutation observer to add to new elements
    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      observer.disconnect();
    };
  }, [hasMoved]);

  if (isTransitioning) return null; // Hide cursor during cinematic transitions

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] opacity-0"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <path d="M2 2 L12 28 L16 18 L26 14 Z" fill="#e60012" stroke="#ffffff" strokeWidth="2" strokeLinejoin="miter" />
        </svg>
      </div>
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9998] opacity-0"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_5s_linear_infinite]">
          <polygon points="50,5 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="miter" />
        </svg>
      </div>
    </>
  );
}
