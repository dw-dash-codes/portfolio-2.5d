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
      className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-none z-30"
    >
      {/* Top Header / Brand HUD */}
      <header className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-sand-200 animate-pulse" />
          <span className="font-mono text-xs tracking-widest uppercase text-sand-200">
            SYSTEM ARCHITECT // 2.5D
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="outline">LATENCY: 12MS</Badge>
          <Badge variant="outline">STATUS: ONLINE</Badge>
        </div>
      </header>

      {/* Main Hero Typography */}
      <div className="max-w-3xl space-y-4 my-auto">
        <div className="inline-block">
          <span className="text-xs font-mono tracking-ultra uppercase text-sand-400">
            FRAME 01 // ARRIVAL
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-sand-50 uppercase leading-none font-display">
          ALEX MORGAN
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-sand-200/90 font-light max-w-2xl leading-relaxed">
          Principal Software Architect & Full-Stack Systems Engineer crafting ultra-resilient distributed architectures.
        </p>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="flex justify-between items-end w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-sand-400/40 flex items-center justify-center animate-bounce">
            <ChevronDown className="w-4 h-4 text-sand-200" />
          </div>
          <span className="font-mono text-xs tracking-widest uppercase text-sand-200">
            SCROLL TO STEP INSIDE
          </span>
        </div>
        <div className="font-mono text-xs text-sand-400 tracking-wider">
          01 / 06
        </div>
      </div>
    </div>
  );
};
