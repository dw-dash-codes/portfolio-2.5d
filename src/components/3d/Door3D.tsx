import React from 'react';
import { DoorType } from '../../types/scene';

interface Door3DProps {
  type: DoorType;
  progress: number; // 0 (closed) to 1 (fully open)
  className?: string;
}

export const Door3D: React.FC<Door3DProps> = ({ type, progress, className = '' }) => {
  if (type === 'none') return null;

  if (type === 'sliding-double') {
    const leftX = -progress * 100;
    const rightX = progress * 100;

    return (
      <div className={`absolute inset-0 pointer-events-none z-20 flex justify-center items-center ${className}`}>
        {/* Left Sliding Panel */}
        <div
          style={{
            transform: `translate3d(${leftX}%, 0, 0)`,
            transition: 'transform 0.1s linear',
          }}
          className="absolute left-0 top-0 w-1/2 h-full bg-sand-400/30 border-r border-sand-400/60 backdrop-blur-md flex items-center justify-end pr-6 shadow-2xl gpu-layer"
        >
          <div className="w-2.5 h-32 rounded-full bg-ink-600 shadow-md" />
        </div>

        {/* Right Sliding Panel */}
        <div
          style={{
            transform: `translate3d(${rightX}%, 0, 0)`,
            transition: 'transform 0.1s linear',
          }}
          className="absolute right-0 top-0 w-1/2 h-full bg-sand-400/30 border-l border-sand-400/60 backdrop-blur-md flex items-center justify-start pl-6 shadow-2xl gpu-layer"
        >
          <div className="w-2.5 h-32 rounded-full bg-ink-600 shadow-md" />
        </div>
      </div>
    );
  }

  if (type === 'hinge-left') {
    const rotateY = -progress * 85;

    return (
      <div className={`absolute inset-0 pointer-events-none z-20 flex items-center ${className}`}>
        <div
          style={{
            transformOrigin: 'left center',
            transform: `perspective(1200px) rotateY(${rotateY}deg) translateZ(0)`,
            transition: 'transform 0.1s linear',
          }}
          className="w-1/3 h-[90%] ml-8 rounded-lg bg-sand-400/35 border border-sand-400/60 backdrop-blur-md shadow-2xl flex items-center justify-end pr-4 gpu-layer"
        >
          <div className="w-2.5 h-24 rounded-full bg-ink-600 shadow" />
        </div>
      </div>
    );
  }

  if (type === 'hinge-right') {
    const rotateY = progress * 85;

    return (
      <div className={`absolute inset-0 pointer-events-none z-20 flex items-center justify-end ${className}`}>
        <div
          style={{
            transformOrigin: 'right center',
            transform: `perspective(1200px) rotateY(${rotateY}deg) translateZ(0)`,
            transition: 'transform 0.1s linear',
          }}
          className="w-1/3 h-[90%] mr-8 rounded-lg bg-navy-800/90 border border-indigo-400/50 backdrop-blur-md shadow-2xl flex items-center justify-start pl-4 gpu-layer"
        >
          <div className="w-2.5 h-24 rounded-full bg-indigo-300 shadow" />
        </div>
      </div>
    );
  }

  return null;
};
