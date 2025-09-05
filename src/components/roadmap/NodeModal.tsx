'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, BookOpen, Video, FileText, Globe, CheckCircle, Clock, XCircle, Circle } from 'lucide-react';
import { RoadmapNode } from '@/types';

interface NodeModalProps {
  node: RoadmapNode | null;
  isOpen: boolean;
  onClose: () => void;
  currentStatus?: RoadmapNode['status'];
  onStatusChange: (nodeId: string, status: RoadmapNode['status']) => void;
}

export default function NodeModal({
  node,
  isOpen,
  onClose,
  currentStatus = 'not-started',
  onStatusChange,
}: NodeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<RoadmapNode['status']>(currentStatus);

  if (!node) return null;

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} className="text-red-500" />;
      case 'documentation':
        return <FileText size={16} className="text-blue-500" />;
      case 'tutorial':
        return <BookOpen size={16} className="text-green-500" />;
      case 'course':
        return <Globe size={16} className="text-purple-500" />;
      default:
        return <ExternalLink size={16} className="text-gray-500" />;
    }
  };

  const statusOptions = [
    { value: 'not-started', label: 'Not Started', icon: Circle, color: 'text-gray-500' },
    { value: 'in-progress', label: 'In Progress', icon: Clock, color: 'text-yellow-500' },
    { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-500' },
    { value: 'skipped', label: 'Skipped', icon: XCircle, color: 'text-red-500' },
  ] as const;

  const handleStatusChange = (status: RoadmapNode['status']) => {
    setSelectedStatus(status);
    onStatusChange(node.id, status);
  };

  const handleClose = () => {
    setSelectedStatus(currentStatus);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {node.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {node.description}
                </p>
                {node.difficulty && (
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      node.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : node.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {node.difficulty} level
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleClose}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Prerequisites */}
              {node.prerequisites && node.prerequisites.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Prerequisites
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {node.prerequisites.map((prereq) => (
                      <span
                        key={prereq}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                      >
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Status */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Progress Status
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                          selectedStatus === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <Icon size={20} className={option.color} />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Learning Resources ({node.resources.length})
                </h3>
                <div className="space-y-3">
                  {node.resources.map((resource, index) => (
                    <motion.a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 group"
                    >
                      <div className="flex-shrink-0">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {resource.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {resource.type}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {node.resources.length} learning resource{node.resources.length !== 1 ? 's' : ''} available
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Mark as in-progress if not already completed
                    if (selectedStatus === 'not-started') {
                      handleStatusChange('in-progress');
                    }
                    handleClose();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Start Learning
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}