'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Roadmap, RoadmapNode } from '@/types';
import RoadmapNodeComponent from './RoadmapNodeComponent';

interface RoadmapVisualizationProps {
  roadmap: Roadmap;
  nodeProgress: Record<string, RoadmapNode['status']>;
  onNodeClick: (node: RoadmapNode) => void;
}

export default function RoadmapVisualization({
  roadmap,
  nodeProgress,
  onNodeClick,
}: RoadmapVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1400, height: 1000 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.parentElement?.getBoundingClientRect();
        if (rect) {
          setDimensions({
            width: rect.width,
            height: rect.height,
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate the bounds of all nodes to center the visualization
  const getNodeBounds = () => {
    if (roadmap.nodes.length === 0) return { minX: 0, maxX: 800, minY: 0, maxY: 600 };

    const positions = roadmap.nodes.map(node => node.position);
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));

    return { minX, maxX, minY, maxY };
  };

  const bounds = getNodeBounds();
  const padding = 200;
  const contentWidth = bounds.maxX - bounds.minX + padding * 2;
  const contentHeight = bounds.maxY - bounds.minY + padding * 2;

  // Calculate scale to fit content in viewport
  const scaleX = dimensions.width / contentWidth;
  const scaleY = dimensions.height / contentHeight;
  const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1

  // Calculate offset to center the content
  const offsetX = (dimensions.width - contentWidth * scale) / 2 - (bounds.minX - padding) * scale;
  const offsetY = (dimensions.height - contentHeight * scale) / 2 - (bounds.minY - padding) * scale;

  const renderConnections = () => {
    return roadmap.connections.map((connection, index) => {
      const fromNode = roadmap.nodes.find(n => n.id === connection.from);
      const toNode = roadmap.nodes.find(n => n.id === connection.to);

      if (!fromNode || !toNode) return null;

      const fromX = fromNode.position.x * scale + offsetX;
      const fromY = fromNode.position.y * scale + offsetY;
      const toX = toNode.position.x * scale + offsetX;
      const toY = toNode.position.y * scale + offsetY;

      // Calculate control points for curved line
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      const dx = toX - fromX;
      const dy = toY - fromY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const curvature = Math.min(distance * 0.2, 50);

      // Perpendicular offset for curve
      const perpX = -dy / distance * curvature;
      const perpY = dx / distance * curvature;

      const controlX = midX + perpX;
      const controlY = midY + perpY;

      const fromStatus = nodeProgress[fromNode.id];
      const toStatus = nodeProgress[toNode.id];
      
      // Connection color based on progress
      let strokeColor = '#e5e7eb'; // gray-200
      if (fromStatus === 'completed' && toStatus === 'completed') {
        strokeColor = '#10b981'; // green-500
      } else if (fromStatus === 'completed' || toStatus === 'in-progress') {
        strokeColor = '#f59e0b'; // amber-500
      }

      return (
        <motion.path
          key={`${connection.from}-${connection.to}-${index}`}
          d={`M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`}
          stroke={strokeColor}
          strokeWidth="2"
          fill="none"
          strokeDasharray={fromStatus === 'completed' ? '0' : '5,5'}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          className="transition-colors duration-300"
        />
      );
    });
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="absolute inset-0"
      >
        {/* Grid pattern */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="1"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Connections */}
        <g>{renderConnections()}</g>
      </svg>

      {/* Nodes */}
      <div className="absolute inset-0">
        {roadmap.nodes.map((node, index) => {
          const x = node.position.x * scale + offsetX;
          const y = node.position.y * scale + offsetY;

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <RoadmapNodeComponent
                node={node}
                status={nodeProgress[node.id]}
                onClick={() => onNodeClick(node)}
                scale={scale}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Progress Legend
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-gray-600 dark:text-gray-300">Not Started</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-gray-600 dark:text-gray-300">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-300">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-gray-600 dark:text-gray-300">Skipped</span>
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
          <span className="text-lg font-bold">+</span>
        </button>
        <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
          <span className="text-lg font-bold">−</span>
        </button>
      </div>
    </div>
  );
}