'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ExternalLink,
  Clock,
  Briefcase,
  Layout,
  Server,
  Code2,
  Workflow,
  Network,
  Boxes,
  Newspaper,
  User,
} from 'lucide-react';
import blogsData from '@/data/blogs.json';

interface Blog {
  title: string;
  author: string;
  description: string;
  url: string;
  readTime: string;
  level: string;
  tags: string[];
}

interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  blogs: Blog[];
}

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Briefcase,
  Layout,
  Server,
  Code2,
  Workflow,
  Network,
  Boxes,
  Newspaper,
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
  intermediate: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
  advanced: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
  all: 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800',
};

export default function BlogPage() {
  const categories = blogsData.categories as Category[];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        blogs: cat.blogs.filter((b) => {
          if (!searchTerm) return true;
          const q = searchTerm.toLowerCase();
          return (
            b.title.toLowerCase().includes(q) ||
            b.description.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.tags.some((t) => t.toLowerCase().includes(q))
          );
        }),
      }))
      .filter((cat) => {
        if (selectedCategory !== 'all' && cat.id !== selectedCategory) return false;
        return cat.blogs.length > 0;
      });
  }, [categories, searchTerm, selectedCategory]);

  const totalBlogs = useMemo(
    () => filteredCategories.reduce((acc, c) => acc + c.blogs.length, 0),
    [filteredCategories],
  );

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
              Best Developer{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Blogs
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hand-picked blogs and writers covering interview prep, frontend,
              backend, JavaScript, full-stack, DSA, and system design.
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
                placeholder="Search blogs by title, author, or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
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

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Showing {totalBlogs} blog{totalBlogs !== 1 ? 's' : ''}
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
                      {cat.blogs.map((b) => (
                        <motion.a
                          key={b.url}
                          href={b.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ y: -2 }}
                          className="group block p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 dark:text-gray-300">
                                <User size={11} />
                                {b.author}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                                <Clock size={11} />
                                {b.readTime}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${LEVEL_COLORS[b.level] ?? LEVEL_COLORS.all}`}
                              >
                                {b.level === 'all' ? 'All Levels' : b.level}
                              </span>
                            </div>
                            <ExternalLink
                              size={14}
                              className="shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors"
                            />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-1.5">
                            {b.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                            {b.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {b.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </motion.a>
                      ))}
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
                  No blogs found
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Try a different search term or category.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
