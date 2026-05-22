'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Map, BookOpen, Code2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import roadmapsData from '@/data/roadmaps.json';
import guidesData from '@/data/guides.json';
import projectsData from '@/data/projects.json';

type ItemType = 'roadmap' | 'guide' | 'project';

interface ResultItem {
  id: string;
  label: string;
  description: string;
  href: string;
  type: ItemType;
  meta?: string;
}

const searchIndex: ResultItem[] = [
  ...roadmapsData.roadmaps.map((r) => ({
    id: r.id,
    label: r.title,
    description: r.description,
    href: `/roadmap/${r.id}`,
    type: 'roadmap' as const,
    meta: r.difficulty,
  })),
  ...guidesData.guides.map((g) => ({
    id: g.id,
    label: g.title,
    description: g.description,
    href: '/guides',
    type: 'guide' as const,
    meta: `${g.readTime} min read`,
  })),
  ...projectsData.projects.map((p) => ({
    id: p.id,
    label: p.title,
    description: p.description,
    href: '/projects',
    type: 'project' as const,
    meta: p.difficulty,
  })),
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? searchIndex.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()),
      )
    : searchIndex;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      // Small delay so the AnimatePresence mount completes before focus
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filtered[activeIndex]) {
        navigate(filtered[activeIndex].href);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, filtered, activeIndex, navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: 'spring', duration: 0.28, bounce: 0.1 }}
            className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Search input row */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search roadmaps, guides, projects…"
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm"
              />
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  aria-label="Clear"
                >
                  <X size={16} />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center text-[11px] text-gray-400 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded font-mono">
                  esc
                </kbd>
              )}
            </div>

            {/* Results */}
            <ul ref={listRef} className="max-h-[340px] overflow-y-auto py-2" role="listbox">
              {filtered.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-gray-400">
                  No results for &ldquo;{query}&rdquo;
                </li>
              ) : (
                filtered.map((item, i) => (
                  <li key={`${item.type}-${item.id}`} role="option" aria-selected={activeIndex === i}>
                    <button
                      onClick={() => navigate(item.href)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                        activeIndex === i
                          ? 'bg-blue-50 dark:bg-blue-950/50'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                      }`}
                    >
                      <TypeIcon type={item.type} active={activeIndex === i} />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {item.description}
                        </p>
                      </div>

                      {item.meta && (
                        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
                          {item.meta}
                        </span>
                      )}

                      <ArrowRight
                        size={14}
                        className={`shrink-0 transition-colors ${
                          activeIndex === i ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  </li>
                ))
              )}
            </ul>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex gap-4 text-[11px] text-gray-400">
              <span>
                <kbd className="font-mono">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="font-mono">↵</kbd> open
              </span>
              <span>
                <kbd className="font-mono">esc</kbd> close
              </span>
              <span className="ml-auto">{filtered.length} results</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function TypeIcon({ type, active }: { type: ItemType; active: boolean }) {
  const base = `shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
    active ? 'bg-blue-100 dark:bg-blue-900/60' : 'bg-gray-100 dark:bg-gray-800'
  }`;
  const iconCls = active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400';

  if (type === 'roadmap') return <div className={base}><Map size={14} className={iconCls} /></div>;
  if (type === 'guide') return <div className={base}><BookOpen size={14} className={iconCls} /></div>;
  return <div className={base}><Code2 size={14} className={iconCls} /></div>;
}
