import React, { useRef } from 'react';
import { SmoothScroll } from './components/SmoothScroll';
import { PerspectiveStage } from './components/3d/PerspectiveStage';
import { StoryProgressBar } from './components/navigation/StoryProgressBar';
import { useScrollMaster } from './hooks/useScrollMaster';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

const StoryExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentSceneIndex, sceneProgress, scrollToScene } = useScrollMaster(containerRef);
  const isReducedMotion = usePrefersReducedMotion();

  return (
    <div ref={containerRef} id="scroll-track" className="relative w-full h-[600vh] bg-navy-900">
      {/* 2.5D Viewport Stage */}
      <PerspectiveStage
        currentSceneIndex={currentSceneIndex}
        sceneProgress={sceneProgress}
        isReducedMotion={isReducedMotion}
      />

      {/* Story Progress HUD */}
      <StoryProgressBar
        currentSceneIndex={currentSceneIndex}
        onSceneSelect={scrollToScene}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SmoothScroll>
      <StoryExperience />
    </SmoothScroll>
  );
};

export default App;
