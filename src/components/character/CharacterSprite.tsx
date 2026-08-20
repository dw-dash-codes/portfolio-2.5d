import React from 'react';

interface CharacterSpriteProps {
  sceneIndex: number;
  sceneProgress: number; // 0 to 1
  isWalking?: boolean;
}

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  sceneIndex,
  sceneProgress,
  isWalking = false,
}) => {
  // Calculate spatial positioning based on current scene and progress
  let xPercent = -10;
  let yPercent = 20;
  let scale = 1.0;

  switch (sceneIndex) {
    case 1:
      // Approach entrance from left-center
      xPercent = -15 + sceneProgress * 10;
      yPercent = 25 - sceneProgress * 15;
      scale = 1.0 - sceneProgress * 0.25;
      break;
    case 2:
      // Push door and step through
      xPercent = -20 + sceneProgress * 15;
      yPercent = 15 - sceneProgress * 10;
      scale = 0.85 - sceneProgress * 0.1;
      break;
    case 3:
      // Left side holding room door
      xPercent = -32;
      yPercent = 10 - sceneProgress * 5;
      scale = 0.8;
      break;
    case 4:
      // Right side opening tech chamber door
      xPercent = 28;
      yPercent = 10 - sceneProgress * 4;
      scale = 0.8;
      break;
    case 5:
      // Walking center-left into gallery
      xPercent = -15 + sceneProgress * 12;
      yPercent = 15 - sceneProgress * 8;
      scale = 0.8 - sceneProgress * 0.1;
      break;
    case 6:
      // Standing at bottom center destination
      xPercent = 0;
      yPercent = 22;
      scale = 0.75;
      break;
    default:
      break;
  }

  return (
    <div
      style={{
        transform: `translate3d(${xPercent}vw, ${yPercent}vh, 0) scale(${scale})`,
        transition: 'transform 0.15s ease-out',
      }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 gpu-layer"
    >
      {/* Stylized Architectural Character Figure */}
      <div className="relative flex flex-col items-center">
        {/* Head */}
        <div className="w-5 h-6 rounded-full bg-sand-400/90 shadow-md" />
        {/* Torso / Jacket */}
        <div className="w-9 h-14 rounded-t-md bg-navy-800 border-t border-sand-400/30 shadow-lg relative flex justify-center">
          {/* Subtle back shoulder seams */}
          <div className="w-6 h-px bg-sand-400/20 mt-3" />
        </div>
        {/* Legs / Trousers */}
        <div className="flex gap-1 -mt-0.5">
          <div
            className={`w-3.5 h-16 bg-ink-600 rounded-b-sm transition-transform duration-200 ${
              isWalking ? 'animate-pulse' : ''
            }`}
          />
          <div
            className={`w-3.5 h-16 bg-ink-600 rounded-b-sm transition-transform duration-200 ${
              isWalking ? 'animate-pulse' : ''
            }`}
          />
        </div>
        {/* Shoes */}
        <div className="flex gap-2 -mt-1">
          <div className="w-4 h-2 bg-sand-50 rounded-sm shadow-sm" />
          <div className="w-4 h-2 bg-sand-50 rounded-sm shadow-sm" />
        </div>
      </div>
    </div>
  );
};
