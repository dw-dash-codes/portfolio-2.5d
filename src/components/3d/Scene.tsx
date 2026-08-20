import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Scene as SceneType } from '../../types/scene';
import { LayerImage } from './LayerImage';
import { Door } from './Door';

interface SceneProps {
  scene: SceneType;
  localProgress: number; // 0 to 1 strictly clamped
  sceneOpacity: number;  // 0 to 1 with 15% crossfade
  isVisible: boolean;    // true when sceneOpacity > 0
  zIndex: number;
  isReducedMotion?: boolean;
}

type QuickSetterFn = (val: number | string) => void;

interface LayerQuickSetters {
  setTx: QuickSetterFn;
  setTy: QuickSetterFn;
  setScale: QuickSetterFn;
  setOpacity: QuickSetterFn;
}

export const Scene: React.FC<SceneProps> = ({
  scene,
  localProgress,
  sceneOpacity,
  isVisible,
  zIndex,
  isReducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Separate static environment layers from animated doors
  const staticLayers = scene.layers.filter((l) => !l.id.includes('door'));
  const doorLayers = scene.layers.filter((l) => l.id.includes('door'));

  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const quickSettersRef = useRef<LayerQuickSetters[]>([]);

  // Initialize gsap.quickSetter for CSS custom properties on mount
  useEffect(() => {
    quickSettersRef.current = staticLayers.map((_, idx) => {
      const el = layerRefs.current[idx];
      if (!el) {
        return {
          setTx: () => {},
          setTy: () => {},
          setScale: () => {},
          setOpacity: () => {},
        };
      }

      return {
        setTx: gsap.quickSetter(el, '--tx', 'px') as QuickSetterFn,
        setTy: gsap.quickSetter(el, '--ty', 'px') as QuickSetterFn,
        setScale: gsap.quickSetter(el, '--scale') as QuickSetterFn,
        setOpacity: gsap.quickSetter(el, '--opacity') as QuickSetterFn,
      };
    });
  }, [staticLayers]);

  // Update layer transformations when localProgress or isVisible changes
  useEffect(() => {
    if (!isVisible && !isReducedMotion) return;

    const pushStrength = 0.28; // 35mm camera dolly depth factor

    staticLayers.forEach((layer, idx) => {
      const setters = quickSettersRef.current[idx];
      if (!setters) return;

      if (isReducedMotion) {
        setters.setTx(0);
        setters.setTy(0);
        setters.setScale(1);
        setters.setOpacity(1);
        return;
      }

      const d = layer.depth; // 0.1 (background) to 0.95 (foreground)
      const p = localProgress;

      // Dolly scale expansion: scale = 1 + (d * pushStrength * p)
      const scale = 1 + d * pushStrength * p;

      // Parallax translation: dx = parallaxX * d * p, dy = parallaxY * d * p
      const [startX, endX] = layer.parallax.xRange;
      const [startY, endY] = layer.parallax.yRange;
      const tx = (startX + (endX - startX) * p) * d * 8; // Screen px delta
      const ty = (startY + (endY - startY) * p) * d * 8;

      // Opacity interpolation
      const [startOp, endOp] = layer.opacityRange;
      const op = startOp + (endOp - startOp) * p;

      setters.setTx(tx);
      setters.setTy(ty);
      setters.setScale(scale);
      setters.setOpacity(Math.max(0, Math.min(1, op)));
    });
  }, [staticLayers, localProgress, isVisible, isReducedMotion]);

  if (!isVisible && !isReducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      id={`scene-${scene.index}-${scene.slug}`}
      style={{
        zIndex,
        opacity: isReducedMotion ? 1 : sceneOpacity,
        visibility: isVisible || isReducedMotion ? 'visible' : 'hidden',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      className="absolute inset-0 w-full h-full preserve-3d transition-opacity duration-150"
    >
      {/* 2.5D Static Environment Depth Layers */}
      {staticLayers.map((layer, idx) => (
        <div
          key={layer.id}
          ref={(el) => {
            layerRefs.current[idx] = el;
          }}
          id={`layer-${layer.id}`}
          style={{
            zIndex: layer.zIndex,
            transformOrigin: layer.transformOrigin || 'center center',
            transform: 'translate3d(var(--tx, 0px), var(--ty, 0px), 0px) scale(var(--scale, 1))',
            opacity: 'var(--opacity, 1)',
            ...layer.customStyle,
          }}
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none gpu-layer"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <LayerImage
              layer={layer}
              sceneIndex={scene.index}
              className="w-full h-full"
            />
          </div>
        </div>
      ))}

      {/* 3D Animated Door Kinematics (Slide / Swing with real cutout plates) */}
      <Door
        type={scene.doorType}
        sceneIndex={scene.index}
        progress={localProgress}
        doorLayers={doorLayers}
      />
    </div>
  );
};
