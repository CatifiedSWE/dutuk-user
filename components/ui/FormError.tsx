/**
 * FormError Component
 * Displays form validation errors in a styled container
 */

import React from 'react';

interface FormErrorProps {
  message: string;
  show?: boolean;
}

export default function FormError({ message, show = true }: FormErrorProps) {
  if (!show || !message) return null;

  return (
    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
      <span className="material-symbols-outlined text-red-500 text-lg mt-0.5">
        error
      </span>
      <p className="text-sm text-red-600 flex-1">{message}</p>
    </div>
  );
}

interface FormErrorListProps {
  errors: string[];
  show?: boolean;
}

export function FormErrorList({ errors, show = true }: FormErrorListProps) {
  if (!show || !errors || errors.length === 0) return null;

  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-2 mb-2">
        <span className="material-symbols-outlined text-red-500 text-lg">
          error
        </span>
        <p className="text-sm font-medium text-red-700">
          Please fix the following errors:
        </p>
      </div>
      <ul className="ml-7 space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-sm text-red-600">
            • {error}
          </li>
        ))}
      </ul>
    </div>
  );
}
