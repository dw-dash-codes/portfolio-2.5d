import React, { useState } from 'react';
import { Card3D } from '../ui/Card3D';
import { Badge } from '../ui/Badge';
import { Code2, Database, Layout, Cloud } from 'lucide-react';

interface FullStackDeckProps {
  opacity?: number;
}

const CATEGORIES = [
  { id: 'frontend', label: 'Frontend', icon: Layout },
  { id: 'backend', label: 'Backend', icon: Code2 },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'devops', label: 'Cloud & DevOps', icon: Cloud },
] as const;

const SKILLS_DATA = [
  {
    category: 'frontend',
    title: 'React & Next.js Ecosystem',
    role: 'Frontend Engineering',
    tags: ['React', 'Next.js', 'TypeScript'],
    desc: 'Building responsive user interfaces, server-side rendered applications, and modular component systems.',
  },
  {
    category: 'backend',
    title: 'Node.js & Python Services',
    role: 'Backend Engineering',
    tags: ['Node.js', 'Express', 'Python', 'FastAPI'],
    desc: 'Developing RESTful APIs, asynchronous services, and scalable server-side business logic.',
  },
  {
    category: 'database',
    title: 'Relational & Document Databases',
    role: 'Database Engineering',
    tags: ['PostgreSQL/Supabase', 'MongoDB'],
    desc: 'Designing structured schemas, document models, efficient queries, and reliable data persistence.',
  },
  {
    category: 'devops',
    title: 'Cloud Infrastructure & Containers',
    role: 'Deployment & Tooling',
    tags: ['AWS', 'Docker'],
    desc: 'Containerizing services with Docker and deploying robust applications to AWS cloud environments.',
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
      className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-12 z-30 pointer-events-auto text-ink-600"
    >
      <div className="w-full max-w-5xl space-y-6">
        {/* Header and Filter Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-sand-400/30 pb-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-sand-400 uppercase font-semibold">
              FRAME 03 // ROOM 01
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-ink-600 uppercase font-display">
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
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all duration-200 ${
                    isActive
                      ? 'bg-ink-600 text-sand-50 font-semibold shadow-md'
                      : 'bg-sand-200/70 text-ink-600 hover:bg-sand-200 border border-sand-400/40'
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((item, idx) => (
            <Card3D key={idx} className="space-y-3 bg-sand-50/95 border-sand-400/40 text-ink-600 shadow-xl">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-ink-600 font-display">
                  {item.title}
                </h3>
                <Badge variant="sand">{item.role}</Badge>
              </div>
              <p className="text-xs sm:text-sm text-ink-600/80 leading-relaxed font-light">
                {item.desc}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.tags.map((tag, tIdx) => (
                  <Badge key={tIdx} variant="outline" className="text-[11px] border-sand-400/50 text-ink-600 bg-sand-200/40">
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
