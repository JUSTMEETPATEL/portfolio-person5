'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

type SceneState = 'INTRO' | 'STATION' | 'MENU' | 'ABOUT' | 'PROJECTS' | 'CONTACT';

interface AppContextType {
  currentScene: SceneState;
  nextScene: SceneState | null;
  isTransitioning: boolean;
  navigateTo: (scene: SceneState) => void;
  completeTransition: () => void;
  registerTimeline: (scene: SceneState, type: 'enter' | 'exit', tl: gsap.core.Timeline) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentScene, setCurrentScene] = useState<SceneState>('INTRO');
  const [nextScene, setNextScene] = useState<SceneState | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Store timelines for each scene
  const timelines = useRef<Record<SceneState, { enter?: gsap.core.Timeline; exit?: gsap.core.Timeline }>>({
    INTRO: {},
    STATION: {},
    MENU: {},
    ABOUT: {},
    PROJECTS: {},
    CONTACT: {},
  });

  const registerTimeline = (scene: SceneState, type: 'enter' | 'exit', tl: gsap.core.Timeline) => {
    timelines.current[scene][type] = tl;
  };

  const navigateTo = (scene: SceneState) => {
    if (isTransitioning || scene === currentScene) return;
    
    setIsTransitioning(true);
    setNextScene(scene);

    // Play exit timeline of current scene if it exists
    const exitTl = timelines.current[currentScene]?.exit;
    if (exitTl) {
      exitTl.restart();
    } else {
      // If no exit timeline, just proceed to transition overlay
      // The TransitionOverlay component will listen to isTransitioning and nextScene
    }
  };

  const completeTransition = () => {
    if (nextScene) {
      setCurrentScene(nextScene);
      setNextScene(null);
      setIsTransitioning(false);
      
      // The new scene will mount and play its enter timeline automatically
      // or we can trigger it here if it's already mounted.
      // Usually, conditional rendering based on currentScene is easier.
    }
  };

  return (
    <AppContext.Provider value={{ currentScene, nextScene, isTransitioning, navigateTo, completeTransition, registerTimeline }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
