import React from 'react';
import { Badge } from '../ui/Badge';
import { ChevronDown } from 'lucide-react';

interface HeroOverlayProps {
  opacity?: number;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ opacity = 1 }) => {
  return (
    <div
      style={{ opacity, transition: 'opacity 0.3s ease' }}
      className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-none z-30 text-ink-600"
    >
      {/* Top Header / HUD */}
      <header className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-sand-400 animate-pulse" />
          <span className="font-mono text-xs tracking-widest uppercase text-ink-600 font-semibold">
            PORTFOLIO // 2.5D
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="sand">REACT • NEXT.JS • NODE.JS • PYTHON</Badge>
        </div>
      </header>

      {/* Main Hero Typography */}
      <div className="max-w-3xl space-y-4 my-auto">
        <div className="inline-block">
          <span className="text-xs font-mono tracking-ultra uppercase text-sand-400 font-semibold">
            FRAME 01 // ARRIVAL
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ink-600 uppercase leading-none font-display">
          FULL-STACK ENGINEER
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-ink-600/85 font-light max-w-2xl leading-relaxed">
          Building web applications, services, and cloud deployments with React, Next.js, Node.js, and Python.
        </p>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="flex justify-between items-end w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-sand-400 flex items-center justify-center animate-bounce bg-sand-50/60">
            <ChevronDown className="w-4 h-4 text-ink-600" />
          </div>
          <span className="font-mono text-xs tracking-widest uppercase text-ink-600 font-semibold">
            SCROLL TO EXPLORE
          </span>
        </div>
        <div className="font-mono text-xs text-sand-400 font-bold tracking-wider">
          01 / 06
        </div>
      </div>
    </div>
  );
};
