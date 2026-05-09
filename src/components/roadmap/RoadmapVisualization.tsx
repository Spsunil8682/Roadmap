"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
  ChevronDown,
  ExternalLink,
  Lock,
  Sparkles,
  GraduationCap,
  Code2,
} from "lucide-react";
import {
  LeetCodeMap,
  LeetCodeProblem,
  QuizMap,
  QuizQuestion,
  Roadmap,
  RoadmapNode,
} from "@/types";
import QuizModal from "./QuizModal";

interface RoadmapVisualizationProps {
  roadmap: Roadmap;
  nodeProgress: Record<string, RoadmapNode["status"]>;
  onNodeClick: (node: RoadmapNode) => void;
  onStatusChange?: (nodeId: string, status: RoadmapNode["status"]) => void;
  quizMap?: QuizMap;
  leetcodeMap?: LeetCodeMap;
}

const statusOptions: {
  value: NonNullable<RoadmapNode["status"]>;
  label: string;
}[] = [
  { value: "not-started", label: "Not started" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "skipped", label: "Skipped" },
];

function difficultyClasses(d?: RoadmapNode["difficulty"]) {
  switch (d) {
    case "beginner":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "intermediate":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    case "advanced":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

export default function RoadmapVisualization({
  roadmap,
  nodeProgress,
  onNodeClick,
  onStatusChange,
  quizMap,
  leetcodeMap,
}: RoadmapVisualizationProps) {
  const orderedNodes = useMemo(
    () => [...roadmap.nodes].sort((a, b) => a.position.y - b.position.y),
    [roadmap.nodes],
  );

  const currentStepIndex = useMemo(() => {
    const idx = orderedNodes.findIndex(
      (n) =>
        nodeProgress[n.id] !== "completed" &&
        nodeProgress[n.id] !== "skipped",
    );
    return idx === -1 ? orderedNodes.length : idx;
  }, [orderedNodes, nodeProgress]);

  const [expandedId, setExpandedId] = useState<string | null>(
    orderedNodes[currentStepIndex]?.id ?? orderedNodes[0]?.id ?? null,
  );
  const [quizNode, setQuizNode] = useState<RoadmapNode | null>(null);

  const activeQuiz: QuizQuestion[] | null =
    quizNode && quizMap ? (quizMap[quizNode.id] ?? null) : null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="relative">
        <div
          aria-hidden
          className="absolute left-[27px] sm:left-[31px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-transparent dark:from-blue-900 dark:via-purple-900"
        />

        <ul className="space-y-4">
          {orderedNodes.map((node, index) => {
            const status = nodeProgress[node.id] ?? "not-started";
            const isCurrent = index === currentStepIndex;
            const isLocked = index > currentStepIndex;
            const isExpanded = expandedId === node.id;
            const quizCount = quizMap?.[node.id]?.length ?? 0;
            const leetcodeProblems = leetcodeMap?.[node.id] ?? [];

            return (
              <TimelineStep
                key={node.id}
                node={node}
                index={index}
                status={status}
                isCurrent={isCurrent}
                isLocked={isLocked}
                isExpanded={isExpanded}
                quizCount={quizCount}
                leetcodeProblems={leetcodeProblems}
                onToggle={() =>
                  setExpandedId((prev) => (prev === node.id ? null : node.id))
                }
                onStatusChange={(s) => onStatusChange?.(node.id, s)}
                onOpenDetails={() => onNodeClick(node)}
                onStartQuiz={() => setQuizNode(node)}
              />
            );
          })}
        </ul>
      </div>

      <QuizModal
        isOpen={!!quizNode && !!activeQuiz?.length}
        onClose={() => setQuizNode(null)}
        topicTitle={quizNode?.title ?? ""}
        questions={activeQuiz ?? []}
      />
    </div>
  );
}

interface TimelineStepProps {
  node: RoadmapNode;
  index: number;
  status: NonNullable<RoadmapNode["status"]>;
  isCurrent: boolean;
  isLocked: boolean;
  isExpanded: boolean;
  quizCount: number;
  leetcodeProblems: LeetCodeProblem[];
  onToggle: () => void;
  onStatusChange: (s: RoadmapNode["status"]) => void;
  onOpenDetails: () => void;
  onStartQuiz: () => void;
}

function TimelineStep({
  node,
  index,
  status,
  isCurrent,
  isLocked,
  isExpanded,
  quizCount,
  leetcodeProblems,
  onToggle,
  onStatusChange,
  onOpenDetails,
  onStartQuiz,
}: TimelineStepProps) {
  const StatusBadge = () => {
    if (status === "completed")
      return (
        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <CheckCircle2 size={14} /> Completed
        </span>
      );
    if (status === "in-progress")
      return (
        <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-medium">
          <Clock size={14} /> In progress
        </span>
      );
    if (status === "skipped")
      return (
        <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs font-medium">
          <XCircle size={14} /> Skipped
        </span>
      );
    if (isCurrent)
      return (
        <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 text-xs font-medium">
          <Sparkles size={14} /> Start here
        </span>
      );
    if (isLocked)
      return (
        <span className="inline-flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs font-medium">
          <Lock size={12} /> Up next
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs font-medium">
        <Circle size={14} /> Not started
      </span>
    );
  };

  const NodeMarker = () => {
    let inner: React.ReactNode = (
      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
        {index + 1}
      </span>
    );
    let bg = "bg-white dark:bg-gray-900";
    let ring = "ring-gray-300 dark:ring-gray-700";

    if (status === "completed") {
      inner = <CheckCircle2 size={20} className="text-white" />;
      bg = "bg-emerald-500";
      ring = "ring-emerald-300 dark:ring-emerald-800";
    } else if (status === "in-progress") {
      inner = <Clock size={18} className="text-white" />;
      bg = "bg-blue-500";
      ring = "ring-blue-300 dark:ring-blue-800";
    } else if (status === "skipped") {
      inner = <XCircle size={18} className="text-white" />;
      bg = "bg-gray-400";
      ring = "ring-gray-300 dark:ring-gray-700";
    } else if (isCurrent) {
      inner = (
        <span className="text-sm font-bold text-white">{index + 1}</span>
      );
      bg = "bg-gradient-to-br from-blue-500 to-purple-600";
      ring = "ring-purple-300 dark:ring-purple-800";
    } else if (isLocked) {
      inner = <Lock size={14} className="text-gray-400" />;
    }

    return (
      <div className="relative shrink-0">
        {isCurrent && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-purple-400/40"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <div
          className={`relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full ${bg} ring-4 ${ring} shadow-md flex items-center justify-center transition-colors duration-300`}
        >
          {inner}
        </div>
      </div>
    );
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.5) }}
      className="relative flex gap-3 sm:gap-4"
    >
      <NodeMarker />

      <motion.div
        layout
        className={`flex-1 rounded-2xl border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow ${
          isCurrent
            ? "border-purple-300 dark:border-purple-700 ring-1 ring-purple-200 dark:ring-purple-900"
            : isLocked
              ? "border-gray-200 dark:border-gray-700 opacity-80"
              : "border-gray-200 dark:border-gray-700"
        }`}
      >
        <button
          onClick={onToggle}
          className="w-full text-left p-4 sm:p-5 cursor-pointer"
          aria-expanded={isExpanded}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-semibold tracking-wide text-gray-400 dark:text-gray-500 uppercase">
                  Step {index + 1}
                </span>
                {node.difficulty && (
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${difficultyClasses(node.difficulty)}`}
                  >
                    {node.difficulty}
                  </span>
                )}
                <StatusBadge />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {node.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {node.description}
              </p>
            </div>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 mt-1 text-gray-400"
            >
              <ChevronDown size={20} />
            </motion.div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-gray-100 dark:border-gray-700">
                {node.children && node.children.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                      What you&apos;ll learn
                    </h4>
                    <ul className="flex flex-wrap gap-2">
                      {node.children.map((child) => (
                        <li
                          key={child.id}
                          className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800"
                        >
                          {child.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {node.resources.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                      Resources
                    </h4>
                    <ul className="space-y-2">
                      {node.resources.map((r, i) => (
                        <li key={`${r.url}-${i}`}>
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between gap-2 text-sm rounded-lg px-3 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              <span className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 shrink-0 px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                                {r.type}
                              </span>
                              <span className="truncate text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {r.title}
                              </span>
                            </span>
                            <ExternalLink
                              size={14}
                              className="shrink-0 text-gray-400 group-hover:text-blue-500"
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                    Mark progress
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((opt) => {
                      const active = status === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => onStatusChange(opt.value)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                            active
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-blue-400"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                    <button
                      onClick={onOpenDetails}
                      className="ml-auto text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2"
                    >
                      Open full view
                    </button>
                  </div>
                </div>

                {quizCount > 0 && (
                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-100 dark:border-blue-900 p-4">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center">
                          <GraduationCap size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Test your knowledge
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                            {status === "completed"
                              ? `${quizCount} interview-style questions ready.`
                              : "Complete this section first to unlock the quiz."}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onStartQuiz}
                        disabled={status !== "completed"}
                        className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-sm"
                      >
                        {status === "completed" ? (
                          <>Take quiz</>
                        ) : (
                          <>
                            <Lock size={14} /> Locked
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {leetcodeProblems.length > 0 && (
                  <div className="mt-4">
                    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-100 dark:border-amber-900 p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center">
                          <Code2 size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Practice on LeetCode
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                            {leetcodeProblems.length} hand-picked problems for this topic.
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {leetcodeProblems.map((p, i) => (
                          <li key={`${p.url}-${i}`}>
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-amber-100/40 dark:hover:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 transition-colors"
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <span
                                  className={`shrink-0 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                                    p.difficulty === "Easy"
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                      : p.difficulty === "Medium"
                                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
                                  }`}
                                >
                                  {p.difficulty}
                                </span>
                                <span className="truncate text-sm text-gray-800 dark:text-gray-200 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                                  {p.title}
                                </span>
                              </span>
                              <ExternalLink
                                size={14}
                                className="shrink-0 text-gray-400 group-hover:text-amber-600"
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.li>
  );
}
