export interface RoadmapNodeChild {
  id: string;
  title: string;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type QuizMap = Record<string, QuizQuestion[]>;

export interface LeetCodeProblem {
  title: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export type LeetCodeMap = Record<string, LeetCodeProblem[]>;

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  prerequisites?: string[];
  children?: RoadmapNodeChild[];
  position: {
    x: number;
    y: number;
  };
  status?: 'not-started' | 'in-progress' | 'completed' | 'skipped';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'documentation' | 'tutorial' | 'course';
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: 'role-based' | 'skill-based';
  subcategory: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  nodes: RoadmapNode[];
  connections: Connection[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Connection {
  from: string;
  to: string;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  readTime: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  estimatedTime: string;
  requirements: string[];
  features: string[];
  category: string;
  githubUrl?: string;
  demoUrl?: string;
}

export interface UserProgress {
  userId: string;
  roadmapId: string;
  nodeProgress: Record<string, RoadmapNode['status']>;
  lastUpdated: string;
}