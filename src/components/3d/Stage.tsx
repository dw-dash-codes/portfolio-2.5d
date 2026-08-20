import React from 'react';
import { SCENES } from '../../data/scenes';
import { Scene } from './Scene';
import { Character } from '../character/Character';
import { SceneState } from '../../hooks/useSceneProgress';

import { HeroOverlay } from '../dom-content/HeroOverlay';
import { ThresholdPrompt } from '../dom-content/ThresholdPrompt';
import { FullStackDeck } from '../dom-content/FullStackDeck';
import { ArchitectureDiagram } from '../dom-content/ArchitectureDiagram';
import { GalleryShowcase } from '../dom-content/GalleryShowcase';
import { ContactWall } from '../dom-content/ContactWall';

interface StageProps {
  activeSceneIndex: number;
  scenesState: SceneState[];
  accumulatedDistance: number;
  scrollVelocity: number;
  isReducedMotion?: boolean;
}

export const Stage: React.FC<StageProps> = ({
  activeSceneIndex,
  scenesState,
  accumulatedDistance,
  scrollVelocity,
  isReducedMotion = false,
}) => {
  const activeSceneState =
    scenesState.find((s) => s.index === activeSceneIndex) || scenesState[0]!;

  const isDarkScene = activeSceneIndex === 4;

  return (
    <div
      id="viewport-stage"
      style={{
        perspective: isReducedMotion ? 'none' : '1200px',
        perspectiveOrigin: '50% 50%',
      }}
      className={`fixed inset-0 w-screen h-screen overflow-hidden select-none preserve-3d transition-colors duration-700 ${
        isDarkScene ? 'bg-navy-900 text-sand-50' : 'bg-sand-50 text-ink-600'
      }`}
    >
      {/* Dynamic Ambient Horizon Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-40"
        style={{
          background: isDarkScene
            ? 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 35%, rgba(245, 239, 235, 0.8) 0%, transparent 60%)',
        }}
      />

      {/* Render All 6 2.5D Scenes with Strict Visibility Gating & Dynamic Stacking */}
      {SCENES.map((scene) => {
        const state = scenesState.find((s) => s.index === scene.index) || {
          index: scene.index,
          id: scene.id,
          localProgress: 0,
          opacity: 0,
          isVisible: false,
          zIndex: 0,
        };

        return (
          <Scene
            key={scene.id}
            scene={scene}
            localProgress={state.localProgress}
            sceneOpacity={state.opacity}
            isVisible={state.isVisible}
            zIndex={state.zIndex}
            isReducedMotion={isReducedMotion}
          />
        );
      })}

      {/* Character Actor (z-index 30: above room/doors z=10-25, below DOM content z=50) */}
      <Character
        sceneIndex={activeSceneIndex}
        localProgress={activeSceneState.localProgress}
        accumulatedDistance={accumulatedDistance}
        scrollVelocity={scrollVelocity}
      />

      {/* Real DOM / HTML Overlays (z-index 50) */}
      <div style={{ zIndex: 50 }} className="absolute inset-0 pointer-events-none">
        {scenesState.map((state) => {
          if (!state.isVisible && !isReducedMotion) return null;

          const p = state.localProgress;
          const op = isReducedMotion ? 1 : state.opacity;

          return (
            <div
              key={`dom-${state.index}`}
              style={{
                opacity: op,
                visibility: state.isVisible || isReducedMotion ? 'visible' : 'hidden',
                pointerEvents: state.isVisible ? 'auto' : 'none',
              }}
              className="absolute inset-0 transition-opacity duration-150"
            >
              {state.index === 1 && <HeroOverlay opacity={1 - p * 1.5} />}
              {state.index === 2 && <ThresholdPrompt opacity={Math.min(1, p * 2)} />}
              {state.index === 3 && <FullStackDeck opacity={Math.min(1, p * 1.8)} />}
              {state.index === 4 && <ArchitectureDiagram opacity={Math.min(1, p * 1.8)} />}
              {state.index === 5 && <GalleryShowcase opacity={Math.min(1, p * 1.8)} />}
              {state.index === 6 && <ContactWall opacity={Math.min(1, p * 1.8)} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
