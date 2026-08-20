import React from 'react';
import { Layer } from '../../types/scene';

interface ParallaxLayerProps {
  layer: Layer;
  progress: number; // 0 to 1 progress within this scene
  isReducedMotion?: boolean;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  layer,
  progress,
  isReducedMotion = false,
}) => {
  // Interpolate values based on scene progress
  const [startX, endX] = layer.parallax.xRange;
  const [startY, endY] = layer.parallax.yRange;
  const [startScale, endScale] = layer.scaleRange;
  const [startOpacity, endOpacity] = layer.opacityRange;

  const currentX = isReducedMotion ? 0 : startX + (endX - startX) * progress;
  const currentY = isReducedMotion ? 0 : startY + (endY - startY) * progress;
  const currentScale = isReducedMotion ? 1 : startScale + (endScale - startScale) * progress;
  const currentOpacity = startOpacity + (endOpacity - startOpacity) * progress;

  return (
    <div
      id={`layer-${layer.id}`}
      style={{
        zIndex: layer.zIndex,
        opacity: Math.max(0, Math.min(1, currentOpacity)),
        transform: `translate3d(${currentX}%, ${currentY}%, 0px) scale3d(${currentScale}, ${currentScale}, 1)`,
        transformOrigin: layer.transformOrigin || 'center center',
        ...layer.customStyle,
      }}
      className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none gpu-layer"
    >
      {/* Visual representation / background plate */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Placeholder architectural visual frame matching depth and theme */}
        <div
          className={`w-full h-full transition-opacity duration-300 ${
            layer.isCutout ? 'bg-transparent' : 'bg-navy-900/90'
          }`}
        >
          {/* Subtle architectural atmosphere grid pattern */}
          <div
            className="w-full h-full opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(203, 191, 171, 0.15) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      </div>
    </div>
  );
};
