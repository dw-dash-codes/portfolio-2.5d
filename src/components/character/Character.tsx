import React from 'react';

interface CharacterProps {
  sceneIndex: number;
  localProgress: number; // 0 to 1 strictly clamped
  accumulatedDistance: number;
  scrollVelocity: number;
  className?: string;
}

export const Character: React.FC<CharacterProps> = ({
  sceneIndex,
  localProgress,
  accumulatedDistance,
  scrollVelocity,
  className = '',
}) => {
  const totalFrames = 12;
  const stridePx = 35; // Pixels of scroll distance per walk frame

  const isMoving = scrollVelocity > 15;
  const frameIndex = isMoving
    ? Math.floor(accumulatedDistance / stridePx) % totalFrames
    : 0;

  // Exact Storyboard Positioning & Perspective Scaling
  let xVw = 0;
  let yVh = 20;
  let scale = 0.75;

  switch (sceneIndex) {
    case 1:
      // Scene 1: Approaching house from lower left
      xVw = -28 + localProgress * 10;
      yVh = 18 - localProgress * 8;
      scale = 0.85 - localProgress * 0.15; // 0.85 -> 0.70
      break;

    case 2:
      // Scene 2: Left at the entrance door (Closest to camera)
      xVw = -26 + localProgress * 8;
      yVh = 12 - localProgress * 4;
      scale = 0.95 - localProgress * 0.07; // 0.95 -> 0.88
      break;

    case 3:
      // Scene 3: Left side holding open chamber door (left of skills deck)
      xVw = -36;
      yVh = 12 - localProgress * 2;
      scale = 0.75;
      break;

    case 4:
      // Scene 4: Right side at the indigo chamber door (right of architecture cards)
      xVw = 34;
      yVh = 12 - localProgress * 2;
      scale = 0.68; // Proportioned to room perspective
      break;

    case 5:
      // Scene 5: Centre-left floor in front of gallery plinths
      xVw = -34 + localProgress * 6;
      yVh = 18 - localProgress * 4;
      scale = 0.70 - localProgress * 0.08; // 0.70 -> 0.62
      break;

    case 6:
      // Scene 6: Small at bottom left-center contemplating destination wall
      xVw = -24;
      yVh = 22;
      scale = 0.52; // Smallest / distant perspective
      break;

    default:
      break;
  }

  return (
    <div
      id="character-actor"
      style={{
        zIndex: 30, // Above rooms (z=10-25), strictly below DOM content (z=50)
        transform: `translate3d(${xVw}vw, ${yVh}vh, 0px) scale(${scale})`,
        transition: 'transform 0.08s linear',
      }}
      className={`absolute inset-0 flex items-center justify-center pointer-events-none gpu-layer ${className}`}
    >
      {/* Single Masked Cell: Fixed width and height, overflow hidden */}
      <div className="relative w-[150px] h-[300px] sm:w-[170px] sm:h-[340px] overflow-hidden">
        <picture className="block w-full h-full">
          <source
            type="image/avif"
            srcSet="/assets/character/walk_cycle_sprite-768.avif 768w, /assets/character/walk_cycle_sprite-1280.avif 1280w, /assets/character/walk_cycle_sprite-1920.avif 1920w"
            sizes="1920px"
          />
          <source
            type="image/webp"
            srcSet="/assets/character/walk_cycle_sprite-768.webp 768w, /assets/character/walk_cycle_sprite-1280.webp 1280w, /assets/character/walk_cycle_sprite-1920.webp 1920w"
            sizes="1920px"
          />
          <img
            src="/assets/character/walk_cycle_sprite-1920.webp"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== '/assets/character/walk_cycle_sprite.png') {
                target.src = '/assets/character/walk_cycle_sprite.png';
              }
            }}
            alt="Walking Character"
            width={3840}
            height={640}
            style={{
              width: '1200%', // Exactly 12 frames wide
              height: '100%',
              maxWidth: 'none',
              transform: `translate3d(-${(frameIndex / totalFrames) * 100}%, 0, 0)`,
              objectFit: 'fill',
            }}
            className="pointer-events-none select-none max-w-none block"
          />
        </picture>
      </div>
    </div>
  );
};
