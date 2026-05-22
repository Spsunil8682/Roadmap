import Link from 'next/link';
import type { Metadata } from 'next';
import RetryButton from './RetryButton';

export const metadata: Metadata = {
  title: "You're offline",
  description: 'No internet connection detected.',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-blue-500 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M8.111 8.111A5.5 5.5 0 0 0 6.5 12a5.5 5.5 0 0 0 5.5 5.5c1.43 0 2.733-.546 3.71-1.44M12 6.5a5.5 5.5 0 0 1 5.5 5.5M12 3a9 9 0 0 1 7.364 3.836M4.636 4.636A9 9 0 0 0 3 9"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          You&apos;re offline
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          No internet connection detected.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Previously visited roadmaps are still available — check the pages you&apos;ve opened
          before. Your progress is saved locally and will sync when you&apos;re back online.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
          >
            Try homepage
          </Link>
          <RetryButton />
        </div>

        <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
          Your roadmap progress is always stored locally — nothing is lost.
        </p>
      </div>
    </div>
  );
}
