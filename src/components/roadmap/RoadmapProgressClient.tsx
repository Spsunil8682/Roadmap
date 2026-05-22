'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LeetCodeMap, QuizMap, Roadmap, RoadmapNode } from '@/types';
import RoadmapVisualization from './RoadmapVisualization';
import NodeModal from './NodeModal';

interface Props {
  roadmap: Roadmap;
  quizMap: QuizMap;
  leetcodeMap: LeetCodeMap;
}

export default function RoadmapProgressClient({ roadmap, quizMap, leetcodeMap }: Props) {
  const [nodeProgress, setNodeProgress] = useState<Record<string, RoadmapNode['status']>>({});
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`roadmap-progress-${roadmap.id}`);
    if (saved) setNodeProgress(JSON.parse(saved));
  }, [roadmap.id]);

  const handleStatusChange = (nodeId: string, status: RoadmapNode['status']) => {
    const updated = { ...nodeProgress, [nodeId]: status };
    setNodeProgress(updated);
    localStorage.setItem(`roadmap-progress-${roadmap.id}`, JSON.stringify(updated));
  };

  const total = roadmap.nodes.length;
  const completed = roadmap.nodes.filter((n) => nodeProgress[n.id] === 'completed').length;
  const progressPct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <>
      {/* Progress bar strip */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300 shrink-0">
              Progress: {completed}/{total} completed
            </span>
            <div className="flex-1 max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 shrink-0">
              {Math.round(progressPct)}%
            </span>
          </div>
        </div>
      </div>

      {/* Roadmap visualization */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Your learning path
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Follow the steps in order. Tap any step to expand resources, then mark your
                progress to keep moving.
              </p>
            </div>

            <RoadmapVisualization
              roadmap={roadmap}
              nodeProgress={nodeProgress}
              onNodeClick={(node) => {
                setSelectedNode(node);
                setIsModalOpen(true);
              }}
              onStatusChange={handleStatusChange}
              quizMap={quizMap}
              leetcodeMap={leetcodeMap}
            />
          </motion.div>
        </div>
      </div>

      <NodeModal
        node={selectedNode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentStatus={selectedNode ? nodeProgress[selectedNode.id] : undefined}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
