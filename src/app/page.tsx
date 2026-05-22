import { Users, BookOpen, Github } from 'lucide-react';
import { Roadmap } from '@/types';
import roadmapsData from '@/data/roadmaps.json';
import quizzesData from '@/data/quizzes.json';
import SearchFilterGrid from '@/components/home/SearchFilterGrid';

export default function HomePage() {
  const roadmaps = roadmapsData.roadmaps as Roadmap[];
  const quizQuestionCount = (Object.values(quizzesData) as unknown[][]).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  const stats = [
    { icon: Users, label: `${roadmaps.length} Roadmaps` },
    { icon: BookOpen, label: `${quizQuestionCount}+ Quiz Questions` },
    { icon: Github, label: 'Open Source' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero — server-rendered, no JS needed */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Developer{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Roadmaps
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Interactive roadmaps, guides, and projects to help you choose your path and grow as a
            developer. Learn with a structured approach and track your progress.
          </p>

          {/* Real stats — computed at build time */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {stats.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Icon size={20} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client component handles search + filter + grid */}
      <SearchFilterGrid roadmaps={roadmaps} />
    </div>
  );
}
