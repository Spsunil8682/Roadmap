import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import type { LeetCodeMap, QuizMap, Roadmap } from '@/types';
import roadmapsData from '@/data/roadmaps.json';
import quizzesData from '@/data/quizzes.json';
import leetcodeData from '@/data/leetcode-problems.json';
import RoadmapProgressClient from '@/components/roadmap/RoadmapProgressClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return roadmapsData.roadmaps.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const roadmap = roadmapsData.roadmaps.find((r) => r.id === id);
  if (!roadmap) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  return {
    title: roadmap.title,
    description: roadmap.description,
    alternates: { canonical: `/roadmap/${id}` },
    openGraph: {
      type: 'website',
      title: `${roadmap.title} | Developer Roadmaps`,
      description: roadmap.description,
      url: `${siteUrl}/roadmap/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${roadmap.title} | Developer Roadmaps`,
      description: roadmap.description,
    },
  };
}

export default async function RoadmapPage({ params }: Props) {
  const { id } = await params;
  const roadmap = roadmapsData.roadmaps.find((r) => r.id === id) as Roadmap | undefined;
  if (!roadmap) notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Static back-nav — server rendered */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back to Roadmaps</span>
          </Link>
        </div>
      </div>

      {/* Static roadmap info — server rendered, instantly visible, fully SEO-crawlable */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {roadmap.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-3xl">
            {roadmap.description}
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-300 mb-4">
            <div className="flex items-center space-x-2">
              <Clock size={16} />
              <span>Estimated time: {roadmap.estimatedTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={16} />
              <span>Difficulty: {roadmap.difficulty}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen size={16} />
              <span>{roadmap.nodes.length} learning steps</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {roadmap.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Client component: progress bar + visualization + modals */}
      <RoadmapProgressClient
        roadmap={roadmap}
        quizMap={quizzesData as QuizMap}
        leetcodeMap={leetcodeData as LeetCodeMap}
      />
    </div>
  );
}
