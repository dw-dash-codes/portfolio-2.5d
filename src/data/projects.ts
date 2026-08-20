export interface Project {
  id: string;
  title: string;
  tagline: string;
  metrics: string[];
  tech: string[];
  link?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'project-01',
    title: 'PROJECT_NAME_01',
    tagline: 'PROJECT_DESCRIPTION',
    metrics: ['PROJECT_METRIC_1', 'PROJECT_METRIC_2', 'PROJECT_METRIC_3'],
    tech: ['React', 'Next.js', 'TypeScript'],
  },
  {
    id: 'project-02',
    title: 'PROJECT_NAME_02',
    tagline: 'PROJECT_DESCRIPTION',
    metrics: ['PROJECT_METRIC_1', 'PROJECT_METRIC_2', 'PROJECT_METRIC_3'],
    tech: ['Node.js', 'Express', 'PostgreSQL/Supabase', 'Docker'],
  },
  {
    id: 'project-03',
    title: 'PROJECT_NAME_03',
    tagline: 'PROJECT_DESCRIPTION',
    metrics: ['PROJECT_METRIC_1', 'PROJECT_METRIC_2', 'PROJECT_METRIC_3'],
    tech: ['Python', 'FastAPI', 'MongoDB', 'AWS'],
  },
];
