'use client';

import { useApp } from '@/components/AppProvider';
import { IntroScene } from '@/components/scenes/IntroScene';
import { StationScene } from '@/components/scenes/StationScene';
import { AboutScene } from '@/components/scenes/AboutScene';
import { ProjectsScene } from '@/components/scenes/ProjectsScene';
import { ContactScene } from '@/components/scenes/ContactScene';

export default function Home() {
  const { currentScene } = useApp();

  return (
    <>
      {currentScene === 'INTRO' && <IntroScene />}
      {currentScene === 'STATION' && <StationScene />}
      {currentScene === 'ABOUT' && <AboutScene />}
      {currentScene === 'PROJECTS' && <ProjectsScene />}
      {currentScene === 'CONTACT' && <ContactScene />}
    </>
  );
}
