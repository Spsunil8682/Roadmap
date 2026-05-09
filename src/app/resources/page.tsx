'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  GraduationCap,
  Sparkles,
  Layout,
  Server,
  Code2,
  Atom,
  Network,
  Database,
  Cloud,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import resourcesData from '@/data/resources.json';

interface Resource {
  title: string;
  description: string;
  url: string;
  type: string;
  level: string;
  free: boolean;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  resources: Resource[];
}

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Layout,
  Server,
  Code2,
  Atom,
  Network,
  Database,
  Cloud,
  Briefcase,
};

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  documentation: FileText,
  tutorial: BookOpen,
  video: Video,
  course: GraduationCap,
  book: BookOpen,
  article: FileText,
  practice: Sparkles,
};

const TYPE_COLORS: Record<string, string> = {
  documentation: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  tutorial: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  video: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  course: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  book: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  article: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300',
  practice: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'text-emerald-600 dark:text-emerald-400',
  intermediate: 'text-amber-600 dark:text-amber-400',
  advanced: 'text-rose-600 dark:text-rose-400',
  all: 'text-gray-500 dark:text-gray-400',
};

export default function ResourcesPage() {
  const categories = resourcesData.categories as Category[];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        resources: cat.resources.filter((r) => {
          if (showFreeOnly && !r.free) return false;
          if (selectedType !== 'all' && r.type !== selectedType) return false;
          if (searchTerm) {
            const q = searchTerm.toLowerCase();
            return (
              r.title.toLowerCase().includes(q) ||
              r.description.toLowerCase().includes(q)
            );
          }
          return true;
        }),
      }))
      .filter((cat) => {
        if (selectedCategory !== 'all' && cat.id !== selectedCategory) return false;
        return cat.resources.length > 0;
      });
  }, [categories, searchTerm, selectedCategory, selectedType, showFreeOnly]);

  const totalResources = useMemo(
    () => filteredCategories.reduce((acc, c) => acc + c.resources.length, 0),
    [filteredCategories],
  );

  const allTypes = ['all', 'documentation', 'tutorial', 'video', 'course', 'book', 'article', 'practice'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <section className="relative pt-16 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Best Learning{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resources
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hand-picked tutorials, courses, books, and videos for every stage of
              your developer journey. Free and paid, all vetted.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 mb-8"
          >
            <div className="relative mb-5">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search resources, topics, technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center pt-3 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
                Type:
              </span>
              {allTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors capitalize ${
                    selectedType === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
              <label className="ml-auto inline-flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFreeOnly}
                  onChange={(e) => setShowFreeOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Free only
              </label>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Showing {totalResources} resource{totalResources !== 1 ? 's' : ''}
            </p>
          </motion.div>

          <div className="space-y-10">
            <AnimatePresence mode="popLayout">
              {filteredCategories.map((cat, idx) => {
                const Icon = ICONS[cat.icon] ?? Layout;
                return (
                  <motion.div
                    key={cat.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                        <Icon size={22} />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {cat.title}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cat.resources.map((r) => {
                        const TypeIcon = TYPE_ICONS[r.type] ?? FileText;
                        return (
                          <motion.a
                            key={r.url}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -2 }}
                            className="group block p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${TYPE_COLORS[r.type] ?? TYPE_COLORS.documentation}`}
                                >
                                  <TypeIcon size={11} />
                                  {r.type}
                                </span>
                                <span
                                  className={`text-[10px] font-semibold uppercase tracking-wide ${LEVEL_COLORS[r.level] ?? LEVEL_COLORS.all}`}
                                >
                                  {r.level === 'all' ? 'All Levels' : r.level}
                                </span>
                                {r.free ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40">
                                    <CheckCircle2 size={10} /> Free
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
                                    Paid
                                  </span>
                                )}
                              </div>
                              <ExternalLink
                                size={14}
                                className="shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors"
                              />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-1">
                              {r.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              {r.description}
                            </p>
                          </motion.a>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredCategories.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-gray-400 dark:text-gray-500 mb-3">
                  <Search size={42} className="mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  No resources found
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Try adjusting search terms, category, type, or removing the
                  free-only filter.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
