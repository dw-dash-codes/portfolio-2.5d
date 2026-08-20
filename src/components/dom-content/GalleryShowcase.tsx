import React from 'react';
import { Card3D } from '../ui/Card3D';
import { Badge } from '../ui/Badge';
import { ExternalLink, Sparkles, BarChart3, ShoppingBag } from 'lucide-react';

interface GalleryShowcaseProps {
  opacity?: number;
}

const PROJECTS = [
  {
    title: 'ProjectFlow SaaS',
    tagline: 'Enterprise collaborative workflow platform',
    icon: Sparkles,
    metrics: ['+140% Velocity', '< 40ms Latency', '100k+ MAU'],
    tech: ['React 18', 'Tailwind', 'Node.js', 'Redis'],
  },
  {
    title: 'Pulse Metrics Analytics',
    tagline: 'Real-time telemetry & time-series dashboards',
    icon: BarChart3,
    metrics: ['1.2M Events/sec', 'Sub-second Aggregation', 'Zero Jitter'],
    tech: ['TypeScript', 'ClickHouse', 'WebSocket', 'Tailwind'],
  },
  {
    title: 'Aura Commerce Engine',
    tagline: 'Headless storefront with 2.5D product staging',
    icon: ShoppingBag,
    metrics: ['99.99% Uptime', 'Global Edge CDN', 'Stripe Connect'],
    tech: ['Next.js', 'PostgreSQL', 'Stripe', 'Framer'],
  },
];

export const GalleryShowcase: React.FC<GalleryShowcaseProps> = ({ opacity = 1 }) => {
  return (
    <div
      style={{ opacity, transition: 'opacity 0.3s ease' }}
      className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-12 z-30 pointer-events-auto"
    >
      <div className="w-full max-w-5xl space-y-6">
        <div className="border-b border-sand-400/20 pb-4">
          <span className="text-xs font-mono tracking-widest text-sand-400 uppercase">
            FRAME 05 // ROOM 03
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-sand-50 uppercase font-display">
            WEB APPLICATION GALLERY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROJECTS.map((proj, idx) => {
            const Icon = proj.icon;
            return (
              <Card3D key={idx} className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="w-8 h-8 rounded-lg bg-sand-400/20 border border-sand-200/30 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-sand-200" />
                    </div>
                    <Badge variant="outline">CASE STUDY</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-sand-50 font-display">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-sand-200/80 font-light leading-relaxed">
                    {proj.tagline}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-sand-400/15">
                  <div className="space-y-1">
                    {proj.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="font-mono text-[11px] text-sand-200 flex items-center gap-1.5">
                        <span className="text-sand-400 font-bold">•</span>
                        {m}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-1">
                      {proj.tech.slice(0, 2).map((t, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono text-sand-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <button className="inline-flex items-center gap-1 text-xs font-mono text-sand-200 hover:text-sand-50 uppercase tracking-wider">
                      Launch <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>
      </div>
    </div>
  );
};
