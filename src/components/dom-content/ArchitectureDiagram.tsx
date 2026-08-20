import React from 'react';
import { Card3D } from '../ui/Card3D';
import { Badge } from '../ui/Badge';
import { Cpu, Server, Database, ArrowRight, ShieldCheck } from 'lucide-react';

interface ArchitectureDiagramProps {
  opacity?: number;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ opacity = 1 }) => {
  return (
    <div
      style={{ opacity, transition: 'opacity 0.3s ease' }}
      className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-12 z-30 pointer-events-auto"
    >
      <div className="w-full max-w-5xl space-y-6">
        <div className="border-b border-sand-400/20 pb-4">
          <span className="text-xs font-mono tracking-widest text-sand-400 uppercase">
            FRAME 04 // ROOM 02
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-sand-50 uppercase font-display">
            BACKEND & AI PIPELINES
          </h2>
          <p className="text-sand-200 text-xs sm:text-sm font-light mt-1">
            Real-time inference topology, distributed state stores, and microservice meshes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Backend Architecture Node Card */}
          <Card3D className="space-y-4 bg-navy-900/80 border-indigo-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-sand-50 font-display uppercase tracking-wider">
                  BACKEND ARCHITECTURE
                </h3>
              </div>
              <Badge variant="navy">DISTRIBUTED</Badge>
            </div>

            {/* Architecture Node Flowchart */}
            <div className="space-y-2.5 font-mono text-xs text-sand-200">
              <div className="p-2.5 rounded bg-navy-800/80 border border-sand-400/20 flex items-center justify-between">
                <span>[Edge Client Request]</span>
                <span className="text-indigo-400 text-[10px]">Cloudflare CDN</span>
              </div>
              <div className="flex justify-center text-sand-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <div className="p-2.5 rounded bg-navy-800/80 border border-indigo-400/40 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-sand-50">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  API Gateway & Auth Proxy
                </span>
                <span className="text-emerald-400 text-[10px]">JWT / TLS 1.3</span>
              </div>
              <div className="flex justify-center text-sand-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-navy-800/60 border border-sand-400/20 text-center">
                  <Database className="w-3.5 h-3.5 mx-auto text-sand-200 mb-1" />
                  <span>PostgreSQL (Sharded)</span>
                </div>
                <div className="p-2 rounded bg-navy-800/60 border border-sand-400/20 text-center">
                  <Cpu className="w-3.5 h-3.5 mx-auto text-sand-200 mb-1" />
                  <span>Redis Cluster</span>
                </div>
              </div>
            </div>
          </Card3D>

          {/* AI Pipeline Node Card */}
          <Card3D className="space-y-4 bg-navy-900/80 border-indigo-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-sand-50 font-display uppercase tracking-wider">
                  AI & VECTOR PIPELINE
                </h3>
              </div>
              <Badge variant="navy">LOW LATENCY</Badge>
            </div>

            {/* AI Pipeline Flowchart */}
            <div className="space-y-2.5 font-mono text-xs text-sand-200">
              <div className="p-2.5 rounded bg-navy-800/80 border border-sand-400/20 flex items-center justify-between">
                <span>01. Streaming Data Ingestion</span>
                <span className="text-sand-400 text-[10px]">Apache Kafka</span>
              </div>
              <div className="flex justify-center text-sand-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <div className="p-2.5 rounded bg-navy-800/80 border border-indigo-400/40 flex items-center justify-between">
                <span className="font-semibold text-sand-50">
                  02. Embedding & Chunking Layer
                </span>
                <span className="text-indigo-400 text-[10px]">OpenAI / Cohere</span>
              </div>
              <div className="flex justify-center text-sand-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <div className="p-2.5 rounded bg-navy-800/80 border border-sand-400/20 flex items-center justify-between">
                <span>03. Vector Similarity Query</span>
                <span className="text-emerald-400 text-[10px]">pgvector / Qdrant</span>
              </div>
            </div>
          </Card3D>
        </div>
      </div>
    </div>
  );
};
