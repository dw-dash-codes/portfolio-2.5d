import React from 'react';
import { Badge } from '../ui/Badge';

interface ThresholdPromptProps {
  opacity?: number;
}

export const ThresholdPrompt: React.FC<ThresholdPromptProps> = ({ opacity = 1 }) => {
  return (
    <div
      style={{ opacity, transition: 'opacity 0.3s ease' }}
      className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 pointer-events-none z-30 text-ink-600"
    >
      <div className="space-y-4 max-w-xl">
        <Badge variant="sand">FRAME 02 // THRESHOLD</Badge>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-ink-600 uppercase font-display">
          ENTER THE WORKSPACE
        </h2>
        <p className="text-ink-600/80 text-sm sm:text-base font-light tracking-wide max-w-md mx-auto">
          Entering the interior rooms to explore full-stack architecture, services, and applications.
        </p>
      </div>
    </div>
  );
};
