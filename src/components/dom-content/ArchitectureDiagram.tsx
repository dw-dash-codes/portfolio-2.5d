import React from 'react';
import { Card3D } from '../ui/Card3D';
import { Badge } from '../ui/Badge';
import { Server, Database, ArrowRight, ShieldCheck, Cloud, Cpu } from 'lucide-react';

interface ArchitectureDiagramProps {
  opacity?: number;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ opacity = 1 }) => {
  return (
    <div
      style={{ opacity, transition: 'opacity 0.3s ease' }}
      className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-12 z-30 pointer-events-auto text-sand-50 pl-8 md:pl-16"
    >
      <div className="w-full max-w-3xl space-y-6">
        <div className="border-b border-indigo-500/30 pb-4">
          <span className="text-xs font-mono tracking-widest text-indigo-400 uppercase font-semibold">
            FRAME 04 // ROOM 02 (INDIGO TECH CHAMBER)
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-sand-50 uppercase font-display">
            BACKEND & APPLICATION PIPELINES
          </h2>
          <p className="text-sand-200 text-xs sm:text-sm font-light mt-1">
            Service topology, database persistence, and containerized cloud deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Backend Architecture Node Card */}
          <Card3D className="space-y-4 bg-navy-900/90 border-indigo-500/40 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-sand-50 font-display uppercase tracking-wider">
                  BACKEND ARCHITECTURE
                </h3>
              </div>
              <Badge variant="navy">REST & SERVICES</Badge>
            </div>

            {/* Architecture Node Flowchart */}
            <div className="space-y-2.5 font-mono text-xs text-sand-200">
              <div className="p-2.5 rounded bg-navy-800/80 border border-sand-400/20 flex items-center justify-between">
                <span>[Client Application]</span>
                <span className="text-indigo-300 text-[10px]">React / Next.js</span>
              </div>
              <div className="flex justify-center text-indigo-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <div className="p-2.5 rounded bg-navy-800/80 border border-indigo-400/40 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-sand-50">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  API Gateway & Server Logic
                </span>
                <span className="text-emerald-400 text-[10px]">Express / FastAPI</span>
              </div>
              <div className="flex justify-center text-indigo-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-navy-800/60 border border-sand-400/20 text-center">
                  <Database className="w-3.5 h-3.5 mx-auto text-sand-200 mb-1" />
                  <span>PostgreSQL / Supabase</span>
                </div>
                <div className="p-2.5 rounded bg-navy-800/60 border border-sand-400/20 text-center">
                  <Database className="w-3.5 h-3.5 mx-auto text-sand-200 mb-1" />
                  <span>MongoDB Store</span>
                </div>
              </div>
            </div>
          </Card3D>

          {/* Application & Cloud Pipeline Card */}
          <Card3D className="space-y-4 bg-navy-900/90 border-indigo-500/40 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-sand-50 font-display uppercase tracking-wider">
                  CLOUD & DATA PIPELINE
                </h3>
              </div>
              <Badge variant="navy">AWS & DOCKER</Badge>
            </div>

            {/* Application Pipeline Flowchart */}
            <div className="space-y-2.5 font-mono text-xs text-sand-200">
              <div className="p-2.5 rounded bg-navy-800/80 border border-sand-400/20 flex items-center justify-between">
                <span>01. Application Ingestion</span>
                <span className="text-sand-400 text-[10px]">Express & Node.js</span>
              </div>
              <div className="flex justify-center text-indigo-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <div className="p-2.5 rounded bg-navy-800/80 border border-indigo-400/40 flex items-center justify-between">
                <span className="font-semibold text-sand-50 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  02. Python Processing Engine
                </span>
                <span className="text-indigo-300 text-[10px]">Python / FastAPI</span>
              </div>
              <div className="flex justify-center text-indigo-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <div className="p-2.5 rounded bg-navy-800/80 border border-sand-400/20 flex items-center justify-between">
                <span>03. Containerized Cloud Deployment</span>
                <span className="text-emerald-400 text-[10px]">Docker on AWS</span>
              </div>
            </div>
          </Card3D>
        </div>
      </div>
    </div>
  );
};
