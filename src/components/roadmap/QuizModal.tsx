"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Trophy,
  Lightbulb,
} from "lucide-react";
import { QuizQuestion } from "@/types";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  questions: QuizQuestion[];
}

export default function QuizModal({
  isOpen,
  onClose,
  topicTitle,
  questions,
}: QuizModalProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnswers({});
      setCurrentIndex(0);
      setSubmitted(false);
    }
  }, [isOpen, questions]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const total = questions.length;
  const score = useMemo(
    () =>
      questions.reduce(
        (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
        0,
      ),
    [questions, answers],
  );
  const allAnswered = useMemo(
    () => questions.every((q) => answers[q.id] !== undefined),
    [questions, answers],
  );

  const select = (qid: string, idx: number) => {
    if (submitted) return;
    setAnswers((p) => ({ ...p, [qid]: idx }));
  };

  const submit = () => setSubmitted(true);
  const reset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
  };

  if (!questions.length) return null;

  const current = questions[currentIndex];
  const progressPct = ((currentIndex + 1) / total) * 100;
  const scorePct = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-2xl max-h-[92vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  Knowledge Check
                </p>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {topicTitle}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close quiz"
                className="ml-3 shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {!submitted && (
              <div className="px-5 sm:px-6 pt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>
                    Question {currentIndex + 1} of {total}
                  </span>
                  <span>
                    {Object.keys(answers).length}/{total} answered
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={false}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
              {!submitted ? (
                <QuestionView
                  key={current.id}
                  question={current}
                  selected={answers[current.id]}
                  onSelect={(i) => select(current.id, i)}
                />
              ) : (
                <ResultsView
                  questions={questions}
                  answers={answers}
                  score={score}
                  scorePct={scorePct}
                />
              )}
            </div>

            <div className="px-5 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60">
              {!submitted ? (
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>

                  {currentIndex < total - 1 ? (
                    <button
                      onClick={() =>
                        setCurrentIndex((i) => Math.min(total - 1, i + 1))
                      }
                      className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={submit}
                      disabled={!allAnswered}
                      className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Trophy size={16} /> Submit quiz
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <RotateCcw size={14} /> Retake
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function QuestionView({
  question,
  selected,
  onSelect,
}: {
  question: QuizQuestion;
  selected: number | undefined;
  onSelect: (i: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 leading-snug">
        {question.question}
      </h3>
      <ul className="space-y-2.5">
        {question.options.map((opt, i) => {
          const active = selected === i;
          return (
            <li key={i}>
              <button
                onClick={() => onSelect(i)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-start gap-3 ${
                  active
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 shadow-sm"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800"
                }`}
              >
                <span
                  className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    active
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 dark:border-gray-600 text-gray-500"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                  {opt}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

function ResultsView({
  questions,
  answers,
  score,
  scorePct,
}: {
  questions: QuizQuestion[];
  answers: Record<string, number>;
  score: number;
  scorePct: number;
}) {
  const grade =
    scorePct >= 90
      ? { label: "Excellent! 🏆", tone: "text-emerald-600 dark:text-emerald-400" }
      : scorePct >= 70
        ? { label: "Great job! 👏", tone: "text-blue-600 dark:text-blue-400" }
        : scorePct >= 50
          ? { label: "Not bad — review and retry.", tone: "text-amber-600 dark:text-amber-400" }
          : { label: "Keep learning — you'll get it!", tone: "text-rose-600 dark:text-rose-400" };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 border border-blue-100 dark:border-blue-900 p-5 mb-5 text-center"
      >
        <Trophy
          size={32}
          className="mx-auto mb-2 text-purple-600 dark:text-purple-400"
        />
        <p className="text-sm text-gray-600 dark:text-gray-300">Your score</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {score} / {questions.length}
          <span className="text-base font-normal text-gray-500 dark:text-gray-400 ml-2">
            ({scorePct}%)
          </span>
        </p>
        <p className={`mt-2 text-sm font-medium ${grade.tone}`}>{grade.label}</p>
      </motion.div>

      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
        Review answers
      </h4>
      <ul className="space-y-3">
        {questions.map((q, qi) => {
          const userIdx = answers[q.id];
          const correct = userIdx === q.correctIndex;
          return (
            <motion.li
              key={q.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qi * 0.03 }}
              className={`rounded-xl border p-4 ${
                correct
                  ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20"
                  : "border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20"
              }`}
            >
              <div className="flex items-start gap-2 mb-2">
                {correct ? (
                  <CheckCircle2
                    size={18}
                    className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400"
                  />
                ) : (
                  <XCircle
                    size={18}
                    className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400"
                  />
                )}
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {qi + 1}. {q.question}
                </p>
              </div>

              <div className="ml-6 space-y-1.5 text-sm">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.correctIndex;
                  const isUser = oi === userIdx;
                  let cls =
                    "text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700";
                  if (isCorrect)
                    cls =
                      "text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 bg-emerald-100/60 dark:bg-emerald-900/30 font-medium";
                  else if (isUser && !isCorrect)
                    cls =
                      "text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 bg-rose-100/60 dark:bg-rose-900/30";
                  return (
                    <div
                      key={oi}
                      className={`px-3 py-1.5 rounded-lg border text-xs ${cls}`}
                    >
                      <span className="font-semibold mr-1.5">
                        {String.fromCharCode(65 + oi)}.
                      </span>
                      {opt}
                      {isCorrect && (
                        <span className="ml-2 text-[10px] uppercase font-bold tracking-wide">
                          ✓ Correct
                        </span>
                      )}
                      {isUser && !isCorrect && (
                        <span className="ml-2 text-[10px] uppercase font-bold tracking-wide">
                          Your answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="ml-6 mt-3 flex gap-2 text-sm bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-lg p-3">
                <Lightbulb
                  size={16}
                  className="shrink-0 mt-0.5 text-blue-600 dark:text-blue-400"
                />
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    Why:{" "}
                  </span>
                  {q.explanation}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
