'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, Circle, Star } from 'lucide-react';
import { RoadmapNode } from '@/types';

interface RoadmapNodeComponentProps {
  node: RoadmapNode;
  status?: RoadmapNode['status'];
  onClick: () => void;
  scale: number;
}

export default function RoadmapNodeComponent({
  node,
  status = 'not-started',
  onClick,
  scale,
}: RoadmapNodeComponentProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-white" />;
      case 'in-progress':
        return <Clock size={16} className="text-white" />;
      case 'skipped':
        return <XCircle size={16} className="text-white" />;
      default:
        return <Circle size={16} className="text-white" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-green-600';
      case 'in-progress':
        return 'from-yellow-500 to-yellow-600';
      case 'skipped':
        return 'from-red-400 to-red-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getDifficultyColor = () => {
    switch (node.difficulty) {
      case 'beginner':
        return 'border-green-300 dark:border-green-600';
      case 'intermediate':
        return 'border-yellow-300 dark:border-yellow-600';
      case 'advanced':
        return 'border-red-300 dark:border-red-600';
      default:
        return 'border-gray-300 dark:border-gray-600';
    }
  };

  const nodeSize = Math.max(120 * scale, 80); // Minimum size of 80px
  const fontSize = Math.max(12 * scale, 10); // Minimum font size of 10px

  return (
    <motion.div
      whileHover={{ scale: 1.1, z: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer relative group"
      style={{ width: nodeSize, height: nodeSize }}
    >
      {/* Node background */}
      <div
        className={`w-full h-full rounded-xl bg-white dark:bg-gray-800 border-2 ${getDifficultyColor()} shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center p-3 relative overflow-hidden`}
      >
        {/* Status indicator */}
        <div
          className={`absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r ${getStatusColor()} flex items-center justify-center shadow-sm`}
        >
          {getStatusIcon()}
        </div>

        {/* Difficulty indicator */}
        {node.difficulty && (
          <div className="absolute top-2 left-2">
            <div className="flex">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={`${
                    i < (node.difficulty === 'beginner' ? 1 : node.difficulty === 'intermediate' ? 2 : 3)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Node content */}
        <div className="text-center flex-1 flex flex-col justify-center">
          <h3
            className="font-semibold text-gray-900 dark:text-white mb-1 leading-tight"
            style={{ fontSize: `${fontSize}px` }}
          >
            {node.title}
          </h3>
          {scale > 0.7 && (
            <p
              className="text-gray-600 dark:text-gray-300 text-xs leading-tight line-clamp-2"
              style={{ fontSize: `${Math.max(fontSize - 2, 8)}px` }}
            >
              {node.description}
            </p>
          )}
        </div>

        {/* Resource count */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-center">
          <span
            className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
            style={{ fontSize: `${Math.max(fontSize - 3, 7)}px` }}
          >
            {node.resources.length} resource{node.resources.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      </div>

      {/* Prerequisites indicator */}
      {node.prerequisites && node.prerequisites.length > 0 && (
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{node.prerequisites.length}</span>
        </div>
      )}

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
        <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
          <div className="font-semibold">{node.title}</div>
          {node.difficulty && (
            <div className="text-gray-300 dark:text-gray-400 capitalize">
              {node.difficulty} level
            </div>
          )}
          <div className="text-gray-300 dark:text-gray-400">
            Click to view details
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      </div>

      {/* Pulse animation for in-progress nodes */}
      {status === 'in-progress' && (
        <div className="absolute inset-0 rounded-xl border-2 border-yellow-400 animate-pulse" />
      )}

      {/* Glow effect for completed nodes */}
      {status === 'completed' && (
        <div className="absolute inset-0 rounded-xl shadow-lg shadow-green-500/25 animate-pulse" />
      )}
    </motion.div>
  );
}