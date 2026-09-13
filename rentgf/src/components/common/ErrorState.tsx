import { ReactNode } from "react";

export default function ErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h3 className="font-medium text-lg mb-2 text-red-600">Something went wrong</h3>
      <p className="text-gray-500 mb-4">{error}</p>
      {onRetry && (
        <button onClick={onRetry} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">
          Try Again
        </button>
      )}
    </div>
  );
}
