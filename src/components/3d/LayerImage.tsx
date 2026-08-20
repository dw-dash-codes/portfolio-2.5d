import React from 'react';
import { Layer } from '../../types/scene';

interface LayerImageProps {
  layer: Layer;
  sceneIndex: number;
  className?: string;
}

export const LayerImage: React.FC<LayerImageProps> = ({
  layer,
  sceneIndex,
  className = '',
}) => {
  const isEager = sceneIndex === 1;
  const { width, height } = layer.dimensions;

  // Responsive srcset paths for AVIF and WebP across 768, 1280, 1920 breakpoints
  const avifSrcSet = `${layer.src}-768.avif 768w, ${layer.src}-1280.avif 1280w, ${layer.src}-1920.avif 1920w`;
  const webpSrcSet = `${layer.src}-768.webp 768w, ${layer.src}-1280.webp 1280w, ${layer.src}-1920.webp 1920w`;
  const fallbackSrc = `${layer.src}.png`;
  const defaultWebp = `${layer.src}-1920.webp`;

  return (
    <picture className={`block w-full h-full ${className}`}>
      {/* Modern AVIF responsive source */}
      <source
        type="image/avif"
        srcSet={avifSrcSet}
        sizes="(max-width: 768px) 768px, (max-width: 1280px) 1280px, 1920px"
      />
      {/* Universal WebP responsive source */}
      <source
        type="image/webp"
        srcSet={webpSrcSet}
        sizes="(max-width: 768px) 768px, (max-width: 1280px) 1280px, 1920px"
      />
      {/* Img fallback with explicit dimensions and priority loading */}
      <img
        src={defaultWebp}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== fallbackSrc) {
            target.src = fallbackSrc;
          }
        }}
        alt={layer.name}
        width={width}
        height={height}
        loading={isEager ? 'eager' : 'lazy'}
        decoding={isEager ? 'sync' : 'async'}
        className="w-full h-full object-contain pointer-events-none select-none"
        style={{
          contentVisibility: isEager ? 'visible' : 'auto',
        }}
      />
    </picture>
  );
};
