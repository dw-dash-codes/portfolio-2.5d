import React, { useState } from 'react';
import { Card3D } from '../ui/Card3D';
import { Badge } from '../ui/Badge';
import { Code2, Database, Layout, Wrench } from 'lucide-react';

interface FullStackDeckProps {
  opacity?: number;
}

const CATEGORIES = [
  { id: 'frontend', label: 'Frontend', icon: Layout },
  { id: 'backend', label: 'Backend', icon: Code2 },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'tools', label: 'Tools', icon: Wrench },
] as const;

const SKILLS_DATA = [
  {
    category: 'frontend',
    title: 'Design Systems & Reactive UI',
    role: 'Frontend Engineering',
    tags: ['React 18', 'TypeScript', 'Tailwind', 'Next.js', 'Web Vitals'],
    desc: 'High-speed component architectures optimized for sub-50ms interaction latencies and zero layout shifts.',
  },
  {
    category: 'backend',
    title: 'Distributed Microservices',
    role: 'Systems Architecture',
    tags: ['Node.js', 'Go', 'gRPC', 'GraphQL', 'Event-Driven'],
    desc: 'Fault-tolerant distributed services handling millions of concurrent requests with structured telemetry.',
  },
  {
    category: 'database',
    title: 'Data Modeling & Vector Storage',
    role: 'Database Engineering',
    tags: ['PostgreSQL', 'Redis', 'pgvector', 'ClickHouse', 'Prisma'],
    desc: 'Polyglot persistence layers designed for sub-millisecond query caches and high-throughput vector similarity search.',
  },
  {
    category: 'tools',
    title: 'DevOps & Pipeline Automation',
    role: 'Infrastructure & Cloud',
    tags: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
    desc: 'Immutable infrastructure as code and zero-downtime blue/green deployment workflows.',
  },
];

export const FullStackDeck: React.FC<FullStackDeckProps> = ({ opacity = 1 }) => {
  const [activeTab, setActiveTab] = useState<string>('frontend');

  const filteredSkills = SKILLS_DATA.filter(
    (skill) => activeTab === 'all' || skill.category === activeTab
  );

  return (
    <div
      style={{ opacity, transition: 'opacity 0.3s ease' }}
      className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-12 z-30 pointer-events-auto"
    >
      <div className="w-full max-w-5xl space-y-6">
        {/* Header and Filter Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-sand-400/20 pb-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-sand-400 uppercase">
              FRAME 03 // ROOM 01
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-sand-50 uppercase font-display">
              FULL-STACK DEVELOPMENT
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all duration-200 ${
                    isActive
                      ? 'bg-sand-200 text-navy-900 font-semibold shadow-md'
                      : 'bg-navy-800/80 text-sand-200 hover:bg-navy-800 border border-sand-400/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skill / Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredSkills.map((item, idx) => (
            <Card3D key={idx} className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-sand-50 font-display">
                  {item.title}
                </h3>
                <Badge variant="sand">{item.role}</Badge>
              </div>
              <p className="text-xs sm:text-sm text-sand-200/80 leading-relaxed font-light">
                {item.desc}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.tags.map((tag, tIdx) => (
                  <Badge key={tIdx} variant="outline" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </div>
  );
};
