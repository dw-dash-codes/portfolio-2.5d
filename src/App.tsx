import React, { useRef } from 'react';
import { SmoothScroll } from './components/SmoothScroll';
import { Stage } from './components/3d/Stage';
import { StoryProgressBar } from './components/navigation/StoryProgressBar';
import { DebugOverlay } from './components/dev/DebugOverlay';
import { useSceneProgress } from './hooks/useSceneProgress';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

const StoryExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    globalProgress,
    activeSceneIndex,
    scenesState,
    visibleScenes,
    scrollVelocity,
    accumulatedDistance,
    scrollToScene,
  } = useSceneProgress(containerRef);

  const isReducedMotion = usePrefersReducedMotion();
  const activeScene = scenesState.find((s) => s.index === activeSceneIndex) || scenesState[0]!;

  return (
    <div
      ref={containerRef}
      id="scroll-track"
      className="relative w-full h-[600vh] bg-sand-50"
    >
      {/* Pinned 2.5D Viewport Stage */}
      <Stage
        activeSceneIndex={activeSceneIndex}
        scenesState={scenesState}
        accumulatedDistance={accumulatedDistance}
        scrollVelocity={scrollVelocity}
        isReducedMotion={isReducedMotion}
      />

      {/* Story Progress HUD Navigator */}
      <StoryProgressBar
        currentSceneIndex={activeSceneIndex}
        onSceneSelect={scrollToScene}
      />

      {/* Dev Debug Overlay (Toggle with ` or D) */}
      <DebugOverlay
        activeSceneIndex={activeSceneIndex}
        globalProgress={globalProgress}
        localProgress={activeScene.localProgress}
        visibleScenes={visibleScenes}
        scrollVelocity={scrollVelocity}
        accumulatedDistance={accumulatedDistance}
        isReducedMotion={isReducedMotion}
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
