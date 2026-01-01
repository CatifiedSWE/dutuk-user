/**
 * ValidationHint Component
 * Displays password validation requirements with checkmarks
 */

import React from 'react';
import { PasswordValidation } from '@/lib/validation';

interface ValidationHintProps {
  validation: PasswordValidation;
  show?: boolean;
}

export default function ValidationHint({ validation, show = true }: ValidationHintProps) {
  if (!show) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <ValidationItem
        checked={validation.checks.minLength}
        label="At least 6 characters"
      />
      <ValidationItem
        checked={validation.checks.hasNumber}
        label="Contains at least 1 number"
      />
      <ValidationItem
        checked={validation.checks.hasSpecialChar}
        label="Contains at least 1 special character (!@#$%^&*)"
      />
    </div>
  );
}

interface ValidationItemProps {
  checked: boolean;
  label: string;
}

function ValidationItem({ checked, label }: ValidationItemProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`flex items-center justify-center w-4 h-4 rounded-full transition-all duration-200 ${
          checked
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        {checked ? (
          <span className="material-symbols-outlined text-xs">check</span>
        ) : (
          <span className="material-symbols-outlined text-xs">close</span>
        )}
      </div>
      <span
        className={`transition-colors duration-200 ${
          checked ? 'text-green-600 font-medium' : 'text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
