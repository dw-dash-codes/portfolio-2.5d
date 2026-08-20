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
  // 12 frames in sprite sheet (0 to 11)
  const totalFrames = 12;
  // Step through walk frames when in motion; snap to neutral frame 0 when resting
  const frameIndex = isWalking
    ? Math.floor(sceneProgress * 36) % totalFrames
    : 0;

  // Spatial trajectory per scene (scale and screen position)
  let xPercent = 0;
  let yPercent = 15;
  let scale = 0.85;

  switch (sceneIndex) {
    case 1:
      // Approach entrance from lower left-center
      xPercent = -16 + sceneProgress * 12;
      yPercent = 20 - sceneProgress * 12;
      scale = 0.95 - sceneProgress * 0.22;
      break;
    case 2:
      // Push door and step through
      xPercent = -20 + sceneProgress * 14;
      yPercent = 14 - sceneProgress * 8;
      scale = 0.8 - sceneProgress * 0.1;
      break;
    case 3:
      // Left side holding open room door
      xPercent = -30;
      yPercent = 10 - sceneProgress * 4;
      scale = 0.78;
      break;
    case 4:
      // Right side opening tech chamber door
      xPercent = 26;
      yPercent = 10 - sceneProgress * 4;
      scale = 0.78;
      break;
    case 5:
      // Walking center-left into gallery
      xPercent = -14 + sceneProgress * 10;
      yPercent = 14 - sceneProgress * 8;
      scale = 0.78 - sceneProgress * 0.1;
      break;
    case 6:
      // Standing at bottom center destination
      xPercent = 0;
      yPercent = 20;
      scale = 0.72;
      break;
    default:
      break;
  }

  return (
    <div
      id="character-controller"
      style={{
        transform: `translate3d(${xPercent}vw, ${yPercent}vh, 0) scale(${scale})`,
        transition: 'transform 0.1s ease-out',
        zIndex: 35,
      }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none gpu-layer"
    >
      {/* Masked single frame: fixed width & height cell with overflow hidden */}
      <div className="relative w-[150px] h-[300px] sm:w-[170px] sm:h-[340px] overflow-hidden">
        <picture className="block w-[1200%] h-full max-w-none">
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
              transform: `translate3d(-${(frameIndex / totalFrames) * 100}%, 0, 0)`,
              width: '1200%',
              height: '100%',
              objectFit: 'cover',
            }}
            className="pointer-events-none select-none"
          />
        </picture>
      </div>
    </div>
  );
};
