'use client';

export default function RetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
    >
      Retry
    </button>
  );
}
