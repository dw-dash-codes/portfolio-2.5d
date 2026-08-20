import React from 'react';
import { SCENES_CONFIG } from '../../config/scenes';
import { ParallaxLayer } from './ParallaxLayer';
import { Door3D } from './Door3D';
import { CharacterSprite } from '../character/CharacterSprite';
import { HeroOverlay } from '../dom-content/HeroOverlay';
import { ThresholdPrompt } from '../dom-content/ThresholdPrompt';
import { FullStackDeck } from '../dom-content/FullStackDeck';
import { ArchitectureDiagram } from '../dom-content/ArchitectureDiagram';
import { GalleryShowcase } from '../dom-content/GalleryShowcase';
import { ContactWall } from '../dom-content/ContactWall';

interface PerspectiveStageProps {
  currentSceneIndex: number;
  sceneProgress: number; // 0 to 1 inside current scene
  isReducedMotion?: boolean;
}

export const PerspectiveStage: React.FC<PerspectiveStageProps> = ({
  currentSceneIndex,
  sceneProgress,
  isReducedMotion = false,
}) => {
  const currentScene = SCENES_CONFIG.find((s) => s.index === currentSceneIndex) || SCENES_CONFIG[0]!;

  return (
    <div
      id="viewport-stage"
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-navy-900 select-none preserve-3d"
    >
      {/* Dynamic Scene Ambient Glow / Horizon Lighting */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-30"
        style={{
          background:
            currentSceneIndex === 4
              ? 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.25) 0%, transparent 70%)'
              : 'radial-gradient(circle at 50% 40%, rgba(230, 223, 210, 0.15) 0%, transparent 60%)',
        }}
      />

      {/* Render Current Scene Parallax Depth Layers */}
      {currentScene.layers.map((layer) => (
        <ParallaxLayer
          key={`${currentScene.id}-${layer.id}`}
          layer={layer}
          progress={sceneProgress}
          isReducedMotion={isReducedMotion}
        />
      ))}

      {/* 3D Doors */}
      <Door3D type={currentScene.doorType} progress={sceneProgress} />

      {/* Walking Character */}
      <CharacterSprite
        sceneIndex={currentSceneIndex}
        sceneProgress={sceneProgress}
        isWalking={sceneProgress > 0.02 && sceneProgress < 0.98}
      />

      {/* Real DOM / HTML Overlay per Scene */}
      {currentSceneIndex === 1 && <HeroOverlay opacity={1 - sceneProgress * 1.5} />}
      {currentSceneIndex === 2 && <ThresholdPrompt opacity={Math.min(1, sceneProgress * 2)} />}
      {currentSceneIndex === 3 && <FullStackDeck opacity={Math.min(1, sceneProgress * 1.8)} />}
      {currentSceneIndex === 4 && <ArchitectureDiagram opacity={Math.min(1, sceneProgress * 1.8)} />}
      {currentSceneIndex === 5 && <GalleryShowcase opacity={Math.min(1, sceneProgress * 1.8)} />}
      {currentSceneIndex === 6 && <ContactWall opacity={Math.min(1, sceneProgress * 1.8)} />}
    </div>
  );
};
