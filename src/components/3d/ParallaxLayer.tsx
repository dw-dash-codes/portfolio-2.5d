import React from 'react';
import { Layer } from '../../types/scene';
import { LayerImage } from './LayerImage';

interface ParallaxLayerProps {
  layer: Layer;
  sceneIndex: number;
  progress: number; // 0 to 1 progress within this scene
  isReducedMotion?: boolean;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  layer,
  sceneIndex,
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
      <div className="relative w-full h-full flex items-center justify-center">
        <LayerImage
          layer={layer}
          sceneIndex={sceneIndex}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
