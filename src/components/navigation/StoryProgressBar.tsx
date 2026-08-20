import React from 'react';
import { SCENES } from '../../data/scenes';

interface StoryProgressBarProps {
  currentSceneIndex: number;
  onSceneSelect?: (index: number) => void;
}

export const StoryProgressBar: React.FC<StoryProgressBarProps> = ({
  currentSceneIndex,
  onSceneSelect,
}) => {
  const isDarkScene = currentSceneIndex === 4;

  return (
    <nav
      aria-label="Story progress"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-3 pointer-events-auto"
    >
      <div
        className={`flex flex-col gap-3 py-3 px-2 rounded-full backdrop-blur-md border shadow-lg transition-colors duration-300 ${
          isDarkScene
            ? 'bg-navy-900/80 border-indigo-500/30'
            : 'bg-sand-50/85 border-sand-400/40'
        }`}
      >
        {SCENES.map((scene) => {
          const isActive = scene.index === currentSceneIndex;
          return (
            <button
              key={scene.id}
              onClick={() => onSceneSelect?.(scene.index)}
              aria-label={`Jump to scene ${scene.index}: ${scene.title}`}
              aria-current={isActive ? 'step' : undefined}
              className="group relative flex items-center justify-end"
            >
              {/* Dynamic Tooltip: Reads directly from scene.title */}
              <span
                className={`absolute right-7 py-1 px-2.5 rounded text-xs font-medium tracking-wide uppercase opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md border ${
                  isDarkScene
                    ? 'bg-navy-900 text-sand-50 border-indigo-400/30'
                    : 'bg-sand-50 text-ink-600 border-sand-400/40'
                }`}
              >
                0{scene.index} // {scene.title}
              </span>

              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? isDarkScene
                      ? 'w-2.5 h-6 bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                      : 'w-2.5 h-6 bg-ink-600 shadow-[0_0_6px_rgba(74,69,63,0.4)]'
                    : isDarkScene
                    ? 'w-2.5 h-2.5 bg-sand-400/30 hover:bg-sand-400/70'
                    : 'w-2.5 h-2.5 bg-sand-400/50 hover:bg-ink-600/70'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
