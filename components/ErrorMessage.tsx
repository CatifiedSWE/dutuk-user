'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message = 'Failed to load data', onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="font-poppins font-semibold text-lg text-red-700 mb-2">
          Something went wrong
        </h3>
        <p className="font-urbanist text-red-600 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ message = 'No data available' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md">
        <p className="font-urbanist text-[#4F0000]/60 text-lg">{message}</p>
      </div>
    </div>
  );
}