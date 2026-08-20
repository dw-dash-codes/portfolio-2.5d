import React from 'react';
import { SCENES_CONFIG } from '../../config/scenes';

interface StoryProgressBarProps {
  currentSceneIndex: number;
  onSceneSelect?: (index: number) => void;
}

export const StoryProgressBar: React.FC<StoryProgressBarProps> = ({
  currentSceneIndex,
  onSceneSelect,
}) => {
  return (
    <nav
      aria-label="Story progress"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-3 pointer-events-auto"
    >
      <div className="flex flex-col gap-3 py-3 px-2 rounded-full bg-navy-900/60 backdrop-blur-md border border-sand-400/20 shadow-lg">
        {SCENES_CONFIG.map((scene) => {
          const isActive = scene.index === currentSceneIndex;
          return (
            <button
              key={scene.id}
              onClick={() => onSceneSelect?.(scene.index)}
              aria-label={`Jump to scene ${scene.index}: ${scene.title}`}
              aria-current={isActive ? 'step' : undefined}
              className="group relative flex items-center justify-end"
            >
              {/* Tooltip */}
              <span className="absolute right-7 py-1 px-2.5 rounded bg-navy-900/90 text-sand-50 border border-sand-400/20 text-xs font-medium tracking-wide uppercase opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
                {scene.index.toString().padStart(2, '0')} // {scene.title}
              </span>

              {/* Dot indicator */}
              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-2.5 h-6 bg-sand-200 shadow-[0_0_8px_rgba(203,191,171,0.6)]'
                    : 'w-2.5 h-2.5 bg-sand-400/30 hover:bg-sand-400/70'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
