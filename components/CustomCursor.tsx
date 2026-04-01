'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useApp } from './AppProvider';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const { isTransitioning } = useApp();

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // Set initial position
    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

    const xToCursor = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power3' });
    const yToCursor = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power3' });
    
    const xToFollower = gsap.quickTo(follower, 'x', { duration: 0.3, ease: 'power3' });
    const yToFollower = gsap.quickTo(follower, 'y', { duration: 0.3, ease: 'power3' });

    const onMouseMove = (e: MouseEvent) => {
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };

    const onMouseDown = () => {
      gsap.to(cursor, { scale: 0.5, duration: 0.1 });
      gsap.to(follower, { scale: 1.5, duration: 0.2, backgroundColor: 'rgba(230, 0, 18, 0.2)' });
    };

    const onMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.1 });
      gsap.to(follower, { scale: 1, duration: 0.2, backgroundColor: 'transparent' });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Handle hover states on interactive elements
    const handleHoverEnter = () => {
      gsap.to(cursor, { scale: 0, duration: 0.2 });
      gsap.to(follower, { 
        scale: 2, 
        duration: 0.3, 
        borderColor: '#e60012',
        backgroundColor: 'rgba(230, 0, 18, 0.1)',
        mixBlendMode: 'difference'
      });
    };

    const handleHoverLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2 });
      gsap.to(follower, { 
        scale: 1, 
        duration: 0.3, 
        borderColor: '#ffffff',
        backgroundColor: 'transparent',
        mixBlendMode: 'normal'
      });
    };

    // Add event listeners to all interactive elements
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, input, [data-interactive="true"]');
      interactives.forEach(el => {
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
  }, []);

  if (isTransitioning) return null; // Hide cursor during cinematic transitions

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-persona-red rounded-full pointer-events-none z-[9999] mix-blend-difference"
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-8 h-8 border-2 border-persona-white rounded-full pointer-events-none z-[9998] transition-colors duration-200"
      />
    </>
  );
}
