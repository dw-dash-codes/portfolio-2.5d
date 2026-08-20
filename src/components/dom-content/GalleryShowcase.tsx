import React from 'react';
import { Card3D } from '../ui/Card3D';
import { Badge } from '../ui/Badge';
import { PROJECTS } from '../../data/projects';
import { ExternalLink, Layers } from 'lucide-react';

interface GalleryShowcaseProps {
  opacity?: number;
}

export const GalleryShowcase: React.FC<GalleryShowcaseProps> = ({ opacity = 1 }) => {
  return (
    <div
      style={{ opacity, transition: 'opacity 0.3s ease' }}
      className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-12 z-30 pointer-events-auto text-ink-600"
    >
      <div className="w-full max-w-5xl space-y-6">
        <div className="border-b border-sand-400/30 pb-4">
          <span className="text-xs font-mono tracking-widest text-sand-400 uppercase font-semibold">
            FRAME 05 // ROOM 03
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-ink-600 uppercase font-display">
            WEB APPLICATION GALLERY
          </h2>
          <p className="text-ink-600/80 text-xs sm:text-sm font-light mt-1">
            Featured projects and applications built with React, Next.js, Node.js, and Python.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROJECTS.map((proj, idx) => (
            <Card3D key={proj.id || idx} className="flex flex-col justify-between space-y-4 bg-sand-50/95 border-sand-400/40 text-ink-600 shadow-xl">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-8 h-8 rounded-lg bg-sand-200/80 border border-sand-400/40 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-ink-600" />
                  </div>
                  <Badge variant="outline" className="border-sand-400/50 text-ink-600">
                    PROJECT {idx + 1}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-ink-600 font-display">
                  {proj.title}
                </h3>
                <p className="text-xs text-ink-600/80 font-light leading-relaxed">
                  {proj.tagline}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-sand-400/20">
                <div className="space-y-1">
                  {proj.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="font-mono text-[11px] text-ink-600/90 flex items-center gap-1.5">
                      <span className="text-sand-400 font-bold">•</span>
                      {m}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-wrap gap-1">
                    {proj.tech.map((t, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono text-sand-400 font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <button className="inline-flex items-center gap-1 text-xs font-mono text-ink-600 hover:text-sand-400 uppercase tracking-wider font-semibold">
                    View <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </div>
  );
};
