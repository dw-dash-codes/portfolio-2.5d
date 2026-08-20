import React from 'react';
import { DoorType, Layer } from '../../types/scene';
import { LayerImage } from './LayerImage';

interface DoorProps {
  type: DoorType;
  sceneIndex: number;
  progress: number; // 0 to 1 strictly clamped
  doorLayers?: Layer[];
  className?: string;
}

// Parametric power2.inOut curve for physical door kinematics
function easePower2InOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export const Door: React.FC<DoorProps> = ({
  type,
  sceneIndex,
  progress,
  doorLayers = [],
  className = '',
}) => {
  if (type === 'none') return null;

  const easedP = easePower2InOut(progress);
  const isDoorOpenPast35 = progress > 0.35;
  const bloomOpacity = isDoorOpenPast35 ? Math.min(1, (progress - 0.35) * 2.2) : 0;

  const leftDoorLayer = doorLayers.find((l) => l.id.includes('left') || l.id.includes('hinge-left'));
  const rightDoorLayer = doorLayers.find((l) => l.id.includes('right') || l.id.includes('hinge-right'));

  // 1. Sliding Double Doors (Scene 2 Entrance and Scene 5 Gallery Portal)
  if (type === 'sliding-double') {
    const maxSlidePercent = sceneIndex === 5 ? 75 : 85;
    const leftX = -easedP * maxSlidePercent;
    const rightX = easedP * maxSlidePercent;

    return (
      <div
        id={`door-container-scene-${sceneIndex}`}
        style={{ zIndex: 25 }}
        className={`absolute inset-0 pointer-events-none flex justify-center items-center ${className}`}
      >
        {/* Light Bloom & Room Reveal behind parting doors */}
        <div
          style={{
            opacity: bloomOpacity,
            transform: `scale(${0.95 + bloomOpacity * 0.15})`,
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-[60vw] h-[70vh] rounded-full bg-sand-200/30 blur-3xl" />
        </div>

        {/* Left Sliding Architectural Door Panel */}
        <div
          style={{
            transform: `translate3d(${leftX}%, 0, 0)`,
            transition: 'transform 0.08s linear',
          }}
          className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-end shadow-2xl gpu-layer overflow-hidden"
        >
          {leftDoorLayer ? (
            <LayerImage layer={leftDoorLayer} sceneIndex={sceneIndex} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-sand-400/40 border-r border-sand-400/70 backdrop-blur-sm flex items-center justify-end pr-8">
              <div className="w-3.5 h-44 rounded-full bg-ink-600 shadow-lg border border-sand-200/40" />
            </div>
          )}
        </div>

        {/* Right Sliding Architectural Door Panel */}
        <div
          style={{
            transform: `translate3d(${rightX}%, 0, 0)`,
            transition: 'transform 0.08s linear',
          }}
          className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-start shadow-2xl gpu-layer overflow-hidden"
        >
          {rightDoorLayer ? (
            <LayerImage layer={rightDoorLayer} sceneIndex={sceneIndex} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-sand-400/40 border-l border-sand-400/70 backdrop-blur-sm flex items-center justify-start pl-8">
              <div className="w-3.5 h-44 rounded-full bg-ink-600 shadow-lg border border-sand-200/40" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Swing Door Left (Scene 3 Full-Stack Development Room)
  if (type === 'hinge-left') {
    const rotateY = -easedP * 85;

    return (
      <div
        id={`door-container-scene-${sceneIndex}`}
        style={{ zIndex: 25 }}
        className={`absolute inset-0 pointer-events-none flex items-center ${className}`}
      >
        {/* Light Bloom Room Wash */}
        <div
          style={{
            opacity: bloomOpacity,
            transform: `scale(${0.95 + bloomOpacity * 0.15})`,
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
          }}
          className="absolute left-1/4 top-1/4 w-[50vw] h-[60vh] rounded-full bg-sand-200/30 blur-3xl pointer-events-none"
        />

        {/* Hinged Left Door - Swinging in 3D perspective on Y-axis */}
        <div
          style={{
            transformOrigin: 'left center',
            transform: `perspective(1200px) rotateY(${rotateY}deg) translateZ(0)`,
            transition: 'transform 0.08s linear',
          }}
          className="w-1/3 h-[92%] ml-12 rounded-lg shadow-2xl flex items-center justify-end gpu-layer overflow-hidden"
        >
          {leftDoorLayer ? (
            <LayerImage layer={leftDoorLayer} sceneIndex={sceneIndex} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-sand-400/45 border-2 border-sand-400/80 backdrop-blur-md flex items-center justify-end pr-6">
              <div className="w-3.5 h-36 rounded-full bg-ink-600 shadow-lg border border-sand-200/40" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Swing Door Right (Scene 4 Indigo Tech Chamber)
  if (type === 'hinge-right') {
    const rotateY = easedP * 85;

    return (
      <div
        id={`door-container-scene-${sceneIndex}`}
        style={{ zIndex: 25 }}
        className={`absolute inset-0 pointer-events-none flex items-center justify-end ${className}`}
      >
        {/* Indigo Light Bloom */}
        <div
          style={{
            opacity: bloomOpacity,
            transform: `scale(${0.95 + bloomOpacity * 0.15})`,
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
          }}
          className="absolute right-1/4 top-1/4 w-[50vw] h-[60vh] rounded-full bg-indigo-500/30 blur-3xl pointer-events-none"
        />

        {/* Hinged Right Monolithic Door - Swinging in 3D perspective on Y-axis */}
        <div
          style={{
            transformOrigin: 'right center',
            transform: `perspective(1200px) rotateY(${rotateY}deg) translateZ(0)`,
            transition: 'transform 0.08s linear',
          }}
          className="w-1/3 h-[92%] mr-12 rounded-lg shadow-2xl flex items-center justify-start gpu-layer overflow-hidden"
        >
          {rightDoorLayer ? (
            <LayerImage layer={rightDoorLayer} sceneIndex={sceneIndex} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-navy-800/95 border-2 border-indigo-400/60 backdrop-blur-md flex items-center justify-start pl-6">
              <div className="w-3.5 h-36 rounded-full bg-indigo-300 shadow-lg border border-indigo-200/50" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
