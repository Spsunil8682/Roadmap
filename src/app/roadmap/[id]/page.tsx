'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Roadmap, RoadmapNode } from '@/types';
import roadmapsData from '@/data/roadmaps.json';
import RoadmapVisualization from '@/components/roadmap/RoadmapVisualization';
import NodeModal from '@/components/roadmap/NodeModal';

export default function RoadmapPage() {
  const params = useParams();
  const roadmapId = params.id as string;
  
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [nodeProgress, setNodeProgress] = useState<Record<string, RoadmapNode['status']>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const foundRoadmap = roadmapsData.roadmaps.find(r => r.id === roadmapId) as Roadmap;
    if (foundRoadmap) {
      setRoadmap(foundRoadmap);
      // Load progress from localStorage
      const savedProgress = localStorage.getItem(`roadmap-progress-${roadmapId}`);
      if (savedProgress) {
        setNodeProgress(JSON.parse(savedProgress));
      }
    }
  }, [roadmapId]);

  const handleNodeClick = (node: RoadmapNode) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  };

  const handleNodeStatusChange = (nodeId: string, status: RoadmapNode['status']) => {
    const newProgress = { ...nodeProgress, [nodeId]: status };
    setNodeProgress(newProgress);
    // Save to localStorage
    localStorage.setItem(`roadmap-progress-${roadmapId}`, JSON.stringify(newProgress));
  };

  const getProgressStats = () => {
    if (!roadmap) return { completed: 0, inProgress: 0, total: 0 };
    
    const total = roadmap.nodes.length;
    const completed = roadmap.nodes.filter(node => nodeProgress[node.id] === 'completed').length;
    const inProgress = roadmap.nodes.filter(node => nodeProgress[node.id] === 'in-progress').length;
    
    return { completed, inProgress, total };
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  const stats = getProgressStats();
  const progressPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <ArrowLeft size={20} />
                <span>Back to Roadmaps</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Progress: {stats.completed}/{stats.total} completed
              </div>
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Info */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {roadmap.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-3xl">
              {roadmap.description}
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-300">
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

            <div className="flex flex-wrap gap-2 mt-4">
              {roadmap.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Roadmap Visualization */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Learning Path
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Click on any node to view details and resources. Track your progress as you learn.
              </p>
            </div>
            
            <div className="h-[600px] relative">
              <RoadmapVisualization
                roadmap={roadmap}
                nodeProgress={nodeProgress}
                onNodeClick={handleNodeClick}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Node Modal */}
      <NodeModal
        node={selectedNode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentStatus={selectedNode ? nodeProgress[selectedNode.id] : undefined}
        onStatusChange={handleNodeStatusChange}
      />
    </div>
  );
}